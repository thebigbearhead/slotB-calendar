const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const resolveDbPath = () => {
  const targetPath = process.env.DATABASE_PATH
    ? path.resolve(process.env.DATABASE_PATH)
    : path.join(__dirname, 'slotb.db');
  const dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return targetPath;
};

const dbPath = resolveDbPath();

class Database {
  constructor() {
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
      } else {
        console.log('Connected to SQLite database');
        this.initTables();
      }
    });
  }

  initTables() {
    // Users table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        first_name TEXT,
        last_name TEXT,
        id_number TEXT,
        profile_picture TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error ensuring users table:', err.message);
      } else {
        this.ensureUserColumns();
      }
    });

    // Bookings table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        date TEXT NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    console.log('Database tables initialized');
  }

  ensureUserColumns() {
    const desiredColumns = [
      { name: 'role', definition: "TEXT DEFAULT 'user'" },
      { name: 'first_name', definition: 'TEXT' },
      { name: 'last_name', definition: 'TEXT' },
      { name: 'id_number', definition: 'TEXT' },
      { name: 'profile_picture', definition: 'TEXT' }
    ];

    this.db.all('PRAGMA table_info(users)', (err, columns) => {
      if (err) {
        console.error('Error checking users table schema:', err.message);
        return;
      }

      desiredColumns.forEach(({ name, definition }) => {
        const hasColumn = columns.some(column => column.name === name);
        if (!hasColumn) {
          this.db.run(`ALTER TABLE users ADD COLUMN ${name} ${definition}`, (alterErr) => {
            if (alterErr && !alterErr.message.includes('duplicate column')) {
              console.error(`Error adding ${name} column:`, alterErr.message);
            } else if (!alterErr) {
              console.log(`Added ${name} column to users table`);
            }
          });
        }
      });
    });
  }

  // User methods
  createUser(username, email, hashedPassword, role, profile = {}, callback) {
    const sql = `
      INSERT INTO users (username, email, password, role, first_name, last_name, id_number, profile_picture)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    this.db.run(sql, [
      username,
      email,
      hashedPassword,
      role,
      profile.firstName || '',
      profile.lastName || '',
      profile.idNumber || '',
      profile.profilePicture || null
    ], function(err) {
      callback(err, this ? this.lastID : null);
    });
  }

  getUserByUsername(username, callback) {
    const sql = 'SELECT * FROM users WHERE username = ?';
    this.db.get(sql, [username], callback);
  }

  getUserByEmail(email, callback) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    this.db.get(sql, [email], callback);
  }

  getUserByIdentifier(identifier, callback) {
    const sql = `
      SELECT * FROM users
      WHERE LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?)
    `;
    this.db.get(sql, [identifier, identifier], callback);
  }

  getUserById(id, callback) {
    const sql = 'SELECT * FROM users WHERE id = ?';
    this.db.get(sql, [id], callback);
  }

  getUserCount(callback) {
    const sql = 'SELECT COUNT(*) as count FROM users';
    this.db.get(sql, [], callback);
  }

  updateUserProfile(userId, firstName, lastName, idNumber, profilePicturePath, callback) {
    const fields = [];
    const values = [];

    if (firstName !== undefined) {
      fields.push('first_name = ?');
      values.push(firstName);
    }
    if (lastName !== undefined) {
      fields.push('last_name = ?');
      values.push(lastName);
    }
    if (idNumber !== undefined) {
      fields.push('id_number = ?');
      values.push(idNumber);
    }
    if (profilePicturePath !== undefined) {
      fields.push('profile_picture = ?');
      values.push(profilePicturePath);
    }

    if (fields.length === 0) {
      return callback(null, 0);
    }

    values.push(userId);
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    this.db.run(sql, values, function(err) {
      callback(err, this ? this.changes : 0);
    });
  }

  updateUserPassword(userId, hashedPassword, callback) {
    const sql = 'UPDATE users SET password = ? WHERE id = ?';
    this.db.run(sql, [hashedPassword, userId], function(err) {
      callback(err, this ? this.changes : 0);
    });
  }

  listUsers(callback) {
    const sql = `
      SELECT id, username, email, role, first_name, last_name, id_number, profile_picture, created_at
      FROM users
      ORDER BY created_at DESC
    `;
    this.db.all(sql, [], callback);
  }

  adminUpdateUser(userId, payload, callback) {
    const fields = [];
    const values = [];

    if (payload.first_name !== undefined) {
      fields.push('first_name = ?');
      values.push(payload.first_name);
    }
    if (payload.last_name !== undefined) {
      fields.push('last_name = ?');
      values.push(payload.last_name);
    }
    if (payload.id_number !== undefined) {
      fields.push('id_number = ?');
      values.push(payload.id_number);
    }
    if (payload.role !== undefined) {
      fields.push('role = ?');
      values.push(payload.role);
    }

    if (fields.length === 0) {
      return callback(null, 0);
    }

    values.push(userId);
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    this.db.run(sql, values, function(err) {
      callback(err, this ? this.changes : 0);
    });
  }

  // Booking methods
  createBooking(userId, title, date, startTime, endTime, description, callback) {
    const sql = 'INSERT INTO bookings (user_id, title, date, start_time, end_time, description) VALUES (?, ?, ?, ?, ?, ?)';
    this.db.run(sql, [userId, title, date, startTime, endTime, description], function(err) {
      callback(err, this ? this.lastID : null);
    });
  }

  getBookingsByUser(userId, callback) {
    const sql = 'SELECT * FROM bookings WHERE user_id = ? ORDER BY date, start_time';
    this.db.all(sql, [userId], callback);
  }

  getBookingsByDate(date, callback) {
    const sql = 'SELECT b.*, u.username FROM bookings b JOIN users u ON b.user_id = u.id WHERE b.date = ? ORDER BY start_time';
    this.db.all(sql, [date], callback);
  }

  deleteBooking(id, userId, callback) {
    const sql = 'DELETE FROM bookings WHERE id = ? AND user_id = ?';
    this.db.run(sql, [id, userId], function(err) {
      callback(err, this ? this.changes : 0);
    });
  }

  updateBooking(id, userId, title, date, startTime, endTime, description, callback) {
    const sql = 'UPDATE bookings SET title = ?, date = ?, start_time = ?, end_time = ?, description = ? WHERE id = ? AND user_id = ?';
    this.db.run(sql, [title, date, startTime, endTime, description, id, userId], function(err) {
      callback(err, this ? this.changes : 0);
    });
  }

  getRecentBookingsByUser(userId, callback) {
    const sql = `
      SELECT * FROM bookings 
      WHERE user_id = ? 
      ORDER BY date DESC, start_time DESC 
      LIMIT 10
    `;
    this.db.all(sql, [userId], callback);
  }

  close() {
    this.db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed');
      }
    });
  }
}

module.exports = Database;
