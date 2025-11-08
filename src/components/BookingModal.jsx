import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { getBangkokDateString, formatInBangkok, APP_TIMEZONE } from '../utils/timezone';
import './BookingModal.css';

const BookingModal = ({ date, booking, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    startTime: '',
    endTime: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    if (booking) {
      setFormData({
        title: booking.title,
        startTime: booking.start_time,
        endTime: booking.end_time,
        description: booking.description || '',
      });
    } else {
      setFormData({
        title: '',
        startTime: '',
        endTime: '',
        description: '',
      });
    }
  }, [booking]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.startTime >= formData.endTime) {
      setError('End time must be after start time');
      setLoading(false);
      return;
    }

    try {
      const url = booking 
        ? `/api/bookings/${booking.id}`
        : '/api/bookings';
      
      const method = booking ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          date: getBangkokDateString(date),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save booking');
      }

      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('bookingUpdated'));
      
      onSuccess();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!booking || !window.confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete booking');
      }

      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('bookingUpdated'));

      onSuccess();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{booking ? 'Edit Booking' : 'New Booking'}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-date">
          {formatInBangkok(date, 'EEEE, MMMM d, yyyy')}
          <span style={{ marginLeft: '10px', fontSize: '0.85em', opacity: '0.7' }}>
            ({APP_TIMEZONE})
          </span>
        </div>

        <div className="modal-body">
        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Portrait Session, Wedding Shoot"
              required
              disabled={loading}
            />
          </div>

          <div className="time-inputs">
            <div className="form-group">
              <label htmlFor="startTime">Start Time</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="endTime">End Time</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Additional notes about the photoshoot..."
              rows="3"
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            {booking && (
              <button
                type="button"
                onClick={handleDelete}
                className="btn btn-danger"
                disabled={loading}
              >
                Delete
              </button>
            )}
            <div className="action-buttons">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : (booking ? 'Update' : 'Create')}
              </button>
            </div>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
