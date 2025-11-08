# Timezone Synchronization - Asia/Bangkok

## Overview
The calendar is now synchronized to **Asia/Bangkok (GMT+7)** timezone. All dates and times displayed throughout the application are shown in Bangkok time.

## Changes Made

### 1. Installed date-fns-tz Package
```bash
npm install date-fns-tz
```

### 2. Created Timezone Utility (`src/utils/timezone.js`)
A centralized utility module that handles all timezone conversions:

- `APP_TIMEZONE`: Set to 'Asia/Bangkok'
- `getBangkokNow()`: Get current date/time in Bangkok timezone
- `toBangkokTime(date)`: Convert any date to Bangkok timezone
- `formatInBangkok(date, format)`: Format dates in Bangkok timezone
- `getBangkokDateString(date)`: Get YYYY-MM-DD format in Bangkok timezone
- `parseToBangkok(dateString)`: Parse date strings to Bangkok timezone

### 3. Updated Components

#### Calendar.jsx
- Uses `getBangkokNow()` for current date initialization
- "Today" button navigates to Bangkok's current date
- Today highlighting uses Bangkok timezone
- Month/year header shows timezone indicator
- Date comparisons use Bangkok timezone

#### BookingModal.jsx
- Date display shows Bangkok timezone indicator
- Booking dates are saved using Bangkok timezone
- Modal header displays "(Asia/Bangkok)" label

#### ActivitySidebar.jsx
- Recent activity dates formatted in Bangkok timezone
- Status calculations (Today/Upcoming/Completed) use Bangkok time
- Stats count bookings based on Bangkok timezone

## Visual Indicators

### Calendar Header
```
October 2025 Asia/Bangkok
```

### Booking Modal
```
Monday, October 13, 2025 (Asia/Bangkok)
```

## How It Works

1. **Display**: All dates/times shown to users are in Bangkok timezone
2. **Storage**: Dates are stored as YYYY-MM-DD strings (date-only, no timezone issues)
3. **Comparison**: All date comparisons (today, past, future) use Bangkok timezone
4. **Consistency**: All components use the same timezone utility for consistency

## Testing the Timezone

To verify the timezone is working:

1. **Check "Today" button**: Should navigate to Bangkok's current date
2. **Create a booking**: Date should be saved in Bangkok timezone
3. **Activity sidebar**: "Today" status should reflect Bangkok time
4. **Calendar header**: Shows "Asia/Bangkok" indicator

## Current Bangkok Time

When the server runs, it uses the system's local time, but the frontend always displays everything in Bangkok timezone regardless of where the user is located.

## Notes

- All existing bookings will be interpreted as Bangkok timezone
- The timezone is hardcoded to Asia/Bangkok in the utility file
- To change timezone, update `APP_TIMEZONE` constant in `src/utils/timezone.js`
