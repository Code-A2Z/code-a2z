import morganMiddleware from '../logger/morgan.js';
import logger from '../logger/winston.js';

const loggingMiddleware = app => {
  app.use(morganMiddleware);

  app.use((req, res, next) => {
    req.logger = logger;
    next();
  });
};

export default loggingMiddleware;
