import { body } from 'express-validator'
import { PROFILE_BIO_LIMIT } from '../../constants/index.js'

const socialLinksValidator = (social_links) => {
  if (!social_links || typeof social_links !== 'object') return true

  for (const key of Object.keys(social_links)) {
    const link = social_links[key]
    if (link && link.length) {
      try {
        const hostname = new URL(link).hostname
        if (!hostname.includes(`${key}.com`) && key !== 'website') {
          throw new Error(
            `${key} link is invalid. You must enter a full link`
          )
        }
      } catch (err) {
        throw new Error(
          `You must provide full social links with http(s) - ${err.message}`
        )
      }
    }
  }

  return true
}

export const updateProfileValidator = [
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3 })
    .withMessage('Username should be at least 3 characters long'),

  body('bio')
    .optional()
    .isLength({ max: PROFILE_BIO_LIMIT })
    .withMessage(`Bio should be less than ${PROFILE_BIO_LIMIT} characters`),

  body('social_links')
    .optional()
    .custom(socialLinksValidator),
]
