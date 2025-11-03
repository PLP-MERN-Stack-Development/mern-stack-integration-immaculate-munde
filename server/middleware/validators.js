// server/middleware/validators.js
// Input validation using express-validator

const { body, param, validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// Post validation rules
const validatePost = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters'),
  
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid category ID');
      }
      return true;
    }),
  
  body('excerpt')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Excerpt cannot exceed 200 characters'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('featuredImage')
    .optional()
    .trim()
    .isURL()
    .withMessage('Featured image must be a valid URL'),
  
  body('isPublished')
    .optional()
    .isBoolean()
    .withMessage('isPublished must be a boolean'),
  
  validate,
];

// Post update validation rules (all fields optional)
const validatePostUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('content')
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters'),
  
  body('category')
    .optional()
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid category ID');
      }
      return true;
    }),
  
  body('excerpt')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Excerpt cannot exceed 200 characters'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('featuredImage')
    .optional()
    .trim()
    .isURL()
    .withMessage('Featured image must be a valid URL'),
  
  body('isPublished')
    .optional()
    .isBoolean()
    .withMessage('isPublished must be a boolean'),
  
  validate,
];

// Category validation rules
const validateCategory = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Category name must be between 2 and 50 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description cannot exceed 200 characters'),
  
  validate,
];

// Comment validation rules
const validateComment = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Comment content is required')
    .isLength({ min: 1, max: 500 })
    .withMessage('Comment must be between 1 and 500 characters'),
  
  validate,
];

// ObjectId parameter validation
const validateObjectId = [
  param('id')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid ID format');
      }
      return true;
    }),
  
  validate,
];

module.exports = {
  validate,
  validatePost,
  validatePostUpdate,
  validateCategory,
  validateComment,
  validateObjectId,
};
