import morganMiddleware from '../logger/morgan'
import logger from '../logger/winston'

export const loggingMiddleware = (app) => {
  app.use(morganMiddleware)

  app.use((req, res, next) => {
    req.logger = logger
    next()
  })
}
