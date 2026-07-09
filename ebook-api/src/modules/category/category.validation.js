const Joi = require('joi');

const normalizeCategoryPayload = (body = {}) => {
  if (!body || typeof body !== 'object') {
    return body;
  }

  const normalized = { ...body };

  if (normalized.groupId === undefined && normalized.groupid !== undefined) {
    normalized.groupId = normalized.groupid;
  }

  if (normalized.categoryName === undefined && normalized.categoryname !== undefined) {
    normalized.categoryName = normalized.categoryname;
  }

  if (normalized.createdBy === undefined && normalized.createdby !== undefined) {
    normalized.createdBy = normalized.createdby;
  }

  if (normalized.modifiedBy === undefined && normalized.modifiedby !== undefined) {
    normalized.modifiedBy = normalized.modifiedby;
  }

  if (normalized.deletedBy === undefined && normalized.deletedby !== undefined) {
    normalized.deletedBy = normalized.deletedby;
  }

  return normalized;
};

/**
 * Validation schema for creating a Category
 */
const createCategorySchema = Joi.object({
  groupId: Joi.number().integer().required(),
  groupid: Joi.number().integer(),
  categoryName: Joi.string().trim().min(2).max(100).required(),
  categoryname: Joi.string().trim().min(2).max(100),
  imagepath: Joi.string().allow('', null),
  imagePath: Joi.string().allow('', null),
  createdBy: Joi.number().integer().required(),
  createdby: Joi.number().integer()
}).unknown(true);

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
  const normalizedBody = normalizeCategoryPayload(req.body);
  const { error, value } = schema.validate(normalizedBody, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details.map(d => d.message).join(', ')
    });
  }
  req.body = value;
  next();
};

const validateCreateCategory = (req, res, next) => {
  const normalizedBody = normalizeCategoryPayload(req.body);
  const groupId = normalizedBody.groupId ?? normalizedBody.groupid;
  const categoryName = normalizedBody.categoryName ?? normalizedBody.categoryname;
  const createdBy = normalizedBody.createdBy ?? normalizedBody.createdby;

  if (groupId === undefined || groupId === null || groupId === '') {
    return res.status(400).json({ success: false, message: '"groupId" is required' });
  }

  if (categoryName === undefined || categoryName === null || categoryName === '') {
    return res.status(400).json({ success: false, message: '"categoryName" is required' });
  }

  if (createdBy === undefined || createdBy === null || createdBy === '') {
    return res.status(400).json({ success: false, message: '"createdBy" is required' });
  }

  const { error, value } = createCategorySchema.validate({
    ...normalizedBody,
    groupId,
    categoryName,
    createdBy
  }, { abortEarly: false });

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
  validateCreateCategory,
  validateParams,
  validateQuery
};