const service = require('./user.service');
const ApiResponse = require('../../utils/apiResponse');
const { json } = require('express');
const jwt = require('jsonwebtoken');
const { sendWelcomeEmail } = require('../../services/email.service');
/**
 * User Controller
 *
 * - Handles all HTTP requests related to users
 * - Delegates business logic to service layer
 * - Returns standardized API responses
 */

/**
 * <summary>
 * Create a new user account.
 * </summary>
 * <remarks>
 * Reads payload from `req.body`, ensures the email is unique by calling
 * the service layer, creates the user, issues a JWT token and returns
 * a standardized `ApiResponse`.
 * The welcome email is dispatched asynchronously and does not block the response.
 * </remarks>
 * <param name="req">Express request object. Expects JSON body with `fullname`, `email`, `password`.</param>
 * <param name="res">Express response object. Returns JSON ApiResponse.</param>
 * <param name="next">Express next function for error forwarding.</param>
 * <returns>JSON ApiResponse containing token and user metadata.</returns>
 */
exports.createUser = async (req, res, next) => {
  try {

    /* Check if email already exists */
    const { email } = req.body;
    const exists = await service.isEmailExists(email);
    if (exists) {
      return res.status(409).json(
        ApiResponse.failure('Email already exists. Please use another email.')
      );
    }

    /* Create user */
    const data = await service.createUser(req.body);
    if (data) {
        // ✅ Create token
      const token = jwt.sign(
        {
          userId: data.userid,
          displayName: data.fullname,
          role: data.usertype
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      // ✅ Proper response structure
      const response = {
        token,
        user: {
          userid: data.userid,
          displayName: data.fullname,
          usertype: data.usertype,
          email: data.email   // optional
        }
      };

      res.json(
        ApiResponse.success(
          response,
          'Your account has been created successfully.'
        )
      );

      // ✅ Send email (async - don't block response)
      sendWelcomeEmail({
        email: data.email,
        fullname: data.fullname
      });
    }

  } catch (err) {
    next(err);
  }
};

/**
 * <summary>
 * Get a paginated list of users.
 * </summary>
 * <param name="req">Express request. Supports query params: `page`, `pageSize`, `findWhat`.</param>
 * <param name="res">Express response. Returns ApiResponse with pagination metadata and `users` array.</param>
 * <param name="next">Express next for error forwarding.</param>
 * <returns>ApiResponse with pagination and user list.</returns>
 */
exports.getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const findWhat = req.query.findWhat || '';
    const data = await service.getUsers(page, pageSize, findWhat);
    res.json(ApiResponse.success(data, 'User list fetched successfully.'));
  } catch (err) {
    next(err);
  }
};

/**
 * <summary>
 * Update user details.
 * </summary>
 * <param name="req">Express request. Path param `id` identifies the user. Body contains fields to update.</param>
 * <param name="res">Express response. Returns ApiResponse with updated user object.</param>
 * <param name="next">Express next for error forwarding.</param>
 * <returns>ApiResponse with the updated user.</returns>
 */
exports.updateUser = async (req, res, next) => {
  try {
    const data = await service.updateUser(req.params.id, req.body);
    res.json(ApiResponse.success(data, 'Your account details have been updated successfully.'));
  } catch (err) {
    next(err);
  }
};

/**
 * <summary>
 * Soft-delete a user (set delflag).
 * </summary>
 * <param name="req">Express request. Path param `id` is required.</param>
 * <param name="res">Express response. Returns success ApiResponse on completion.</param>
 * <param name="next">Express next for error forwarding.</param>
 * <returns>ApiResponse with deletion status.</returns>
 */
exports.deleteUser = async (req, res, next) => {
  try {
    await service.deleteUser(req.params.id);
    res.json(ApiResponse.success(null, 'Your account has been removed successfully.'));
  } catch (err) {
    next(err);
  }
};


/**
 * <summary>
 * Authenticate a user and return authentication payload.
 * </summary>
 * <remarks>
 * Calls `user.service.login` which will throw a 401 error for invalid credentials.
 * On success returns `ApiResponse.success(data)` where `data` typically includes user info and/or tokens.
 * </remarks>
 * <param name="req">Express request. Expects `email` and `password` in body.</param>
 * <param name="res">Express response. Returns ApiResponse on success or forwards error to next.</param>
 * <param name="next">Express next for error forwarding.</param>
 * <returns>ApiResponse with authentication result.</returns>
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await service.login({ email, password });
    if (!data) {
      return res.status(401).json(
        ApiResponse.failure('Invalid email or password.')
      );
    }else{
      res.json(ApiResponse.success(data, 'Login successful.'));
    }

  } catch (err) {
    next(err);
  }
};