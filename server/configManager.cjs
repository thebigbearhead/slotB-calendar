const fs = require('fs');
const path = require('path');

const configDir = path.join(__dirname, '../config');
const configPath = path.join(configDir, 'app-config.json');

const defaultConfig = {
  branding: {
    appTitle: 'Photoshoot Calendar',
    tagline: 'Plan and track your shoots with Bangkok precision',
    logoUrl: '',
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

const ensureConfigFile = () => {
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
  }
};

const deepMerge = (target = {}, source = {}) => {
  const merged = { ...target };
  Object.keys(source).forEach((key) => {
    if (
      typeof source[key] === 'object' &&
      source[key] !== null &&
      !Array.isArray(source[key])
    ) {
      merged[key] = deepMerge(target[key], source[key]);
    } else {
      merged[key] = source[key];
    }
  });

  return merged;
};

const getConfig = () => {
  ensureConfigFile();
  const raw = fs.readFileSync(configPath, 'utf-8');
  return deepMerge(defaultConfig, JSON.parse(raw));
};

const saveConfig = (config) => {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  return config;
};

const updateConfig = (updates) => {
  const current = getConfig();
  const merged = deepMerge(current, updates);
  return saveConfig(merged);
};

module.exports = {
  getConfig,
  updateConfig,
  defaultConfig
};
