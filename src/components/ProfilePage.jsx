import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AvatarCropper from './AvatarCropper';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, token, setUserData, logout } = useAuth();
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    idNumber: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [passwordStatus, setPasswordStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(true);
  const [avatarSource, setAvatarSource] = useState('');
  const [avatarUploading, setAvatarUploading] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!token) {
      return;
    }
    try {
      setLoading(true);
      const response = await fetch('/api/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 401) {
        logout();
        return;
      }
      const data = await response.json();
      if (response.ok) {
        const nextUser = data.user;
        setUserData(nextUser);
        setProfileForm({
          firstName: nextUser.firstName || '',
          lastName: nextUser.lastName || '',
          idNumber: nextUser.idNumber || ''
        });
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to load profile' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  }, [token, setUserData, logout]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        idNumber: user.idNumber || ''
      });
    }
  }, [user]);

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });
    if (!profileForm.firstName || !profileForm.lastName) {
      setStatus({ type: 'error', message: 'First and last name are required' });
      return;
    }

    if (profileForm.idNumber && !/^\d{1,10}$/.test(profileForm.idNumber)) {
      setStatus({ type: 'error', message: 'ID number must be digits only (max 10)' });
      return;
    }

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profileForm)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }
      setUserData(data.user);
      setStatus({ type: 'success', message: 'Profile updated successfully' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setPasswordStatus({ type: '', message: '' });

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setPasswordStatus({ type: 'error', message: 'All password fields are required' });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'New passwords do not match' });
      return;
    }

    try {
      const response = await fetch('/api/profile/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update password');
      }
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordStatus({ type: 'success', message: 'Password updated successfully' });
    } catch (error) {
      setPasswordStatus({ type: 'error', message: error.message });
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarSource(reader.result.toString());
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarSave = async (image) => {
    try {
      setAvatarUploading(true);
      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ image })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save avatar');
      }
      setUserData(data.user);
      setAvatarSource('');
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setAvatarUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <section className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt={user?.username} />
            ) : (
              (user?.firstName || user?.username || 'U').charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <h2>{[user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.username}</h2>
            <p>{user?.email}</p>
            {user?.idNumber && <p className="muted">ID: {user.idNumber}</p>}
            <div className="avatar-actions">
              <label className="pill-button secondary">
                {avatarUploading ? 'Uploading...' : 'Upload new photo'}
                <input type="file" accept="image/*" onChange={handleFileChange} disabled={avatarUploading} />
              </label>
            </div>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit} className="profile-form">
          <div className="form-grid">
            <label>
              First Name
              <input
                type="text"
                value={profileForm.firstName}
                onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                required
              />
            </label>
            <label>
              Last Name
              <input
                type="text"
                value={profileForm.lastName}
                onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                required
              />
            </label>
          </div>
          <label>
            ID Number (max 10 digits)
            <input
              type="text"
              value={profileForm.idNumber}
              inputMode="numeric"
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                setProfileForm({ ...profileForm, idNumber: value });
              }}
            />
          </label>
          {status.message && (
            <div className={`status-banner ${status.type}`}>
              {status.message}
            </div>
          )}
          <button type="submit" className="pill-button primary">
            Save changes
          </button>
        </form>
      </section>

      <section className="profile-card">
        <h3>Update Password</h3>
        <form onSubmit={handlePasswordSubmit} className="profile-form">
          <label>
            Current Password
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              required
            />
          </label>
          <div className="form-grid">
            <label>
              New Password
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                required
                minLength={6}
              />
            </label>
            <label>
              Confirm Password
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                required
              />
            </label>
          </div>
          {passwordStatus.message && (
            <div className={`status-banner ${passwordStatus.type}`}>
              {passwordStatus.message}
            </div>
          )}
          <button type="submit" className="pill-button primary">
            Update password
          </button>
        </form>
      </section>

      {avatarSource && (
        <AvatarCropper
          image={avatarSource}
          onCancel={() => setAvatarSource('')}
          onComplete={handleAvatarSave}
        />
      )}
    </div>
  );
};

export default ProfilePage;
