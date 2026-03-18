const Joi = require('joi');

/**
 * Validation schema for creating a user
 */
const createUserSchema = Joi.object({
  fullname: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  userType: Joi.string().valid('Admin', 'User', 'Vendor').required(),
  vendorNumber: Joi.string().optional()
});

/**
 * Validation schema for updating a user
 */
const updateUserSchema = Joi.object({
  fullname: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required()
});

/**
 * Validation schema for changing password
 */
const changePasswordSchema = Joi.object({
  userId: Joi.number().required(),
  newPassword: Joi.string().min(6).required()
});

/**
 * Validation schema for pagination + search
 */
const getUsersSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(10),
  findWhat: Joi.string().allow('').optional()
});

/**
 * Middleware to validate request body or query
 */
const validateBody = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ success: false, message: error.details.map(d => d.message).join(', ') });
  req.body = value;
  next();
};

const validateQuery = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.query, { abortEarly: false });
  if (error) return res.status(400).json({ success: false, message: error.details.map(d => d.message).join(', ') });
  req.query = value;
  next();
};

// Middleware to validate request params (for delete/update by id)
const validateParams = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.params, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details.map(d => d.message).join(', ')
    });
  }
  req.params = value;
  next();
};

// Validation schema for deleting a user
const deleteUserSchema = Joi.object({
  id: Joi.number().integer().min(1).required()
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  changePasswordSchema,
  getUsersSchema,
  validateBody,
  validateQuery,
  validateParams,
  deleteUserSchema
};