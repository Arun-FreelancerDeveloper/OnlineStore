const Joi = require('joi');

/**
 * Validation schema for creating a Category
 */
const createCategorySchema = Joi.object({
  groupid: Joi.number().integer().required(),
  categoryname: Joi.string().min(2).max(100).required(),
  imagepath: Joi.string().allow('', null),
  createdby: Joi.number().integer().required()
});

/**
 * Validation schema for updating a Category
 */
const updateCategorySchema = Joi.object({
  categoryname: Joi.string().min(2).max(100).required(),
  imagepath: Joi.string().allow('', null),
  modifiedby: Joi.number().integer().required()
});

/**
 * Validation schema for retrieving a category by ID
 */
const getCategoryByIdSchema = Joi.object({
  id: Joi.number().integer().required()
});

/**
 * Validation schema for deleting a Category
 */
const deleteCategorySchema = Joi.object({
  deletedBy: Joi.number().integer().required()
});

/**
 * Validation schema for pagination + optional search
 */
const getCategorysSchema = Joi.object({
  groupId: Joi.number().integer().default(0),
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(10),
  findWhat: Joi.string().allow('').optional()
});

/**
 * Middleware to validate request body
 */
const validateBody = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details.map(d => d.message).join(', ')
    });
  }
  req.body = value;
  next();
};

/**
 * Middleware to validate request params
 */
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

/**
 * Middleware to validate query params
 */
const validateQuery = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.query, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details.map(d => d.message).join(', ')
    });
  }
  req.query = value;
  next();
};

module.exports = {
  createCategorySchema,
  updateCategorySchema,
  getCategoryByIdSchema,
  deleteCategorySchema,
  getCategorysSchema,
  validateBody,
  validateParams,
  validateQuery
};