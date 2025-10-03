import { body } from 'express-validator'
import { emailRegex, passwordRegex } from '../utils/regex.js'

export const signupValidator = [
  body('fullname')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Full name should be at least 3 letters long'),

  body('email')
    .trim()
    .matches(emailRegex)
    .withMessage('Invalid email'),

  body('password')
    .matches(passwordRegex)
    .withMessage(
      'Password should be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number'
    ),
]

export const loginValidator = [
  body('email')
    .trim()
    .matches(emailRegex)
    .withMessage('Invalid email'),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),
]

export const changePasswordValidator = [
  body('currentPassword')
    .matches(passwordRegex)
    .withMessage(
      'Password should be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number'
    ),

  body('newPassword')
    .matches(passwordRegex)
    .withMessage(
      'Password should be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number'
    ),
]
