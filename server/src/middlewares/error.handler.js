import { sendResponse } from '../utils/response.js';

const errorHandler = (err, _req, res, _next) => {
  console.error(err.stack);
  if (res.headersSent) {
    return _next(err);
  }
  return sendResponse(res, 500, err.message || 'Internal Server Error');
};

export default errorHandler;
