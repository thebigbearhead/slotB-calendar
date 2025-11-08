# Photoshoot Calendar - Startup Guide

## Fixed Issue: "Fail to Fetch" on Login/Register

The issue was caused by:
1. Backend server not running on port 5000
2. Frontend making requests to hardcoded `http://localhost:5000` instead of using Vite proxy

## How to Start the Application

### Option 1: Start Both Frontend and Backend Together
```bash
npm start
```
This runs both the backend server (port 5000) and frontend dev server (port 5173) concurrently.

### Option 2: Start Separately (for development)

**Terminal 1 - Backend Server:**
```bash
npm run server
```

**Terminal 2 - Frontend Dev Server:**
```bash
npm run dev
```

## Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api/health

## Changes Made to Fix "Fail to Fetch"

1. **Updated vite.config.js** - Added proxy configuration to forward `/api` requests to backend
2. **Updated AuthContext.jsx** - Changed from `http://localhost:5000/api/*` to `/api/*`
3. **Updated all components** - Replaced hardcoded localhost URLs with relative paths:
   - Calendar.jsx
   - BookingModal.jsx
   - ActivitySidebar.jsx

## Important Notes

- The backend server **must be running** before you can login or register
- Always use `npm start` or start the server with `npm run server` first
- The Vite dev server proxies API requests to the backend automatically
- In production, the built frontend is served directly by the Express server
- **Timezone**: The calendar is synchronized to **Asia/Bangkok (GMT+7)** timezone
  - All dates and times are displayed in Bangkok time
  - See [TIMEZONE.md](./TIMEZONE.md) for details

## Testing the Backend

Check if the server is running:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{"status":"OK","message":"Photoshoot Calendar API is running"}
```
