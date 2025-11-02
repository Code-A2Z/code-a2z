// Load environment variables from .env file
export const VITE_SERVER_DOMAIN =
  import.meta.env.VITE_SERVER_DOMAIN || 'https://code-a2z.onrender.com';

// Token configuration
export const TOKEN_CONFIG = {
  ACCESS_TOKEN_DURATION: import.meta.env.VITE_ACCESS_TOKEN_DURATION || 15, // minutes
  REFRESH_TOKEN_DURATION: import.meta.env.VITE_REFRESH_TOKEN_DURATION || 7, // days
  ACCESS_TOKEN_NAME: import.meta.env.VITE_ACCESS_TOKEN_NAME || 'access_token',
  REFRESH_TOKEN_NAME:
    import.meta.env.VITE_REFRESH_TOKEN_NAME || 'refresh_token',
} as const;
