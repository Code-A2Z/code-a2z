import { sendResponse } from '../utils/response.js'
import logger from '../logger/winston.js'

const errorHandler = (err, req, res, next) => {
  if (req?.logger) {
    req.logger.error(err.stack || err.message)
  } else {
    logger.error(err.stack || err.message)
  }

  if (res.headersSent) {
    return next(err)
  }

  return sendResponse(
    res,
    500,
    'error',
    err.message || 'Internal Server Error',
    null
  )
}

export default errorHandler
