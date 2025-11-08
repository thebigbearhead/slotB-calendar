<div id="pictures">
<img src="https://raw.githubusercontent.com/thebigbearhead/slotB-calendar/refs/heads/main/public/images/logo.png" width="220" height="220"></img>
<img src="https://raw.githubusercontent.com/thebigbearhead/slotB-calendar/refs/heads/main/public/banner.png" width"410" height="230"></img>
</div>

# 🎨 sLOt[B] - Photoshoot Booking Calendar

> A beautiful, modern appointment calendar for creative studios with elegant warm theming

[![Version](https://img.shields.io/badge/version-0.1.7-coral.svg)](https://github.com/thebigbearhead/slotB-calendar)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Made with Love](https://img.shields.io/badge/made%20with-❤️-red.svg)](https://github.com/thebigbearhead)

---

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based register/login with profile management
- 📅 **Bangkok Timezone** - Automatic timezone normalization (configurable to any timezone)
- 🎨 **Beautiful Theming** - Warm coral & burgundy palette with customizable colors
- 👤 **User Profiles** - Avatar upload with image cropper, customizable profiles
- 📊 **Activity Sidebar** - Real-time booking activity and statistics
- 🛡️ **Admin Dashboard** - User management and system-wide booking oversight
- 🐳 **Docker Ready** - One-command deployment with Docker Compose
- 🎭 **Fully Customizable** - Single config file for colors, branding, and features

---

## 🚀 Quick Start

### Local Development

```bash
# 1️⃣ Clone the repository
git clone https://github.com/thebigbearhead/slotB-calendar.git
cd slotB-calendar

# 2️⃣ Install dependencies
npm install

# 3️⃣ Start development (two terminals)
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend  
npm run dev
```

🎉 Open `http://localhost:5554` and start booking!

### Docker Deployment

```bash
# One command to run everything
docker-compose up -d
```

🌐 Access at `http://localhost:5000`

---

## 📚 Documentation

📖 **[Complete Project Guide](PROJECT_GUIDE.md)** - Everything you need to know!

- 🎨 **Theme Customization** - How to change colors and styling
- 🐳 **Docker Deployment** - Complete Docker and deployment guide
- ☁️ **Production Setup** - Deploy to VPS, cloud platforms, or containers
- ⚙️ **Configuration** - All available settings and options
- 👥 **User Management** - Create admins and manage users
- 🛠️ **Development** - API endpoints and development workflow

---

## 🎨 Customization

### Change Colors (Single File!)

All colors are defined in **one place**: `src/styles/variables.css`

```css
/* Change primary accent color */
--color-coral-pink: #FF3366;  /* Change to your brand color! */

/* Change sidebar colors */
--color-burgundy: #8B4367;    /* Activity sidebar background */
--color-terracotta: #C07869;  /* User card background */
```

**That's it!** Changes apply everywhere automatically. See [PROJECT_GUIDE.md](PROJECT_GUIDE.md#-theme--css-configuration) for details.

### Change Branding

Edit `config/app-config.json`:

```json
{
  "app": {
    "name": "Your Studio Name",
    "tagline": "Your Custom Tagline",
    "timezone": "America/New_York"
  }
}
```

---

## 🛠️ Tech Stack

| Layer        | Technology                                     |
|--------------|------------------------------------------------|
| **Frontend** | ⚛️ React 19, ⚡ Vite, 🎨 Custom CSS           |
| **Backend**  | 🚂 Express.js, 🔐 JWT, 🔒 bcryptjs            |
| **Database** | 🗄️ SQLite (portable, no setup needed)         |
| **Styling**  | 🌈 CSS Variables, Montserrat Font             |
| **Deploy**   | 🐳 Docker, Docker Compose                     |
| **Utils**    | 📅 date-fns-tz, 🖼️ react-easy-crop            |

---
---

## 📦 Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (frontend with hot reload) |
| `npm run server` | Start Express API backend |
| `npm run build` | Build for production |
| `npm start` | Build and run production server |
| `npm run promote-admin` | Promote a user to admin |
| `npm run migrate-db` | Run database migrations |

---

## � Project Structure

```
slotB-calendar/
├── 📂 src/                    # Frontend React application
│   ├── components/           # UI components
│   ├── context/              # React contexts (Auth, Config, Theme)
│   ├── styles/               # 🎨 CSS files (variables.css here!)
│   └── utils/                # Helper functions
├── 📂 server/                 # Backend Express API
│   ├── server.cjs            # Main server file
│   ├── database.cjs          # Database operations
│   └── configManager.cjs     # Config management
├── 📂 config/                 # Application configuration
│   └── app-config.json       # Branding & settings
├── 📂 data/                   # Database files
│   └── bookings.db           # SQLite database
├── 📂 uploads/                # User uploaded files
├── 📄 PROJECT_GUIDE.md       # 📚 Complete documentation
├── 📄 docker-compose.yml     # Docker deployment
└── 📄 package.json           # Dependencies & scripts
```

---

## 👥 User Management

### Create Admin User

```bash
# Register a user through the web interface first, then:
npm run promote-admin

# Follow the prompts to enter username
```

---

## 🐳 Docker Details

### Quick Commands

```bash
# Start application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop application
docker-compose down

# Rebuild after changes
docker-compose up -d --build
```

### Data Persistence

All data is stored in Docker volumes:
- `./data` - SQLite database
- `./uploads` - User avatars
- `./config` - Configuration files

**Backup regularly**: `cp -r data data-backup`

---

## 🌍 Timezone Configuration

Change timezone in `config/app-config.json`:

```json
{
  "app": {
    "timezone": "America/New_York"
  }
}
```

Supports all [IANA timezone identifiers](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

---

## 🔒 Security Notes

- 🔑 **Change JWT_SECRET** in production
- 🔐 Use HTTPS in production (reverse proxy with Nginx/Caddy)
- 🛡️ Keep dependencies updated: `npm audit`
- 💾 Regular database backups recommended

---

## 🆘 Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### Database Issues

```bash
# Reset database (will delete all data!)
rm data/bookings.db
npm run server  # Will recreate database
```

### Upload Errors

```bash
# Ensure uploads directory exists and has correct permissions
mkdir -p uploads
chmod 755 uploads
```

---

## � License

MIT License - Feel free to use this project for personal or commercial purposes!

---

## 🙏 Acknowledgments

Created with ❤️ by [@thebigbearhead](https://github.com/thebigbearhead)

**Special thanks to:**
- The React and Vite teams
- The open-source community
- Everyone who contributed ideas and feedback

---

## 🌟 Support

If you find this project useful:

- ⭐ Star the repository
- 🐛 Report bugs via issues
- 💡 Suggest features
- 🤝 Contribute improvements
- 📢 Share with others

---

## � Contact & Links

- 🐙 **GitHub**: [@thebigbearhead](https://github.com/thebigbearhead)
- 📖 **Documentation**: [PROJECT_GUIDE.md](PROJECT_GUIDE.md)
- 🐛 **Issues**: [GitHub Issues](https://github.com/thebigbearhead/slotB-calendar/issues)

---

**Made with 💖 and lots of ☕**

**Version 0.1.7** | Last Updated: November 2025
- `slotB-backup.zip` – ad-hoc archive of the repo (ignored by git); regenerate whenever you want a snapshot:  
  `zip -r slotB-backup.zip . -x 'node_modules/**' 'dist/**' 'slotB-backup.zip'`

---

## 🧪 Smoke Checklist

- ✅ `npm run build`
- ✅ `npm run server` (ensure `/api/health` returns `{ status: 'ok' }`)
- ✅ Login, create a booking, edit it, and ensure it appears in the activity sidebar.
- ✅ Avatar upload + crop.
- ✅ Admin view reachable at `/admin` for a promoted account.

---

## 🆘 Troubleshooting

| Symptom | Fix |
|---------|-----|
| `EACCES` while building | Delete or re-own `dist/`; it should be writable by your user before `npm run build`. |
| JWT errors after login | Confirm `JWT_SECRET` matches between API process and any background workers/tests. |
| Docker port conflicts | Change `SLOTB_HOST_PORT` in `.env` and rerun `docker compose up -d`. |
| Blank calendar modal | Ensure both servers are running; front-end requests `/api/bookings` from port 5000. |

---

## 💬 Need Help?

- 📄 Check `DEPLOYMENT.md` for ops-specific notes.
- 🗂️ Review `CSS_GUIDE.md` for styling conventions.
- 🛠️ Use `npm run migrate-db` anytime you pull schema updates.

Happy scheduling with slotB! 🧡
