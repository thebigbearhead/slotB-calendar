# slotB 📅✨

slotB is a modern appointment calendar for creative studios. It ships with a React/Vite front-end, an Express API, SQLite persistence, user authentication, profile management, and a slick modal workflow for creating and editing bookings.

---

## 🌟 Highlights

- 🔐 **Auth out of the box** – JWT-based register/login plus password updates from the Profile modal.
- 🗓️ **Bangkok-aware calendar** – every booking is normalized to the Bangkok timezone helpers in `src/utils/timezone.js`.
- 🧑‍🎨 **Brandable UI** – override logos, colors, and copy via `config/app-config.json` without touching code.
- 📸 **Profile tools** – avatar uploader with image cropper, ID tracking, and password reset.
- 🛠️ **Admin dashboard** – elevated users get `/admin` for activity insights and user management.
- 🐳 **Container ready** – Dockerfile + Compose stack keep the API, static build, config, and uploads portable.

---

## 🧱 Tech Stack

| Layer        | Tech                                                                         |
|--------------|------------------------------------------------------------------------------|
| Front-end    | React 19 + Vite + React Router                                               |
| Styling      | Custom CSS (Tokyo Night / Dracula palette)                                   |
| API          | Express 5, JWT, bcrypt                                                       |
| Database     | SQLite (`server/slotb.db` by default, configurable via `DATABASE_PATH`)      |
| Auth Context | React Context + localStorage persistence                                     |
| Dev Tooling  | ESLint 9, Vite dev server, Docker, npm scripts                               |

---

## 🗂️ Project Map

```
slotB/
├─ src/                     # React app (components, context, utils, styles)
├─ server/                  # Express server, SQLite database file
├─ config/app-config.json   # Branding + copy overrides
├─ uploads/                 # User-uploaded avatars (served statically)
├─ scripts/                 # Maintenance scripts (migrations, admin promotion)
├─ public/                  # Static assets served by Vite
├─ docker-compose.yml       # One-command stack with SQLite volume
├─ Dockerfile               # Multi-stage production image
├─ README.md                # (You are here)
└─ slotB-backup.zip         # Handy snapshot of the current workspace (ignored by git)
```

---

## 🛠️ Prerequisites

- Node.js 20+
- npm 10+
- Optional: Docker 24+ with Docker Compose plugin

---

## 🚀 Quick Start (local dev)

```bash
# 1. Install dependencies
npm install

# 2. Copy env template and customize
cp .env.example .env
echo "JWT_SECRET=<your-strong-secret>" >> .env

# 3. Run the API + Vite dev server concurrently (two terminals)
npm run server     # serves API on http://localhost:5000
npm run dev        # serves front-end with hot reload on http://localhost:5173
```

Open http://localhost:5173, register a user, then start booking.

---

## ⚙️ Environment Variables

| Variable          | Default | Purpose                                                                                       |
|-------------------|---------|------------------------------------------------------------------------------------------------|
| `SLOTB_HOST_PORT` | `5080`  | Host port exposed by Docker Compose (maps to container port 5000).                            |
| `JWT_SECRET`      | `change-me` | Secret used by the API to sign JWTs. **Set a unique, strong value in every environment.** |
| `DATABASE_PATH`   | `/data/slotb.db` (Docker) / `server/slotb.db` (local) | Controls where SQLite data lives. Override per deployment if needed. |

You can also export `JWT_SECRET` or `DATABASE_PATH` before running any npm script to override the defaults without editing files.

---

## 📦 Useful npm Scripts

| Command                | Description                                                                    |
|------------------------|--------------------------------------------------------------------------------|
| `npm run dev`          | Start Vite dev server with hot reload (front-end only).                        |
| `npm run server`       | Start Express API in watch mode (nodemon style) from `server/server.cjs`.      |
| `npm run build`        | Production build via Vite (outputs to `dist/`).                                |
| `npm run preview`      | Serve the built assets locally for smoke tests.                                |
| `npm run start`        | Build then run the API (suitable for bare-metal deploys).                      |
| `npm run migrate-db`   | Apply SQLite migrations / ensure schema (safe to run multiple times).          |
| `npm run promote-admin -- <user>` | Promote an existing user (by username or email) to admin.          |

---

## 🐳 Docker Workflow

```bash
cp .env.example .env
# edit SLOTB_HOST_PORT + JWT_SECRET
docker compose up -d --build
```

What you get:
- `slotb` service listening on `http://<host-ip>:${SLOTB_HOST_PORT}`.
- Persistent SQLite stored inside the `slotb-data` volume (`/data/slotb.db`).
- `config/` and `uploads/` are bind-mounted so branding and avatars survive rebuilds.

Stop and remove containers with:

```bash
docker compose down          # stop
docker compose down -v       # stop + delete slotb-data volume
```

Need to promote an admin inside the container?:

```bash
docker exec -it slotb \
  sh -c "DATABASE_PATH=/data/slotb.db npm run migrate-db && DATABASE_PATH=/data/slotb.db npm run promote-admin -- myuser"
```

---

## 🧑‍💻 Developing Features

1. **Run both servers**: `npm run server` for API + `npm run dev` for the UI.
2. **Auth context**: uses `localStorage` (`token` + `user`) so remember to clear storage if you mangle the schema.
3. **API calls**: proxied via Vite (`/api/...`) so they hit the Express server during dev. No need to hardcode host URLs.
4. **Styling**: Colors + shadows come from CSS variables in `src/index.css`. Update there to keep the palette consistent.
5. **Brand overrides**: `config/app-config.json` drives the logo, app title, and tagline consumed via `ConfigContext`.

---

## 📁 Data & Uploads

- `server/slotb.db` – default SQLite file for local dev. Add it to backups but keep it out of source control.
- `uploads/` – avatar images saved via the profile modal. Ensure this folder remains writable in production.
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
