# 🎯 Quick Reference Card

> **sLOt[B] v0.1.7** - Essential commands and locations at a glance

---

## ⚡ Start Development

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run dev

# Open: http://localhost:5554
```

---

## 🎨 Change Colors

**File**: `src/styles/variables.css`

```css
/* Line 40 - Change primary accent */
--color-coral-pink: #FF3366;  /* Your color here */

/* Line 47 - Change sidebar */
--color-burgundy: #8B4367;    /* Your color here */
```

💡 **That's it!** Changes apply everywhere automatically.

---

## 🏷️ Change Branding

**File**: `config/app-config.json`

```json
{
  "app": {
    "name": "Your Name Here",
    "tagline": "Your Tagline Here"
  }
}
```

---

## 🐳 Docker Quick Start

```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# View logs
docker-compose logs -f
```

---

## 👤 Create Admin

```bash
npm run promote-admin
# Enter username when prompted
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/styles/variables.css` | 🎨 **All colors** (single source!) |
| `config/app-config.json` | 🏷️ **Branding** (name, tagline) |
| `PROJECT_GUIDE.md` | 📚 **Full documentation** |
| `.env` | 🔐 **Secrets** (JWT, ports) |
| `data/bookings.db` | 💾 **Database** (backup this!) |

---

## 🌈 Color Variables Reference

```css
/* Main accent */
--accent-primary        /* Buttons, highlights */

/* Text colors */
--text-primary          /* Main text (white) */
--text-secondary        /* Secondary text (beige) */
--text-muted            /* Subtle text */

/* Backgrounds */
--bg-primary            /* Main background */
--surface-calendar      /* Calendar container */
--surface-sidebar       /* Activity panel */

/* Status */
--success-color         /* Green confirmations */
--danger-color          /* Red delete/logout */
--warning-color         /* Orange warnings */
```

---

## 🔥 Hot Commands

```bash
# Development
npm run dev                 # Frontend dev server
npm run server              # Backend dev server

# Production
npm run build               # Build for deployment
npm start                   # Run production

# Database
npm run promote-admin       # Make user admin
npm run migrate-db          # Update schema

# Docker
docker-compose up -d        # Start container
docker-compose logs -f      # View logs
docker-compose down         # Stop container
```

---

## 📊 Port Reference

| Service | Port | URL |
|---------|------|-----|
| Frontend Dev | 5554 | http://localhost:5554 |
| Backend API | 5000 | http://localhost:5000 |
| Docker | 5000 | http://localhost:5000 |

---

## 🎨 Theme Hierarchy

```
variables.css (Define colors)
      ↓
index.css (Import variables)
      ↓
Components (Use var(--color-name))
```

**Change colors in ONE place = Updates EVERYWHERE!**

---

## 🆘 Quick Fixes

### Port in use?
```bash
lsof -i :5000
kill -9 <PID>
```

### Database issues?
```bash
rm data/bookings.db
npm run server  # Recreates DB
```

### Upload errors?
```bash
mkdir -p uploads
chmod 755 uploads
```

---

## 📖 Need More Help?

👉 **[Read the Complete Guide](PROJECT_GUIDE.md)**

Covers:
- 🎨 Detailed theme customization
- 🐳 Docker deployment
- ☁️ Production deployment
- ⚙️ All configuration options
- 🛠️ Development workflow
- 📦 Project structure

---

## 🔗 Quick Links

- 📚 [PROJECT_GUIDE.md](PROJECT_GUIDE.md) - Complete documentation
- 📝 [README.md](README.md) - Project overview
- 📋 [CHANGELOG.md](CHANGELOG.md) - Version history
- 🐙 [GitHub](https://github.com/thebigbearhead/slotB-calendar)

---

**🎨 sLOt[B] v0.1.7** | Made with 💖 by [@thebigbearhead](https://github.com/thebigbearhead)
