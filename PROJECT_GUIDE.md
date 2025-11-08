# 📚 sLOt[B] - Complete Project Guide

> 🎨 A beautiful photoshoot booking calendar with warm, elegant theming

## 📖 Table of Contents

- [🚀 Quick Start](#-quick-start)
- [🎨 Theme & CSS Configuration](#-theme--css-configuration)
- [🐳 Docker Deployment](#-docker-deployment)
- [☁️ Production Deployment](#️-production-deployment)
- [⚙️ Configuration](#️-configuration)
- [🌍 Timezone Setup](#-timezone-setup)
- [👥 User Management](#-user-management)
- [🛠️ Development Guide](#️-development-guide)
- [📦 Project Structure](#-project-structure)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and **npm**
- **Git** (optional but recommended)

### Installation

```bash
# 1️⃣ Clone the repository
git clone https://github.com/thebigbearhead/slotB-calendar.git
cd slotB-calendar

# 2️⃣ Install dependencies
npm install

# 3️⃣ Start the development server
npm run dev

# 4️⃣ In a new terminal, start the backend
npm run server
```

🎉 **Done!** Open your browser to `http://localhost:5554`

---

## 🎨 Theme & CSS Configuration

### 🌈 Color Palette

The entire application uses a **centralized color system** in `src/styles/variables.css`. All colors are defined in ONE place for easy customization!

#### 📍 Main Configuration File

**Location**: `src/styles/variables.css`

This is your **SINGLE SOURCE OF TRUTH** for all colors, spacing, and theme variables.

### 🎨 Color Scheme Overview

#### **Palette 1: Dark/Red Theme** (Primary Colors)
- 🌸 **Coral Pink** `#FF3366` - Primary accent, buttons, highlights
- 💜 **Mauve** `#8B4789` - Secondary accent
- 🟣 **Deep Purple** `#4A3459` - Dark surfaces, backgrounds

#### **Palette 2: Warm Theme** (Activity Sidebar)
- 🌟 **Warm Beige** `#F4D8A1` - Light text on dark backgrounds
- 🧱 **Terracotta** `#C07869` - Sidebar user card background
- 🍷 **Burgundy** `#8B4367` - Sidebar content background

### ✏️ How to Change Colors

#### **Step 1**: Open the main config file
```bash
# Edit this file to change ALL colors across the app
open src/styles/variables.css
```

#### **Step 2**: Find the color you want to change

All colors are organized into sections with clear comments:

```css
/* ============================================
   PRIMARY COLORS (Change these for main theme)
   ============================================ */

/* 🌸 Primary accent color - Used for buttons, highlights, active states */
--color-coral-pink: #FF3366;

/* 💜 Secondary accent - Used for gradients, hover effects */
--color-mauve: #8B4789;

/* 🟣 Dark base - Used for dark backgrounds and surfaces */
--color-deep-purple: #4A3459;
```

#### **Step 3**: Change the hex color value

Just replace the hex code with your new color:

```css
/* Before */
--color-coral-pink: #FF3366;

/* After - Change to your color */
--color-coral-pink: #00D9FF;
```

#### **Step 4**: Save and see changes instantly! ⚡

The dev server will auto-reload and apply your changes across the entire app.

### 🎯 Quick Color Reference

| Element | CSS Variable | Default Color |
|---------|--------------|---------------|
| 🔘 Primary Buttons | `--accent-primary` | Coral Pink (#FF3366) |
| 📅 Calendar Background | `--surface-calendar` | Purple Gradient |
| 📊 Activity Sidebar | `--surface-sidebar` | Burgundy Gradient |
| 📝 Text (Primary) | `--text-primary` | White (#FFFFFF) |
| 📝 Text (Secondary) | `--text-secondary` | Warm Beige (#F4D8A1) |
| 🟦 Weekdays Header | `--surface-weekdays` | Dark Purple Gradient |
| ⚠️ Danger/Logout | `--danger-color` | Coral Pink (#FF3366) |

### 📂 CSS File Structure

```
src/
├── styles/
│   └── variables.css        ← 🎨 MAIN CONFIG - Edit colors here!
├── index.css                ← Global styles & imports
└── components/
    ├── Calendar.css         ← Calendar-specific styles
    ├── ActivitySidebar.css  ← Sidebar-specific styles
    ├── Auth.css            ← Login/Register styles
    ├── BookingModal.css    ← Modal styles
    ├── ProfilePage.css     ← Profile page styles
    └── AdminDashboard.css  ← Admin panel styles
```

### 🔗 How Colors Connect

```
variables.css (Define)
      ↓
index.css (Import)
      ↓
All Components (Use)
```

**Example Flow:**
1. You define `--accent-primary: #FF3366` in `variables.css`
2. `index.css` imports `variables.css`
3. `Calendar.css` uses `background: var(--accent-primary)`
4. All buttons across the app use this color! 🎨

### 🎭 Advanced: Creating Custom Themes

Want to create a completely new color scheme? Just update these key variables:

```css
/* 🎨 Your Custom Theme */
:root {
  /* Main Colors */
  --color-coral-pink: #YOUR_COLOR_1;
  --color-mauve: #YOUR_COLOR_2;
  --color-deep-purple: #YOUR_COLOR_3;
  
  /* Sidebar Colors */
  --color-warm-beige: #YOUR_COLOR_4;
  --color-terracotta: #YOUR_COLOR_5;
  --color-burgundy: #YOUR_COLOR_6;
}
```

---

## 🐳 Docker Deployment

### 🚢 Quick Deploy with Docker Compose

The easiest way to run sLOt[B] in production!

#### **Step 1**: Build and start the container

```bash
docker-compose up -d
```

That's it! 🎉 The app will be running on `http://localhost:5000`

#### **Step 2**: Check status

```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

### 📝 Docker Configuration

#### `docker-compose.yml` Breakdown

```yaml
version: '3.8'

services:
  app:
    build: .                    # 🏗️ Build from Dockerfile
    ports:
      - "5000:5000"            # 🌐 Expose port 5000
    environment:
      - NODE_ENV=production    # 🚀 Production mode
      - PORT=5000             # 🔌 Server port
    volumes:
      - ./data:/app/data      # 💾 Persist database
      - ./uploads:/app/uploads # 📸 Persist uploaded images
      - ./config:/app/config  # ⚙️ Persist configuration
    restart: unless-stopped   # 🔄 Auto-restart on failure
```

### 🔧 Environment Variables

Create a `.env` file for custom configuration:

```bash
# Server Configuration
PORT=5000
NODE_ENV=production

# JWT Secret (CHANGE THIS!)
JWT_SECRET=your-super-secret-jwt-key-change-me

# Database
DATABASE_PATH=./data/bookings.db

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

### 📦 Docker Best Practices

1. **Data Persistence**: Always use volumes for database and uploads
2. **Security**: Change the JWT_SECRET in production
3. **Updates**: Rebuild after changes with `docker-compose up -d --build`
4. **Backups**: Regularly backup the `./data` and `./uploads` directories

### 🔄 Update Existing Deployment

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Verify it's running
docker-compose logs -f
```

---

## ☁️ Production Deployment

### 🌐 Deployment Options

#### **Option 1: Traditional Server (VPS/Dedicated)**

```bash
# 1️⃣ SSH into your server
ssh user@your-server.com

# 2️⃣ Clone the repository
git clone https://github.com/thebigbearhead/slotB-calendar.git
cd slotB-calendar

# 3️⃣ Install dependencies
npm install

# 4️⃣ Build the frontend
npm run build

# 5️⃣ Start with PM2 (process manager)
npm install -g pm2
pm2 start npm --name "slotB" -- run server
pm2 save
pm2 startup
```

#### **Option 2: Docker on Server**

```bash
# 1️⃣ SSH into your server
ssh user@your-server.com

# 2️⃣ Clone and deploy
git clone https://github.com/thebigbearhead/slotB-calendar.git
cd slotB-calendar
docker-compose up -d

# 3️⃣ Setup reverse proxy (Nginx example)
# See Nginx configuration below
```

#### **Option 3: Cloud Platforms**

- **Railway**: Connect GitHub repo → Deploy automatically
- **Render**: Connect GitHub repo → Set build command to `npm install && npm run build` → Start command to `npm run server`
- **DigitalOcean App Platform**: Similar to Railway/Render
- **AWS/GCP/Azure**: Use Docker or traditional deployment

### 🔒 Nginx Reverse Proxy Setup

Create `/etc/nginx/sites-available/slotb`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend (static files)
    location / {
        root /path/to/slotB-calendar/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/slotb /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 🔐 SSL/HTTPS Setup (Let's Encrypt)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is configured automatically!
```

---

## ⚙️ Configuration

### 📋 Application Config

**Location**: `config/app-config.json`

```json
{
  "app": {
    "name": "sLOt[B]",
    "tagline": "Photoshoot Booking System",
    "timezone": "Asia/Bangkok"
  },
  "ui": {
    "showActivitySidebar": true,
    "theme": "dark"
  },
  "features": {
    "enableRegistration": true,
    "requireEmailVerification": false
  }
}
```

### 🎛️ Available Options

| Setting | Description | Default |
|---------|-------------|---------|
| `app.name` | Application name | "sLOt[B]" |
| `app.tagline` | Subtitle/tagline | "Photoshoot Booking System" |
| `app.timezone` | Server timezone | "Asia/Bangkok" |
| `ui.showActivitySidebar` | Show/hide activity panel | `true` |
| `features.enableRegistration` | Allow new user registration | `true` |

---

## 🌍 Timezone Setup

The application is configured for **Bangkok timezone (UTC+7)** by default.

### 🔄 Change Timezone

Edit `config/app-config.json`:

```json
{
  "app": {
    "timezone": "America/New_York"  // Change to your timezone
  }
}
```

### 🗺️ Supported Timezones

Use any **IANA timezone identifier**:
- `America/New_York` (EST/EDT)
- `Europe/London` (GMT/BST)
- `Asia/Tokyo` (JST)
- `Australia/Sydney` (AEST/AEDT)
- [Full list](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

---

## 👥 User Management

### 👤 Create First Admin User

```bash
# Register a user through the UI first, then promote to admin
npm run promote-admin

# Follow the prompts
# Enter username: your_username
```

### 🔑 User Roles

- **Admin**: Full access, can manage all bookings and users
- **User**: Can create/manage own bookings only

### 📊 Database Management

```bash
# Migrate existing users (if needed)
npm run migrate-db
```

**Database location**: `data/bookings.db` (SQLite)

---

## 🛠️ Development Guide

### 🏃‍♂️ Running in Development

```bash
# Terminal 1: Frontend dev server (with hot reload)
npm run dev

# Terminal 2: Backend server
npm run server
```

- Frontend: `http://localhost:5554`
- Backend API: `http://localhost:5000`

### 📦 Available Scripts

```bash
npm run dev        # Start Vite dev server
npm run server     # Start backend server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

### 🔌 API Endpoints

#### **Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

#### **Bookings**
- `GET /api/bookings` - Get user's bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking
- `GET /api/bookings/recent` - Get recent activity

#### **User**
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `POST /api/user/avatar` - Upload avatar

#### **Admin**
- `GET /api/admin/bookings` - Get all bookings
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/bookings/:id` - Delete any booking

---

## 📦 Project Structure

```
slotB-calendar/
├── 📂 src/                          # Frontend source code
│   ├── 📂 components/               # React components
│   │   ├── Calendar.jsx            # Main calendar view
│   │   ├── ActivitySidebar.jsx     # Activity panel
│   │   ├── BookingModal.jsx        # Booking creation/edit
│   │   ├── ProfilePage.jsx         # User profile
│   │   ├── AdminDashboard.jsx      # Admin panel
│   │   └── Auth components         # Login/Register
│   ├── 📂 context/                  # React context providers
│   │   ├── AuthContext.jsx         # Authentication state
│   │   ├── ConfigContext.jsx       # App configuration
│   │   └── ThemeContext.jsx        # Theme management
│   ├── 📂 styles/                   # CSS styling
│   │   └── variables.css           # 🎨 MAIN COLOR CONFIG
│   ├── 📂 utils/                    # Utility functions
│   │   ├── timezone.js             # Timezone helpers
│   │   └── cropImage.js            # Image cropping
│   ├── App.jsx                     # Main app component
│   ├── main.jsx                    # App entry point
│   └── index.css                   # Global styles
├── 📂 server/                       # Backend server
│   ├── server.cjs                  # Express server
│   ├── database.cjs                # Database functions
│   └── configManager.cjs           # Config management
├── 📂 scripts/                      # Utility scripts
│   ├── migrate-users.cjs           # User migration
│   └── promote-admin.cjs           # Promote user to admin
├── 📂 config/                       # Configuration files
│   └── app-config.json             # App settings
├── 📂 data/                         # Database files
│   └── bookings.db                 # SQLite database
├── 📂 uploads/                      # User uploaded files
│   └── avatars/                    # Profile pictures
├── 📂 public/                       # Static assets
│   └── images/                     # App images
├── 📄 Dockerfile                    # Docker configuration
├── 📄 docker-compose.yml           # Docker Compose config
├── 📄 package.json                 # Dependencies
├── 📄 vite.config.js               # Vite configuration
└── 📄 PROJECT_GUIDE.md            # 📚 This file!
```

---

## 🎯 Quick Tips

### 💡 Common Tasks

#### **Change App Name**
Edit `config/app-config.json`:
```json
{
  "app": {
    "name": "Your New Name"
  }
}
```

#### **Change Theme Colors**
Edit `src/styles/variables.css` - change any `--color-*` variable

#### **Add New Features**
All feature flags are in `config/app-config.json`

#### **Backup Database**
```bash
cp data/bookings.db data/bookings.backup.db
```

#### **Reset Database**
```bash
rm data/bookings.db
# Database will be recreated on next server start
```

---

## 🆘 Troubleshooting

### ❌ Port Already in Use

```bash
# Find what's using the port
lsof -i :5000
# Kill the process
kill -9 <PID>
```

### 🔄 Frontend Can't Connect to Backend

Check `vite.config.js` - proxy should point to `http://localhost:5000`

### 🗄️ Database Errors

```bash
# Reset database
rm data/bookings.db
npm run server  # Will recreate database
```

### 🖼️ Upload Errors

Check that `uploads` directory exists and has write permissions:
```bash
mkdir -p uploads
chmod 755 uploads
```

---

## 📞 Support & Contributing

### 🐛 Found a Bug?

Open an issue on GitHub with:
- Description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

### 💡 Feature Request?

Open an issue with the `enhancement` label!

### 🤝 Want to Contribute?

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source and available for personal and commercial use.

---

## 🙏 Credits

Created with ❤️ by [@thebigbearhead](https://github.com/thebigbearhead)

**Tech Stack:**
- ⚛️ React 19
- ⚡ Vite
- 🎨 Custom CSS (no framework!)
- 🚂 Express.js
- 🗄️ SQLite
- 🐳 Docker
- 🌍 date-fns-tz

---

## 🌟 Show Your Support

If you find this project helpful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting features
- 🤝 Contributing code

---

**Made with 💖 and lots of ☕**

**Version**: 0.1.7

---
