const Joi = require('joi');

/**
 * 🔐 Login Schema
 */
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

/**
 * ✅ Middleware
 */
exports.validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return next(new Error(error.details[0].message));
  }
  next(); // go to controller
};

exports.changePasswordSchema = Joi.object({
  newPassword: Joi.string().min(6).required()
});


exports.forgotPasswordSchema = Joi.object({
 email: Joi.string().email().required(),
});