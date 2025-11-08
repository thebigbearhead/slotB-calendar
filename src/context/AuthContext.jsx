/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const AuthContext = createContext();

const normalizeUser = (user) => {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role || 'user',
    firstName: user.firstName ?? user.first_name ?? '',
    lastName: user.lastName ?? user.last_name ?? '',
    idNumber: user.idNumber ?? user.id_number ?? '',
    profilePicture: user.profilePicture ?? user.profile_picture ?? '',
    createdAt: user.createdAt ?? user.created_at ?? ''
  };
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(normalizeUser(JSON.parse(storedUser)));
    }
    setLoading(false);
  }, []);

  const persistUser = useCallback((nextUser, nextToken) => {
    const normalizedUser = normalizeUser(nextUser);
    setUser(normalizedUser);
    if (nextToken) {
      setToken(nextToken);
      localStorage.setItem('token', nextToken);
    }
    localStorage.setItem('user', JSON.stringify(normalizedUser));
  }, [setUser, setToken]);

  const login = useCallback(async (identifier, password) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier,
          username: identifier,
          email: identifier,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      persistUser(data.user, data.token);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [persistUser]);

  const register = useCallback(async ({ username, email, password, firstName, lastName, idNumber }) => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, firstName, lastName, idNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      persistUser(data.user, data.token);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [persistUser]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, [setToken, setUser]);

  const value = useMemo(() => ({
    user,
    token,
    login,
    register,
    logout,
    setUserData: persistUser,
    loading,
    isAuthenticated: !!token,
  }), [user, token, login, register, logout, persistUser, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
