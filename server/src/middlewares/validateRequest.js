import { validationResult } from 'express-validator'
import { sendResponse } from '../utils/response'

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return sendResponse(res, 400, false, 'Validation Error', {
      errors: errors.array().map(err => ({ field: err.param, msg: err.msg })),
    })
  }

  next()
}
