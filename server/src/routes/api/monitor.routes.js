import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

router.get('/db-status', (req, res) => {
  const dbState = mongoose.connection.readyState;
  res.status(200).json({
    dbState,
    message: dbState === 1 ? 'DB Connected' : 'DB Disconnected',
  });
});

export default router;
