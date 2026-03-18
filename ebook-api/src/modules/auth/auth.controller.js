const authService = require('./auth.service');
const ApiResponse = require('../../utils/apiResponse');

/**
 * Authentication Controller
 *
 * - Handles user login requests
 * - Delegates business logic to authService
 * - Returns standardized API response
 */
exports.login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body);
    res.json(ApiResponse.success(data, 'Login successful'));
  } catch (err) {
    next(err);
  }
};

/**
 * Change Password
 * - Reads new password from request body
 * - Gets userId from JWT (req.user)
 * - Calls service to change password
 */

exports.changePassword = async (req, res, next) => {
  try {
    const data = await authService.changePassword(req.body);

    res.json({
      success: true,
      message: 'Password changed successfully',
      data
    });
  } catch (err) {
    next(err);
  }
};