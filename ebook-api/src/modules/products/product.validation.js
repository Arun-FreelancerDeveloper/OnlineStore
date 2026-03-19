const Joi = require('joi');

/**
 * ================= CREATE PRODUCT =================
 */
const createProductSchema = Joi.object({
  productcode: Joi.string().max(50).allow('', null),

  productname: Joi.string()
    .min(2)
    .max(150)
    .required(),

  shortdescription: Joi.string()
    .max(255)
    .allow('', null),

  categoryid: Joi.number().integer().required(),
  subcategoryid: Joi.number().integer().allow(null),
  deptid: Joi.number().integer().allow(null),
  storeid: Joi.number().integer().allow(null),

  createdby: Joi.number().integer().required()
});

/**
 * ================= UPDATE PRODUCT =================
 */
const updateProductSchema = Joi.object({
  productcode: Joi.string().max(50).allow('', null),

  productname: Joi.string()
    .min(2)
    .max(150)
    .required(),

  shortdescription: Joi.string()
    .max(255)
    .allow('', null),

  categoryid: Joi.number().integer().required(),
  subcategoryid: Joi.number().integer().allow(null),
  deptid: Joi.number().integer().allow(null),
  storeid: Joi.number().integer().allow(null),

  modifiedby: Joi.number().integer().required()
});

/**
 * ================= GET PRODUCTS =================
 */
const getProductsSchema = Joi.object({
  categoryId: Joi.number().integer().default(0),

  page: Joi.number()
    .integer()
    .min(1)
    .default(1),

  pageSize: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10),

  findWhat: Joi.string().allow('').optional()
});

/**
 * ================= PARAM VALIDATION =================
 */
const productIdParamSchema = Joi.object({
  productId: Joi.number().integer().required()
});

const categoryIdParamSchema = Joi.object({
  categoryId: Joi.number().integer().required()
});

/**
 * ================= DELETE PRODUCT =================
 */
const deleteProductSchema = Joi.object({
  deletedBy: Joi.number().integer().required()
});

/**
 * ================= COMMON MIDDLEWARE =================
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
  createProductSchema,
  updateProductSchema,
  getProductsSchema,
  deleteProductSchema,
  productIdParamSchema,
  categoryIdParamSchema,
  validateBody,
  validateParams,
  validateQuery
};