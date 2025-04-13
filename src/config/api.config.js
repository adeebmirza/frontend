export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  ENDPOINTS: {
    NOTES: '/notes',
    AUTH: '/auth',
    CHAT: '/livechat',
    TODO: '/todo',
    NEWS: '/news'
  }
};
