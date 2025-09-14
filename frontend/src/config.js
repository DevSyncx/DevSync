// Config file for centralized environment variables
const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  frontendUrl: import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5174',
  appName: 'DevSync',
  appVersion: '1.0.0',
};

export default config;