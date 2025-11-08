# slotB Deployment Summary

## Application Successfully Deployed! 🚀

### Access URLs
- **Main Application**: http://192.168.1.232:5000
- **API Health Check**: http://192.168.1.232:5000/api/health

### What's Running
The application is a full-stack booking calendar with:
- **Frontend**: React 19 application (pre-built, served from `/dist`)
- **Backend**: Express.js API server on port 5000
- **Database**: SQLite database for storing bookings and user data

### Key Features
- User authentication (register/login)
- Photoshoot booking management
- Calendar interface
- JWT-based authentication
- RESTful API endpoints

### API Endpoints
- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `GET /api/bookings` - Get user's bookings
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking
- `GET /api/bookings/date/:date` - Get bookings by date
- `GET /api/bookings/recent` - Get recent bookings
- `GET /api/health` - Health check

### How to Access
From any device on your network (192.168.1.x):
1. Open a web browser
2. Navigate to: **http://192.168.1.232:5000**
3. Register a new account or login

### Server Management

#### Start the Server
```bash
cd /home/raspi/projects/JAMECALDEV/photoshoot-calendar
npm run server
```

#### Stop the Server
Press `Ctrl+C` in the terminal where the server is running

#### Current Status
✅ Server is running on port 5000
✅ Listening on all network interfaces (0.0.0.0)
✅ Accessible from external devices on the same network

## Docker Compose Deployment (New)

For portable installs or when you need multiple calendar instances with unique host ports, use the included `Dockerfile` and `docker-compose.yml`.

1. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env to set SLOTB_HOST_PORT (unique per deployment) and a strong JWT_SECRET
   ```
2. **Start the stack**
   ```bash
   docker compose up -d --build
   ```
3. **Access the instance** via `http://<host-ip>:<SLOTB_HOST_PORT>`
4. **Persistent data**
   - SQLite lives inside the named `slotb-data` volume at `/data/slotb.db`
   - Branding/configuration stays in `./config/app-config.json`, mounted read/write into the container
   - User avatars are kept in `./uploads`, which is bind-mounted to `/app/uploads`
5. **Stop / remove**
   ```bash
   docker compose down        # stop containers
   docker compose down -v     # stop + remove database volume
   ```

### Admin Dashboard URL
After signing in with an admin account, browse to `http://<host-ip>:<port>/admin` to open the dashboard for branding changes and user record maintenance. Regular users can reach their personal settings via `/profile`.

### Granting an Admin Account
If you already have users in the database and need to promote one to admin:
```bash
# Bare-metal install
npm run migrate-db              # add new columns if upgrading
npm run promote-admin -- myuser        # uses server/slotb.db by default

# Docker container (assuming compose service name)
docker exec -it slotb \
  sh -c "DATABASE_PATH=/data/slotb.db npm run migrate-db && DATABASE_PATH=/data/slotb.db npm run promote-admin -- myuser"
```
Replace `myuser` with either the username or email. Future logins for that account will include the admin role and unlock the UI customizer.

### Technical Details
- **Node.js**: v24.10.0
- **npm**: v11.6.1
- **Express**: v5.1.0
- **React**: v19.1.1
- **Database**: SQLite (stored in `/server/slotb.db`)

### Security Notes
⚠️ **Important**: The JWT secret is set to a default value. For production use, set the `JWT_SECRET` environment variable:
```bash
JWT_SECRET=your-secure-secret-key npm run server
```

### Troubleshooting
If you can't access the application:
1. Verify the server is running (check terminal output)
2. Ensure your device is on the same network (192.168.1.x)
3. Check firewall settings on the Raspberry Pi
4. Try accessing locally first: http://localhost:5000

### Files Modified
- `server/server.cjs` - Added static file serving and network binding
- `package.json` - Updated scripts for deployment

---
**Deployment Date**: October 12, 2025
**Deployed By**: GitHub Copilot CLI
