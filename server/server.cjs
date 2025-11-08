const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const Database = require('./database.cjs');
const { getConfig, updateConfig } = require('./configManager.cjs');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Initialize database & uploads directory
const db = new Database();
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const buildUserResponse = (user) => {
  if (!user) {
    return null;
  }
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role || 'user',
    firstName: user.first_name || '',
    lastName: user.last_name || '',
    idNumber: user.id_number || '',
    profilePicture: user.profile_picture || '',
    createdAt: user.created_at
  };
};

const validateIdNumber = (idNumber) => {
  if (!idNumber) {
    return true;
  }
  return /^[0-9]{1,10}$/.test(idNumber);
};

const saveProfileImage = async (userId, imageBase64) => {
  if (!imageBase64) {
    return null;
  }
  const matches = imageBase64.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!matches) {
    throw new Error('Invalid image payload');
  }
  const [, , data] = matches;
  const extension = 'jpg';
  const buffer = Buffer.from(data, 'base64');
  const fileName = `user-${userId}-${Date.now()}.${extension}`;
  const outputPath = path.join(uploadsDir, fileName);

  await sharp(buffer)
    .resize(256, 256, { fit: 'cover' })
    .jpeg({ quality: 75 })
    .toFile(outputPath);

  return `/uploads/${fileName}`;
};

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Serve static files from dist folder and uploads
app.use(express.static(path.join(__dirname, '../dist')));
app.use('/uploads', express.static(uploadsDir));

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    if (user.role) {
      req.user = user;
      return next();
    }

    db.getUserById(user.userId, (dbErr, dbUser) => {
      if (dbErr) {
        return res.status(500).json({ error: 'Failed to verify user role' });
      }
      req.user = {
        ...user,
        role: dbUser?.role || 'user'
      };
      next();
    });
  });
};

// Auth routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, idNumber } = req.body;

    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Username, email, password, first name, and last name are required' });
    }

    if (!validateIdNumber(idNumber)) {
      return res.status(400).json({ error: 'ID number must be up to 10 digits' });
    }

    // Check if user already exists
    db.getUserByUsername(username, async (err, existingUser) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      db.getUserByEmail(email, async (err, existingEmail) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        if (existingEmail) {
          return res.status(400).json({ error: 'Email already exists' });
        }

        // Hash password and create user
        const hashedPassword = await bcrypt.hash(password, 10);

        db.getUserCount((countErr, result) => {
          if (countErr) {
            return res.status(500).json({ error: 'Failed to determine user role' });
          }

          const role = (result?.count ?? 0) === 0 ? 'admin' : 'user';

          db.createUser(
            username,
            email,
            hashedPassword,
            role,
            { firstName, lastName, idNumber },
            (err, userId) => {
              if (err) {
                return res.status(500).json({ error: 'Failed to create user' });
              }

              const userPayload = { id: userId, username, email, role, first_name: firstName, last_name: lastName, id_number: idNumber, created_at: new Date().toISOString() };
              const token = jwt.sign({ userId, username, role }, JWT_SECRET, { expiresIn: '24h' });
              res.status(201).json({ 
                message: 'User created successfully', 
                token, 
                user: buildUserResponse(userPayload) 
              });
            }
          );
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/login', (req, res) => {
  try {
    const { identifier, username, email, password } = req.body ?? {};
    const loginIdentifier = ((identifier ?? username ?? email) || '').trim();

    if (!loginIdentifier || !password) {
      return res.status(400).json({ error: 'Username or email and password are required' });
    }

    db.getUserByIdentifier(loginIdentifier, async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user.id, username: user.username, role: user.role || 'user' }, JWT_SECRET, { expiresIn: '24h' });
      res.json({
        message: 'Login successful',
        token,
        user: buildUserResponse(user),
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Booking routes
app.post('/api/bookings', authenticateToken, (req, res) => {
  try {
    const { title, date, startTime, endTime, description } = req.body;
    const userId = req.user.userId;

    if (!title || !date || !startTime || !endTime) {
      return res.status(400).json({ error: 'Title, date, start time, and end time are required' });
    }

    db.createBooking(userId, title, date, startTime, endTime, description || '', (err, bookingId) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to create booking' });
      }

      res.status(201).json({ 
        message: 'Booking created successfully', 
        booking: { id: bookingId, title, date, startTime, endTime, description } 
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/bookings', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;

    db.getBookingsByUser(userId, (err, bookings) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch bookings' });
      }

      res.json({ bookings });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/bookings/date/:date', authenticateToken, (req, res) => {
  try {
    const { date } = req.params;

    db.getBookingsByDate(date, (err, bookings) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch bookings' });
      }

      res.json({ bookings });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/bookings/recent', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;

    db.getRecentBookingsByUser(userId, (err, bookings) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch recent bookings' });
      }

      res.json(bookings);
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/bookings/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, startTime, endTime, description } = req.body;
    const userId = req.user.userId;

    if (!title || !date || !startTime || !endTime) {
      return res.status(400).json({ error: 'Title, date, start time, and end time are required' });
    }

    db.updateBooking(id, userId, title, date, startTime, endTime, description || '', (err, changes) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to update booking' });
      }

      if (changes === 0) {
        return res.status(404).json({ error: 'Booking not found or unauthorized' });
      }

      res.json({ message: 'Booking updated successfully' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/bookings/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    db.deleteBooking(id, userId, (err, changes) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete booking' });
      }

      if (changes === 0) {
        return res.status(404).json({ error: 'Booking not found or unauthorized' });
      }

      res.json({ message: 'Booking deleted successfully' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'sLOt[B] API is running' });
});

// Profile routes
app.get('/api/profile', authenticateToken, (req, res) => {
  db.getUserById(req.user.userId, (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to load profile' });
    }
    res.json({ user: buildUserResponse(user) });
  });
});

app.put('/api/profile', authenticateToken, (req, res) => {
  const { firstName = '', lastName = '', idNumber = '' } = req.body;

  if (!firstName || !lastName) {
    return res.status(400).json({ error: 'First name and last name are required' });
  }

  if (!validateIdNumber(idNumber)) {
    return res.status(400).json({ error: 'ID number must be up to 10 digits' });
  }

  db.updateUserProfile(req.user.userId, firstName, lastName, idNumber, undefined, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to update profile' });
    }

    db.getUserById(req.user.userId, (fetchErr, user) => {
      if (fetchErr) {
        return res.status(500).json({ error: 'Failed to load updated profile' });
      }
      res.json({ user: buildUserResponse(user) });
    });
  });
});

app.put('/api/profile/password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current and new passwords are required' });
  }

  db.getUserById(req.user.userId, async (err, user) => {
    if (err || !user) {
      return res.status(500).json({ error: 'Failed to verify user' });
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    db.updateUserPassword(req.user.userId, hashed, (updateErr) => {
      if (updateErr) {
        return res.status(500).json({ error: 'Failed to update password' });
      }
      res.json({ message: 'Password updated successfully' });
    });
  });
});

app.post('/api/profile/avatar', authenticateToken, async (req, res) => {
  const { image } = req.body || {};

  if (!image) {
    return res.status(400).json({ error: 'Image payload is required' });
  }

  try {
    const storedPath = await saveProfileImage(req.user.userId, image);
    db.updateUserProfile(req.user.userId, undefined, undefined, undefined, storedPath, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to update avatar' });
      }

      db.getUserById(req.user.userId, (fetchErr, user) => {
        if (fetchErr) {
          return res.status(500).json({ error: 'Failed to load updated profile' });
        }
        res.json({ user: buildUserResponse(user) });
      });
    });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Failed to process image' });
  }
});

// Admin routes
app.get('/api/admin/users', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin privileges required' });
  }

  db.listUsers((err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
    res.json({ users: users.map(buildUserResponse) });
  });
});

app.put('/api/admin/users/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin privileges required' });
  }

  const { id } = req.params;
  const { firstName, lastName, idNumber, role } = req.body || {};

  if (idNumber && !validateIdNumber(idNumber)) {
    return res.status(400).json({ error: 'ID number must be up to 10 digits' });
  }

  db.adminUpdateUser(id, {
    first_name: firstName,
    last_name: lastName,
    id_number: idNumber,
    role
  }, (err, changes) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to update user' });
    }

    if (changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    db.getUserById(id, (fetchErr, user) => {
      if (fetchErr || !user) {
        return res.status(500).json({ error: 'Failed to reload user' });
      }
      res.json({ user: buildUserResponse(user) });
    });
  });
});

// Config routes
app.get('/api/config', (req, res) => {
  try {
    const config = getConfig();
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load configuration' });
  }
});

app.put('/api/config', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin privileges required' });
  }

  try {
    const updatedConfig = updateConfig(req.body || {});
    res.json({ message: 'Configuration updated', config: updatedConfig });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update configuration' });
  }
});

// Serve the React app for all non-API routes
app.use((req, res, next) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  } else {
    next();
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access from network: http://192.168.1.232:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  db.close();
  process.exit(0);
});
