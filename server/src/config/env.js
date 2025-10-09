// Load environment variables from .env file
import dotenv from 'dotenv';

dotenv.config();

// Server Configuration
export const PORT = process.env.PORT || 8000;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const VITE_SERVER_DOMAIN =
    process.env.VITE_SERVER_DOMAIN || 'https://code-a2z-server.vercel.app';

// MongoDB Configuration
export const MONGODB_URL =
    process.env.MONGODB_URL || 'mongodb://localhost:27017/code-a2z';

// JWT Configuration
export const JWT_SECRET_ACCESS_KEY =
    process.env.JWT_SECRET_ACCESS_KEY || 'default_secret_key';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7D';

// Cloudinary Configuration (for media uploads)
export const CLOUDINARY_CLOUD_NAME =
    process.env.CLOUDINARY_CLOUD_NAME || 'admin';
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || 'admin';
export const CLOUDINARY_API_SECRET =
    process.env.CLOUDINARY_API_SECRET || 'admin';

// Admin Credentials (for nodemailer & localtunnel)
// export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
// export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Resend Configuration
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
export const RESEND_API_KEY = process.env.RESEND_API_KEY;