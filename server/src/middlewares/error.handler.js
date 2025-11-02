import { sendResponse } from '../utils/response.js';

const errorHandler = (err, req, res, next) => {
  console.error(err.stack || err.message);
  if (res.headersSent) {
    return next(err);
  }

  return sendResponse(res, 500, err.message || 'Internal Server Error');
};

export default errorHandler;
