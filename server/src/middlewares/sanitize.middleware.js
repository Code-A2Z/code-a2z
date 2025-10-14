import sanitizeHtml from 'sanitize-html';
import { sendResponse } from '../utils/response.js';

export const sanitizeNested = obj => {
  for (const k in obj) {
    if (typeof obj[k] === 'string') {
      obj[k] = sanitizeHtml(obj[k], {
        allowedTags: [],
        allowedAttributes: {},
      });
    } else if (typeof obj[k] === 'object' && obj[k] !== null) {
      sanitizeNested(obj[k]);
    }
  }
};

const sanitizeInput = () => {
  return (req, res, next) => {
    const obj = req.body;
    try {
      if (obj && typeof obj === 'object') {
        sanitizeNested(obj);
      }
      next();
    } catch (e) {
      console.error('Sanitization Error:', e);
      sendResponse(res, 500, 'error', 'Failed to sanitize input fields');
    }
  };
};

export default sanitizeInput;
