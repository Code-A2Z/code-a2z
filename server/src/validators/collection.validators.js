import { body, param, query } from 'express-validator'

export const createCollectionValidator = [
  body('collection_name')
    .notEmpty()
    .withMessage('Collection name is required')
    .isString()
    .withMessage('Collection name must be a string')
    .trim(),
]

export const deleteCollectionValidator = [
  body('collection_name')
    .notEmpty()
    .withMessage('Collection name is required')
    .isString()
    .withMessage('Collection name must be a string')
    .trim(),
]

export const saveProjectValidator = [
  param('id')
    .notEmpty()
    .withMessage('Collection ID is required')
    .isMongoId()
    .withMessage('Collection ID must be a valid Mongo ID'),
  body('project_id')
    .notEmpty()
    .withMessage('Project ID is required')
    .isMongoId()
    .withMessage('Project ID must be a valid Mongo ID'),
  body('collection_name')
    .optional()
    .isString()
    .withMessage('Collection name must be a string')
    .trim(),
]

export const removeProjectValidator = [
  body('collection_id')
    .notEmpty()
    .withMessage('Collection ID is required')
    .isMongoId()
    .withMessage('Collection ID must be a valid Mongo ID'),
  body('project_id')
    .notEmpty()
    .withMessage('Project ID is required')
    .isMongoId()
    .withMessage('Project ID must be a valid Mongo ID'),
]

export const sortProjectValidator = [
  query('sortBy')
    .optional()
    .isIn(['likes', 'newest', 'oldest'])
    .withMessage('sortBy must be one of: likes, newest, oldest'),
]
