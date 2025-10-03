import { body, param } from 'express-validator'

export const inviteCollaboratorValidator = [
  body('project_id')
    .notEmpty()
    .withMessage('Project ID is required')
    .isMongoId()
    .withMessage('Project ID must be a valid Mongo ID'),
]

export const respondInvitationValidator = [
  param('token')
    .notEmpty()
    .withMessage('Token is required')
    .isHexadecimal()
    .withMessage('Token must be valid'),
]

export const getCollaboratorsValidator = [
  param('project_id')
    .notEmpty()
    .withMessage('Project ID is required')
    .isMongoId()
    .withMessage('Project ID must be a valid Mongo ID'),
]
