import express from 'express';
import mongoose from 'mongoose';
import { sendResponse } from '../../utils/response.js';

const monitorRoutes = express.Router();

monitorRoutes.get('/health', (req, res) => {
  sendResponse(res, 200, 'Service is healthy', {
    timestamp: new Date().toISOString(),
  });
});

monitorRoutes.get('/db-status', (req, res) => {
  const dbState = mongoose.connection.readyState;
  sendResponse(res, 200, dbState, {
    message: dbState === 1 ? 'DB Connected' : 'DB Disconnected',
  });
});

export default monitorRoutes;
