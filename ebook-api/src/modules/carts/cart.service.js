const cartRepo = require('./cart.repository');

/**
 * <summary>
 * Add an item to the cart or increment quantity if it already exists.
 * </summary>
 * <param name="payload">Cart item payload.</param>
 * <returns>Promise resolving to the upserted cart row.</returns>
 */
exports.addToCart = async (payload) => {
  return await cartRepo.addToCart(payload);
};

/**
 * <summary>
 * Retrieve cart items for a user or guest session.
 * </summary>
 * <param name="userid">User identifier.</param>
 * <param name="guestcartid">Optional guest cart identifier.</param>
 * <returns>Promise resolving to the cart item list.</returns>
 */
exports.getCartByUserId = async (userid, guestcartid) => {
  return await cartRepo.getCartByUserId(userid, guestcartid);
};

/**
 * <summary>
 * Calculate discount eligibility for a user based on past orders.
 * </summary>
 * <param name="userid">User identifier.</param>
 * <returns>Promise resolving to a discount rule object.</returns>
 */
exports.getUserDiscountRule = async (userid) => {
  return await cartRepo.getUserDiscountRule(userid);
};

/**
 * <summary>
 * Update the quantity of a single cart item.
 * </summary>
 * <param name="cartid">Cart item ID.</param>
 * <param name="qty">New quantity.</param>
 * <param name="modifiedby">User ID updating the cart item.</param>
 * <returns>Promise resolving to the updated cart row.</returns>
 */
exports.updateCartQty = async (cartid, qty, modifiedby) => {
  return await cartRepo.updateCartQty(cartid, qty, modifiedby);
};

/**
 * <summary>
 * Bulk update cart item quantities.
 * </summary>
 * <param name="items">Array of cart items to update.</param>
 * <param name="modifiedby">User ID performing the update.</param>
 * <returns>Promise resolving to true when complete.</returns>
 */
exports.updateCartBulk = async (items, modifiedby) => {
  return await cartRepo.updateCartBulk(items, modifiedby);
};

/**
 * <summary>
 * Soft delete one cart item.
 * </summary>
 * <param name="cartid">Cart item ID.</param>
 * <param name="deletedby">User ID performing deletion.</param>
 * <returns>Promise resolving to true when the item is removed.</returns>
 */
exports.deleteCartItem = async (cartid, deletedby) => {
  return await cartRepo.deleteCartItem(cartid, deletedby);
};
