/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect } from 'react';
import { useConfig } from './ConfigContext';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const { config } = useConfig();

  useEffect(() => {
    // Always use dark theme
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  useEffect(() => {
    // Apply custom theme colors from config if available
    if (config?.theme) {
      const root = document.documentElement;
      
      // Apply component-specific surface colors
      if (config.theme.surfaceWeekdays) {
        root.style.setProperty('--surface-weekdays-custom', config.theme.surfaceWeekdays);
      }
      if (config.theme.surfaceCalendarGrid) {
        root.style.setProperty('--surface-calendar-grid-custom', config.theme.surfaceCalendarGrid);
      }
      if (config.theme.surfaceActivityList) {
        root.style.setProperty('--surface-activity-list-custom', config.theme.surfaceActivityList);
      }
      if (config.theme.surfaceCalendar) {
        root.style.setProperty('--surface-calendar-custom', config.theme.surfaceCalendar);
      }
      if (config.theme.surfaceSidebar) {
        root.style.setProperty('--surface-sidebar-custom', config.theme.surfaceSidebar);
      }
    }
  }, [config]);

  const value = {
    isDarkMode: true,
    toggleTheme: () => {}, // No-op since we only have dark theme
    theme: 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
