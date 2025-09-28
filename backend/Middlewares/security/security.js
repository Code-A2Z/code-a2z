import helmet from 'helmet';
import hpp from 'hpp';


export const securityMiddleware = (app) => {

    app.use(helmet({
        hidePoweredBy: true,
        frameguard: { action: "deny" },
        xssFilter: true,
        noSniff: true,
        hsts: { maxAge: 31536000, includeSubDomains: true },
    }))

    app.use(hpp());

}