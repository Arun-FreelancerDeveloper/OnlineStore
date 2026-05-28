const service = require('./cart.service');
const ApiResponse = require('../../utils/apiResponse');

/**
 * <summary>
 * Add an item to the user or guest cart.
 * </summary>
 * <param name="req">Express request object containing cart payload in body.</param>
 * <param name="res">Express response object returning the cart item.</param>
 * <param name="next">Express next middleware callback for error handling.</param>
 * <returns>JSON response with the added cart item.</returns>
 */
exports.addToCart = async (req, res, next) => {
  try {
    const data = await service.addToCart(req.body);
    res.json(
      ApiResponse.success(data, 'Item added to cart')
    );
  } catch (err) {
    next(err);
  }
};

/**
 * <summary>
 * Retrieve the cart for a user or guest session.
 * </summary>
 * <param name="req">Express request object containing userid and guestcartid in params.</param>
 * <param name="res">Express response object returning the cart contents.</param>
 * <param name="next">Express next middleware callback for error handling.</param>
 * <returns>JSON response with the cart data.</returns>
 */
exports.getCartByUserId = async (req, res, next) => {
  try {
    const data = await service.getCartByUserId(req.params.userid, req.params.guestcartid);
    res.json(ApiResponse.success(data));
  } catch (err) {
    next(err);
  }
};

/**
 * <summary>
 * Retrieve discount rules for a user based on order history.
 * </summary>
 * <param name="req">Express request object containing userid in params.</param>
 * <param name="res">Express response object returning discount rule data.</param>
 * <param name="next">Express next middleware callback for error handling.</param>
 * <returns>JSON response with discount rule summary.</returns>
 */
exports.getUserDiscountRule = async (req, res, next) => {
  try {
    const data = await service.getUserDiscountRule(req.params.userid);
    res.json(ApiResponse.success(data));
  } catch (err) {
    next(err);
  }
};

/**
 * <summary>
 * Update quantity for a specific cart item.
 * </summary>
 * <param name="req">Express request object containing cartid in params and qty payload in body.</param>
 * <param name="res">Express response object returning updated cart item.</param>
 * <param name="next">Express next middleware callback for error handling.</param>
 * <returns>JSON response with the updated cart item.</returns>
 */
exports.updateCartQty = async (req, res, next) => {
  try {
    const data = await service.updateCartQty(
      req.params.cartid,
      req.body.qty,
      req.body.modifiedby
    );
    res.json(
      ApiResponse.success(data, 'Cart updated successfully')
    );
  } catch (err) {
    next(err);
  }
};

/**
 * <summary>
 * Bulk update multiple cart item quantities.
 * </summary>
 * <param name="req">Express request object containing an items array and modifiedby in body.</param>
 * <param name="res">Express response object returning success.
 * </param>
 * <param name="next">Express next middleware callback for error handling.</param>
 * <returns>JSON response indicating bulk update completion.</returns>
 */
exports.updateCartBulk = async (req, res, next) => {
  try {
    const { items, modifiedby } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.json(
        ApiResponse.error('No cart items provided', 400)
      );
    }

    await service.updateCartBulk(items, modifiedby);

    res.json(
      ApiResponse.success(null, 'Cart updated successfully')
    );
  } catch (err) {
    next(err);
  }
};

/**
 * <summary>
 * Remove a cart item by cart ID.
 * </summary>
 * <param name="req">Express request object containing cartid in params and deletedby in body.</param>
 * <param name="res">Express response object returning success.</param>
 * <param name="next">Express next middleware callback for error handling.</param>
 * <returns>JSON response confirming item removal.</returns>
 */
exports.deleteCartItem = async (req, res, next) => {
  try {
    await service.deleteCartItem(
      req.params.cartid,
      req.body.deletedby
    );
    res.json(
      ApiResponse.success(null, 'Item removed from cart')
    );
  } catch (err) {
    next(err);
  }
};
