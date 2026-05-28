const authService = require('./auth.service');
const ApiResponse = require('../../utils/apiResponse');
const { sendWelcomeEmail } = require('../../services/email.service');
const { json } = require('express');

/**
 * <summary>
 * Authentication Controller
 * </summary>
 * <remarks>
 * Exposes authentication endpoints and delegates to `auth.service`.
 * Controllers should remain thin and forward unexpected errors via `next(err)`.
 * </remarks>
 */

/**
 * <summary>
 * Login endpoint.
 * </summary>
 * <param name="req">Express request with body { email, password }.</param>
 * <param name="res">Express response returns ApiResponse on success.</param>
 * <param name="next">Express next for forwarding errors.</param>
 * <returns>ApiResponse with token and user metadata.</returns>
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
 * <summary>
 * Change Password endpoint.
 * </summary>
 * <remarks>Accepts a `token` and a `newpassword` in the request body. The service verifies the token and updates the password.</remarks>
 * <param name="req">Express request. Body: { token, newpassword }.</param>
 * <param name="res">Express response. Returns success message on completion.</param>
 * <param name="next">Express next for error forwarding.</param>
 * <returns>JSON success object.</returns>
 */

exports.changePassword = async (req, res, next) => {
  try {
    const data = await authService.changePassword(req.body.token, req.body.newpassword);
    res.json({
      success: true,
      message: 'Password changed successfully',
      data
    });
  } catch (err) {
    next(err);
  }
};

/**
 * <summary>
 * Forgot Password endpoint.
 * </summary>
 * <remarks>Generates a short-lived reset token and emails a reset link to the user.</remarks>
 * <param name="req">Express request. Body: { email, callbackurl }.</param>
 * <param name="res">Express response. Returns ApiResponse on success.</param>
 * <param name="next">Express next for error forwarding.</param>
 * <returns>ApiResponse acknowledging the sent email.</returns>
 */

exports.forgotPassword = async (req, res, next) => {
  try {
    const data = await authService.forgotPassword(req.body.email, req.body.callbackurl);
    res.json(ApiResponse.success(
      data,
      'Password reset link sent to your email'
    ));

  } catch (err) {
    next(err);
  }
};