import morgan from 'morgan'
import logger from './winston.js'
import dotenv from 'dotenv'

dotenv.config()

const stream = {
  write: (msg) => logger.info(msg.trim()),
}

const skip = () => process.env.NODE_ENV === 'test'

const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream, skip }
)

export default morganMiddleware
