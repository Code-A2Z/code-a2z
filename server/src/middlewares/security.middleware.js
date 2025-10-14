import hpp from 'hpp';
import helmet from 'helmet';

const securityMiddleware = server => {
  server.use(
    helmet({
      hidePoweredBy: true,
      frameguard: { action: 'deny' },
      xssFilter: true,
      noSniff: true,
      hsts: { maxAge: 31536000, includeSubDomains: true },
    })
  );

  server.use(hpp());
};

export default securityMiddleware;
