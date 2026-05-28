const repo = require('./shipping.repository');

/**
 * <summary>
 * Shipping Address Service layer.
 * </summary>
 * <remarks>
 * Delegates shipping address persistence to the repository.
 * </remarks>
 */

/**
 * <summary>
 * Create a shipping address record.
 * </summary>
 * <param name="data">Payload containing shipping address fields.</param>
 * <returns>Promise resolving to the created address.</returns>
 */
exports.createAddress = (data) => repo.createAddress(data);

/**
 * <summary>
 * Retrieve shipping addresses for a user.
 * </summary>
 * <param name="userid">User identifier.</param>
 * <returns>Promise resolving to an array of addresses.</returns>
 */
exports.getAddressByUser = (userid) => repo.getAddressByUser(userid);

/**
 * <summary>
 * Update a shipping address record.
 * </summary>
 * <param name="id">Address identifier.</param>
 * <param name="data">Update payload for the address.</param>
 * <returns>Promise resolving to the updated address.</returns>
 */
exports.updateAddress = (id, data) => repo.updateAddress(id, data);

/**
 * <summary>
 * Soft delete a shipping address.
 * </summary>
 * <param name="id">Address identifier.</param>
 * <returns>Promise resolving once deletion is complete.</returns>
 */
exports.deleteAddress = (id) => repo.deleteAddress(id);
