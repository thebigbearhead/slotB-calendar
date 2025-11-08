import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ConfigProvider } from './context/ConfigContext';
import Login from './components/Login';
import Register from './components/Register';
import Calendar from './components/Calendar';
import ProfilePage from './components/ProfilePage';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

const AuthWrapper = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <AuthenticatedApp />;
  }

  return isLoginMode ? (
    <Login onToggleMode={() => setIsLoginMode(false)} />
  ) : (
    <Register onToggleMode={() => setIsLoginMode(true)} />
  );
};

const AuthenticatedApp = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Calendar />} />
      <Route path="/profile" element={<ProfilePage />} />
      {user?.role === 'admin' && (
        <Route path="/admin" element={<AdminDashboard />} />
      )}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ConfigProvider>
          <div className="App">
            <AuthWrapper />
          </div>
        </ConfigProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
