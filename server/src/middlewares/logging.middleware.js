import morganMiddleware from '../logger/morgan.js'
import logger from '../logger/winston.js'

export const loggingMiddleware = (app) => {
  app.use(morganMiddleware)

  app.use((req, res, next) => {
    req.logger = logger
    next()
  })
}
