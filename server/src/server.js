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
import noteRoutes from './routes/noteRoutes.js'; // <--- NEW IMPORT

dotenv.config();

const server = express();

// Middleware
server.use(express.json());
server.use(cookieParser());
server.use(
  cors({
    origin: '*',
    credentials: true,
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  })
);

// securityMiddleware
securityMiddleware(server);

// sanitizationMiddleware (global)
server.use(sanitizeInput());

// Connect to Database
connectDB();

// Routes
server.get('', (req, res) =>
  res.status(200).json({ status: 'success', message: 'Backend is running...' })
);

// Monitoring Route
server.use('/monitor', monitorRoutes);

// API Routes
server.use('/api', router);

// ADDED: Mount the new Note Routes under the /api/v1/notes path
// We use the '/api' prefix here, but your noteRoutes file uses /:projectId etc.,
// so the final path will be /api/notes/:projectId
server.use('/api/notes', noteRoutes); // <--- NEW MOUNT

// Error handler (last middleware)
server.use(errorHandler);

export default server;
