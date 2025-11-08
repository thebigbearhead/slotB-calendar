import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getBangkokNow, formatInBangkok, parseToBangkok } from '../utils/timezone';
import './ActivitySidebar.css';

const STATUS_LABELS = {
  past: 'Completed',
  today: 'Today',
  upcoming: 'Upcoming'
};

const ICON_CLASS = {
  past: 'fa-circle-check',
  today: 'fa-calendar-day',
  upcoming: 'fa-arrow-trend-up'
};

const ActivitySidebar = ({ onProfileClick }) => {
  const { user, token, logout } = useAuth();
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRecentActivity = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch('/api/bookings/recent', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRecentActivity(data);
      } else {
        setError('Failed to fetch recent activity');
      }
    } catch {
      setError('Error loading activity');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRecentActivity();
  }, [fetchRecentActivity]);

  // Add a function to refresh activity that can be called from parent
  useEffect(() => {
    const handleBookingUpdate = () => {
      fetchRecentActivity();
    };

    // Listen for custom booking update events
    window.addEventListener('bookingUpdated', handleBookingUpdate);
    
    return () => {
      window.removeEventListener('bookingUpdated', handleBookingUpdate);
    };
  }, [fetchRecentActivity]);

  const formatDate = (dateString) => {
    const date = parseToBangkok(dateString);
    return formatInBangkok(date, 'MMM d, yyyy');
  };

  const formatTime = (timeString) => {
    // Time is already in Bangkok timezone, just format it
    const [hours, minutes] = timeString.split(':');
    const date = new Date(2000, 0, 1, parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getBookingState = (booking) => {
    const now = getBangkokNow();
    const bookingDate = parseToBangkok(booking.date);
    
    // Reset time to compare dates only
    now.setHours(0, 0, 0, 0);
    bookingDate.setHours(0, 0, 0, 0);
    
    if (bookingDate < now) {
      return 'past';
    } else if (bookingDate.getTime() === now.getTime()) {
      return 'today';
    } else {
      return 'upcoming';
    }
  };

  const renderUserCard = () => (
    <div className="sidebar-user-card" onClick={onProfileClick}>
      <div className="card-avatar">
        {user?.profilePicture ? (
          <img src={user.profilePicture} alt={user?.username} />
        ) : (
          (user?.firstName || user?.username || 'U').charAt(0).toUpperCase()
        )}
      </div>
      <div>
        <p className="card-name">{[user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.username}</p>
        <p className="card-meta">{user?.email}</p>
        {user?.idNumber && <p className="card-meta">ID: {user.idNumber}</p>}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="activity-sidebar">
        <div className="sidebar-header">
          <h3>Recent Activity</h3>
        </div>
        {renderUserCard()}
        <div className="activity-loading">
          <div className="loading-spinner"></div>
          <p>Loading activity...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="activity-sidebar">
      <div className="sidebar-header">
        <h3>Recent Activity</h3>
        {user?.role === 'admin' && (
          <Link to="/admin" className="pill-button secondary">Admin</Link>
        )}
      </div>

      {renderUserCard()}

      <div className="activity-content">
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchRecentActivity} className="retry-btn">
              Retry
            </button>
          </div>
        )}

        {!error && recentActivity.length === 0 && (
          <div className="no-activity">
            <p>No recent activity</p>
            <small>Your bookings will appear here</small>
          </div>
        )}

        {!error && recentActivity.length > 0 && (
          <div className="activity-list">
            <h4>Recent Bookings</h4>
            {recentActivity.map((booking) => {
              const bookingState = getBookingState(booking);
              const statusLabel = STATUS_LABELS[bookingState];
              const iconClass = ICON_CLASS[bookingState];

              return (
                <div key={booking.id} className="activity-item">
                  <div className={`activity-icon ${bookingState}`} aria-hidden="true">
                    <i className={`fa-solid ${iconClass}`}></i>
                  </div>
                  <div className="activity-details">
                    <div className="activity-title">
                      {booking.title}
                    </div>
                    <div className="activity-meta">
                      <span className="activity-date">
                        {formatDate(booking.date)}
                      </span>
                      <span className="activity-time">
                        {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                      </span>
                    </div>
                    <div className={`activity-status ${statusLabel.toLowerCase()}`}>
                      {statusLabel}
                    </div>
                    {booking.description && (
                      <div className="activity-description">
                        {booking.description}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="activity-stats">
          <h4>Quick Stats</h4>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">
                {recentActivity.filter(b => {
                  const now = getBangkokNow();
                  const bookingDate = parseToBangkok(b.date);
                  now.setHours(0, 0, 0, 0);
                  bookingDate.setHours(0, 0, 0, 0);
                  return bookingDate >= now;
                }).length}
              </div>
              <div className="stat-label">Upcoming</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">
                {recentActivity.filter(b => {
                  const now = getBangkokNow();
                  const bookingDate = parseToBangkok(b.date);
                  now.setHours(0, 0, 0, 0);
                  bookingDate.setHours(0, 0, 0, 0);
                  return bookingDate < now;
                }).length}
              </div>
              <div className="stat-label">Completed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">
                {recentActivity.length}
              </div>
              <div className="stat-label">Total</div>
            </div>
          </div>
        </div>
        
        <div className="sidebar-footer">
          <button onClick={logout} className="sidebar-logout-button">
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
          <div className="footer-info">
            <span className="version-text">v0.1.7</span>
          </div>
          <div className="footer-info">
            <a 
              href="https://github.com/thebigbearhead" 
              target="_blank" 
              rel="noopener noreferrer"
              className="github-link"
            >
              <i className="fab fa-github"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitySidebar;
