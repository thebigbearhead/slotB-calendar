import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BookingModal from './BookingModal';
import ActivitySidebar from './ActivitySidebar';
import ProfilePage from './ProfilePage';
import { useConfig } from '../context/ConfigContext';
import {
  APP_TIMEZONE,
  getBangkokNow,
  formatInBangkok,
  getBangkokDateString,
  getBangkokYearMonth,
  makeBangkokDate,
  shiftBangkokMonth,
  parseToBangkok,
} from '../utils/timezone';
import './Calendar.css';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(getBangkokNow());
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { token, user, logout } = useAuth();
  const { config } = useConfig();

  const fetchBookings = useCallback(async () => {
    if (!token) {
      return;
    }
    
    try {
      const response = await fetch('/api/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings);
      } else if (response.status === 401) {
        logout();
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  }, [token, logout]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setSelectedBooking(null);
    setShowModal(true);
  };

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
    setSelectedDate(parseToBangkok(booking.date));
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedDate(null);
    setSelectedBooking(null);
  };

  const handleBookingSuccess = () => {
    fetchBookings();
    handleModalClose();
  };

  const getBookingsForDate = (date) => {
    const dateString = getBangkokDateString(date);
    return bookings.filter(booking => booking.date === dateString);
  };

  const { year: currentYear, monthIndex: currentMonthIndex } = getBangkokYearMonth(currentDate);
  const firstOfMonth = makeBangkokDate(currentYear, currentMonthIndex, 1);
  const daysInMonth = new Date(Date.UTC(currentYear, currentMonthIndex + 1, 0)).getUTCDate();
  const isoDayOfWeek = Number.parseInt(formatInBangkok(firstOfMonth, 'i'), 10);
  const startOffset = isoDayOfWeek % 7; // 0 = Sunday, 1 = Monday, ... 6 = Saturday

  const previousMonthDate = shiftBangkokMonth(firstOfMonth, -1);
  const { year: prevYear, monthIndex: prevMonthIndex } = getBangkokYearMonth(previousMonthDate);
  const prevMonthDays = new Date(Date.UTC(prevYear, prevMonthIndex + 1, 0)).getUTCDate();
  const leadingDays = Array.from({ length: startOffset }, (_, index) =>
    makeBangkokDate(prevYear, prevMonthIndex, prevMonthDays - startOffset + index + 1)
  );

  const currentMonthDays = Array.from({ length: daysInMonth }, (_, index) =>
    makeBangkokDate(currentYear, currentMonthIndex, index + 1)
  );

  const nextMonthDate = shiftBangkokMonth(firstOfMonth, 1);
  const { year: nextYear, monthIndex: nextMonthIndex } = getBangkokYearMonth(nextMonthDate);
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;
  const trailingCount = totalCells - startOffset - daysInMonth;
  const trailingDays = Array.from({ length: trailingCount }, (_, index) =>
    makeBangkokDate(nextYear, nextMonthIndex, index + 1)
  );

  const days = [...leadingDays, ...currentMonthDays, ...trailingDays];

  const currentMonthKey = formatInBangkok(firstOfMonth, 'yyyy-MM');
  const todayBangkokString = getBangkokDateString(getBangkokNow());

  const previousMonth = () => {
    setCurrentDate((prev) => shiftBangkokMonth(prev, -1));
  };

  const nextMonth = () => {
    setCurrentDate((prev) => shiftBangkokMonth(prev, 1));
  };

  return (
    <div className="calendar-app">
      <div className="calendar-container">
        <div className="calendar-header">
          <div className="header-left">
            <div className="calendar-logo">
              {config.branding?.logoUrl ? (
                <img src={config.branding.logoUrl} alt="logo" />
              ) : (
                <span>{(config.branding?.appTitle || 'PC').slice(0, 2).toUpperCase()}</span>
              )}
            </div>
            <div>
              <div className="branding-meta">
                <div>
                  <p className="app-title">{config.branding?.appTitle}</p>
                  <p className="app-tagline">{config.branding?.tagline}</p>
                </div>
              </div>
              <div className="calendar-nav">
                <button onClick={previousMonth} className="nav-button" aria-label="Previous month">‹</button>
                <h2 className="month-year">{formatInBangkok(currentDate, 'MMMM yyyy')}</h2>
                <button onClick={nextMonth} className="nav-button" aria-label="Next month">›</button>
              </div>
            </div>
          </div>
          <div className="user-info">
            <div className="user-identity">
              <div className="user-avatar">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt={user?.username} />
                ) : (
                  (user?.firstName || user?.username || 'U').charAt(0).toUpperCase()
                )}
              </div>
              <div className="user-text">
                <p className="user-name">{[user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.username}</p>
                <span className="user-meta">{user?.username}</span>
              </div>
            </div>
            <div className="user-actions">
              <button onClick={() => setShowProfileModal(true)} className="pill-button">Profile</button>
              <button onClick={logout} className="logout-button">Logout</button>
            </div>
          </div>
        </div>

        <div className="calendar-grid">
          <div className="weekdays">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="weekday">{day}</div>
            ))}
          </div>

          <div className="days-grid">
            {days.map(day => {
              const dayBookings = getBookingsForDate(day);
              const dayMonthKey = formatInBangkok(day, 'yyyy-MM');
              const isCurrentMonth = dayMonthKey === currentMonthKey;
              const dayBangkokString = getBangkokDateString(day);
              const isToday = dayBangkokString === todayBangkokString;

              return (
                <div
                  key={day.toISOString()}
                  className={`day-cell ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`}
                  onClick={() => handleDateClick(day)}
                >
                  <div className="day-number">{formatInBangkok(day, 'd')}</div>
                  <div className="bookings-list">
                    {dayBookings.map(booking => (
                      <div
                        key={booking.id}
                        className="booking-item"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookingClick(booking);
                        }}
                      >
                        <div className="booking-time">{booking.start_time}</div>
                        <div className="booking-title">{booking.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {showModal && (
          <BookingModal
            date={selectedDate}
            booking={selectedBooking}
            onClose={handleModalClose}
            onSuccess={handleBookingSuccess}
          />
        )}

        {showProfileModal && (
          <div className="profile-modal-overlay" onClick={() => setShowProfileModal(false)}>
            <div className="profile-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="profile-modal-close" onClick={() => setShowProfileModal(false)}>✕</button>
              <ProfilePage />
            </div>
          </div>
        )}
      </div>
      
      {config.ui?.showActivitySidebar !== false && <ActivitySidebar />}
    </div>
  );
};

export default Calendar;
