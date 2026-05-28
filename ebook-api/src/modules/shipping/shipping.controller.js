const service = require('./shipping.service');
const ApiResponse = require('../../utils/apiResponse');

/**
 * <summary>
 * Create a new shipping address for the authenticated user.
 * </summary>
 * <param name="req">Express request object with shipping address payload in body.</param>
 * <param name="res">Express response object returning the created address.</param>
 * <param name="next">Express next middleware callback for error handling.</param>
 * <returns>JSON response containing the created shipping address.</returns>
 */
exports.createAddress = async (req, res, next) => {
  try {
    const data = await service.createAddress(req.body);
    res.json(ApiResponse.success(data, 'Your shipping address has been added successfully.'));
  } catch (err) {
    next(err);
  }
};

/**
 * <summary>
 * Retrieve all shipping addresses for a user.
 * </summary>
 * <param name="req">Express request object with userid parameter.</param>
 * <param name="res">Express response object returning user addresses.</param>
 * <param name="next">Express next middleware callback for error handling.</param>
 * <returns>JSON response with address list.</returns>
 */
exports.getAddressByUser = async (req, res, next) => {
  try {
    const data = await service.getAddressByUser(req.params.userid);
    res.json(ApiResponse.success(data, 'Your shipping addresses have been retrieved successfully.'));
  } catch (err) {
    next(err);
  }
};

/**
 * <summary>
 * Update an existing shipping address by ID.
 * </summary>
 * <param name="req">Express request object with address ID in params and update payload in body.</param>
 * <param name="res">Express response object returning the updated address.</param>
 * <param name="next">Express next middleware callback for error handling.</param>
 * <returns>JSON response containing the updated address.</returns>
 */
exports.updateAddress = async (req, res, next) => {
  try {
    const data = await service.updateAddress(req.params.id, req.body);
    res.json(ApiResponse.success(data, 'Your shipping address has been updated successfully.'));
  } catch (err) {
    next(err);
  }
};

/**
 * <summary>
 * Soft delete a shipping address.
 * </summary>
 * <param name="req">Express request object with address ID in params.</param>
 * <param name="res">Express response object returning success.</param>
 * <param name="next">Express next middleware callback for error handling.</param>
 * <returns>JSON response confirming removal.</returns>
 */
exports.deleteAddress = async (req, res, next) => {
  try {
    await service.deleteAddress(req.params.id);
    res.json(ApiResponse.success(null, 'Your shipping address has been removed successfully.'));
  } catch (err) {
    next(err);
  }
};
