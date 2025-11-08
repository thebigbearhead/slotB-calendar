import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';

const defaultConfig = {
  branding: {
    appTitle: 'sLOt[B]',
    tagline: 'Book your slot with ease',
    logoUrl: 'public/images/logo.png',
    heroImageUrl: ''
  },
  theme: {
    primaryColor: '#6366f1',
    secondaryColor: '#0f172a',
    accentColor: '#f97316',
    surfaceColor: '#f8fafc'
  },
  ui: {
    showActivitySidebar: true,
    enableBackgroundPattern: true
  }
};

const ConfigContext = createContext({
  config: defaultConfig,
  loading: false,
  error: '',
  refreshConfig: () => {},
  updateConfig: async () => ({ success: false })
});

export const useConfig = () => {
  const ctx = useContext(ConfigContext);
  if (!ctx) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return ctx;
};

const applyConfigToDocument = (config) => {
  const root = document.documentElement;
  root.style.setProperty('--accent-primary', config?.theme?.primaryColor || '#6366f1');
  root.style.setProperty('--accent-secondary', config?.theme?.secondaryColor || '#0f172a');
  root.style.setProperty('--accent-gradient', `linear-gradient(135deg, ${config?.theme?.primaryColor || '#6366f1'} 0%, ${config?.theme?.accentColor || '#f97316'} 100%)`);
  root.style.setProperty('--accent-light', `${config?.theme?.primaryColor || '#6366f1'}20`);
  root.style.setProperty('--bg-secondary', config?.theme?.surfaceColor || '#f8fafc');
};

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/config');
      if (!response.ok) {
        throw new Error('Failed to load configuration');
      }
      const data = await response.json();
      setConfig(data);
      applyConfigToDocument(data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Unable to load configuration');
      applyConfigToDocument(defaultConfig);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  useEffect(() => {
    applyConfigToDocument(config);
  }, [config]);

  const persistConfig = async (updates, token) => {
    if (!token) {
      return { success: false, error: 'Authentication required' };
    }

    try {
      const response = await fetch('/api/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update config');
      }

      setConfig(data.config);
      applyConfigToDocument(data.config);
      return { success: true, config: data.config };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.message };
    }
  };

  return (
    <ConfigContext.Provider
      value={{
        config,
        loading,
        error,
        refreshConfig: fetchConfig,
        updateConfig: persistConfig
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};
