// Load environment variables from .env file
import dotenv from 'dotenv';

// dotenv.config();

import path from 'path';
dotenv.config({ path: path.resolve('./.env') });

// Server Configuration
export const PORT = process.env.PORT || 8000;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const VITE_SERVER_DOMAIN =
  process.env.VITE_SERVER_DOMAIN || 'https://code-a2z-server.vercel.app';

// MongoDB Configuration
export const MONGODB_URL = process.env.MONGODB_URL;
if (!MONGODB_URL) {
  throw new Error('MONGODB_URL is not defined in .env');
}
// JWT Configuration
export const JWT_SECRET_ACCESS_KEY =
  process.env.JWT_SECRET_ACCESS_KEY || 'default_secret_key';
export const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
export const JWT_ACCESS_EXPIRES_IN_NUM =
  process.env.JWT_ACCESS_EXPIRES_IN_NUM || 15 * 60 * 1000; // 15 minutes in ms

export const JWT_SECRET_REFRESH_KEY =
  process.env.JWT_SECRET_REFRESH_KEY || 'default_refresh_secret_key';
export const JWT_REFRESH_EXPIRES_IN =
  process.env.JWT_REFRESH_EXPIRES_IN || '7d';
export const JWT_REFRESH_EXPIRES_IN_NUM =
  process.env.JWT_REFRESH_EXPIRES_IN_NUM || 7 * 24 * 60 * 60 * 1000; // 7 days in ms

// Cloudinary Configuration (for media uploads)
export const CLOUDINARY_CLOUD_NAME =
  process.env.CLOUDINARY_CLOUD_NAME || 'admin';
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || 'admin';
export const CLOUDINARY_API_SECRET =
  process.env.CLOUDINARY_API_SECRET || 'admin';

//  Resend / Email Configuration
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'dev.admin@example.com';
export const RESEND_API_KEY =
  process.env.RESEND_API_KEY || 'dev_resend_key_abc123';
