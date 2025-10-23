import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';

// Configs
import connectDB from './config/db.js';

// Middlewares
import errorHandler from './middlewares/error.handler.js';
import securityMiddleware from './middlewares/security.middleware.js';
import sanitizeInput from './middlewares/sanitize.middleware.js';

// Routes
import monitorRoutes from './routes/api/monitor.routes.js';
import router from './routes/index.js';

// Logger
import { loggingMiddleware } from './middlewares/logging.middleware.js';

dotenv.config();

const server = express();

// ✅ CORS Middleware - COMPREHENSIVE CONFIGURATION
server.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',  // Vite dev server
      'http://localhost:3000',  // React dev server  
      'http://localhost:4173',  // Vite preview
      'https://code-a2z-client.vercel.app', // Production frontend
      'https://code-a2z-client-git-main-avdhesh-varshneys-projects.vercel.app', // Vercel preview
      'https://code-a2z-client-*.vercel.app' // All Vercel preview deployments
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

// ✅ Explicit preflight handling
server.options('*', cors());

// Middleware
server.use(express.json({ limit: '10mb' }));
server.use(express.urlencoded({ extended: true, limit: '10mb' }));
server.use(cookieParser());

// securityMiddleware
securityMiddleware(server);

// sanitizationMiddleware (global)
server.use(sanitizeInput());

// Logging middleware
loggingMiddleware(server);

// Connect to Database
connectDB();

// Routes
server.get('/', (req, res) =>
    res.status(200).json({ status: 'success', message: 'Backend is running...' })
);

// Health check route
server.get('/health', (req, res) =>
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() })
);

// Monitoring Route
server.use('/monitor', monitorRoutes);

// API Routes
server.use('/api', router);

// Error handler (last middleware)
server.use(errorHandler);

export default server;