import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

const setNestedValue = (obj = {}, path = '', value) => {
  const segments = path.split('.');
  const updated = { ...obj };
  let cursor = updated;

  segments.slice(0, -1).forEach((key) => {
    cursor[key] = cursor[key] ? { ...cursor[key] } : {};
    cursor = cursor[key];
  });

  cursor[segments.at(-1)] = value;
  return updated;
};

const AdminDashboard = () => {
  const { config, updateConfig } = useConfig();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [formState, setFormState] = useState(config);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userStatus, setUserStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    setFormState(config);
  }, [config]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token || user?.role !== 'admin') {
        return;
      }
      try {
        setLoadingUsers(true);
        const response = await fetch('/api/admin/users', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to load users');
        }
        setUsers(data.users);
        setSelectedUser(data.users[0] || null);
      } catch (error) {
        setUserStatus({ type: 'error', message: error.message });
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [token, user]);

  if (user?.role !== 'admin') {
    return (
      <div className="admin-dashboard unauthorized">
        <h2>Admin dashboard</h2>
        <p>You need admin privileges to view this area.</p>
      </div>
    );
  }

  const handleConfigChange = (path, value) => {
    setFormState((prev) => setNestedValue(prev, path, value));
  };

  const handleToggleUI = (path) => {
    const segments = path.split('.');
    const current = segments.reduce((acc, key) => acc?.[key], formState);
    handleConfigChange(path, !(current ?? false));
  };

  const handleConfigSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });
    const result = await updateConfig(formState, token);
    if (!result.success) {
      setStatus({ type: 'error', message: result.error || 'Failed to save configuration' });
    } else {
      setStatus({ type: 'success', message: 'Configuration updated successfully' });
    }
  };

  const handleUserFieldChange = (field, value) => {
    setSelectedUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleUserSubmit = async (event) => {
    event.preventDefault();
    if (!selectedUser) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName: selectedUser.firstName,
          lastName: selectedUser.lastName,
          idNumber: selectedUser.idNumber,
          role: selectedUser.role
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update user');
      }
      setUsers((prev) => prev.map((u) => (u.id === data.user.id ? data.user : u)));
      setSelectedUser(data.user);
      setUserStatus({ type: 'success', message: 'User updated' });
    } catch (error) {
      setUserStatus({ type: 'error', message: error.message });
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <button onClick={() => navigate('/')} className="back-button" title="Back to Calendar">
          ✕
        </button>
        <h1>Admin Dashboard</h1>
      </div>
      <section className="admin-card">
        <div className="card-header">
          <div>
            <h2>Branding & Theme</h2>
            <p>Adjust the look and feel across the application.</p>
          </div>
        </div>
        <form onSubmit={handleConfigSubmit} className="admin-form">
          <div className="section">
            <h4>Branding</h4>
            <div className="form-grid">
              <label>
                App title
                <input
                  type="text"
                  value={formState.branding?.appTitle || ''}
                  onChange={(e) => handleConfigChange('branding.appTitle', e.target.value)}
                />
              </label>
              <label>
                Tagline
                <input
                  type="text"
                  value={formState.branding?.tagline || ''}
                  onChange={(e) => handleConfigChange('branding.tagline', e.target.value)}
                />
              </label>
            </div>
            <div className="form-grid">
              <label>
                Logo URL
                <input
                  type="url"
                  value={formState.branding?.logoUrl || ''}
                  onChange={(e) => handleConfigChange('branding.logoUrl', e.target.value)}
                />
              </label>
              <label>
                Hero image URL
                <input
                  type="url"
                  value={formState.branding?.heroImageUrl || ''}
                  onChange={(e) => handleConfigChange('branding.heroImageUrl', e.target.value)}
                />
              </label>
            </div>
          </div>

          <div className="section">
            <h4>Theme Colors</h4>
            <div className="color-grid">
              <label>
                Primary
                <input
                  type="color"
                  value={formState.theme?.primaryColor || '#6366f1'}
                  onChange={(e) => handleConfigChange('theme.primaryColor', e.target.value)}
                />
              </label>
              <label>
                Secondary
                <input
                  type="color"
                  value={formState.theme?.secondaryColor || '#0f172a'}
                  onChange={(e) => handleConfigChange('theme.secondaryColor', e.target.value)}
                />
              </label>
              <label>
                Accent
                <input
                  type="color"
                  value={formState.theme?.accentColor || '#f97316'}
                  onChange={(e) => handleConfigChange('theme.accentColor', e.target.value)}
                />
              </label>
              <label>
                Surface
                <input
                  type="color"
                  value={formState.theme?.surfaceColor || '#f8fafc'}
                  onChange={(e) => handleConfigChange('theme.surfaceColor', e.target.value)}
                />
              </label>
            </div>
          </div>

          <div className="section">
            <h4>Surface Colors</h4>
            <p className="section-description">Customize background colors for different areas of the application</p>
            <div className="color-grid">
              <label>
                Calendar Container
                <input
                  type="color"
                  value={formState.theme?.surfaceCalendar || '#221d28'}
                  onChange={(e) => handleConfigChange('theme.surfaceCalendar', e.target.value)}
                />
                <small>Main calendar area background</small>
              </label>
              <label>
                Activity Sidebar
                <input
                  type="color"
                  value={formState.theme?.surfaceSidebar || '#2d2738'}
                  onChange={(e) => handleConfigChange('theme.surfaceSidebar', e.target.value)}
                />
                <small>Right sidebar background</small>
              </label>
              <label>
                Weekdays Header
                <input
                  type="color"
                  value={formState.theme?.surfaceWeekdays || '#2a2533'}
                  onChange={(e) => handleConfigChange('theme.surfaceWeekdays', e.target.value)}
                />
                <small>Weekday labels row (Sun, Mon, etc.)</small>
              </label>
              <label>
                Calendar Grid
                <input
                  type="color"
                  value={formState.theme?.surfaceCalendarGrid || '#1a1621'}
                  onChange={(e) => handleConfigChange('theme.surfaceCalendarGrid', e.target.value)}
                />
                <small>Calendar day cells background</small>
              </label>
              <label>
                Activity List
                <input
                  type="color"
                  value={formState.theme?.surfaceActivityList || '#272132'}
                  onChange={(e) => handleConfigChange('theme.surfaceActivityList', e.target.value)}
                />
                <small>Recent bookings list background</small>
              </label>
            </div>
          </div>

          <div className="section">
            <h4>Layout</h4>
            <div className="toggle-row">
              <label>
                <input
                  type="checkbox"
                  checked={formState.ui?.showActivitySidebar !== false}
                  onChange={() => handleToggleUI('ui.showActivitySidebar')}
                />
                Show activity sidebar
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={formState.ui?.enableBackgroundPattern !== false}
                  onChange={() => handleToggleUI('ui.enableBackgroundPattern')}
                />
                Auth background texture
              </label>
            </div>
          </div>

          {status.message && (
            <div className={`status-banner ${status.type}`}>
              {status.message}
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="pill-button primary">
              Save configuration
            </button>
          </div>
        </form>
      </section>

      <section className="admin-card">
        <div className="card-header">
          <div>
            <h2>User Directory</h2>
            <p>Review and adjust user details stored in the database.</p>
          </div>
        </div>

        {loadingUsers ? (
          <div className="user-table loading">
            <div className="loading-spinner"></div>
            <p>Loading users...</p>
          </div>
        ) : (
          <div className="user-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((item) => (
                  <tr
                    key={item.id}
                    className={selectedUser?.id === item.id ? 'active' : ''}
                    onClick={() => setSelectedUser(item)}
                  >
                    <td>{item.id}</td>
                    <td>{[item.firstName, item.lastName].filter(Boolean).join(' ') || '—'}</td>
                    <td>{item.username}</td>
                    <td>{item.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedUser && (
          <form onSubmit={handleUserSubmit} className="admin-form compact">
            <div className="form-grid">
              <label>
                First Name
                <input
                  type="text"
                  value={selectedUser.firstName || ''}
                  onChange={(e) => handleUserFieldChange('firstName', e.target.value)}
                />
              </label>
              <label>
                Last Name
                <input
                  type="text"
                  value={selectedUser.lastName || ''}
                  onChange={(e) => handleUserFieldChange('lastName', e.target.value)}
                />
              </label>
            </div>
            <div className="form-grid">
              <label>
                ID Number
                <input
                  type="text"
                  value={selectedUser.idNumber || ''}
                  inputMode="numeric"
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                    handleUserFieldChange('idNumber', value);
                  }}
                />
              </label>
              <label>
                Role
                <select
                  value={selectedUser.role}
                  onChange={(e) => handleUserFieldChange('role', e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
            </div>
            {userStatus.message && (
              <div className={`status-banner ${userStatus.type}`}>
                {userStatus.message}
              </div>
            )}
            <div className="form-actions">
              <button type="submit" className="pill-button primary">
                Update user
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
