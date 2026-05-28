const repo = require('./order.repository');

/**
 * <summary>
 * Place a new order, including items and order status tracking.
 * </summary>
 * <param name="data">Order payload containing user, shipping, payment and item details.</param>
 * <returns>Promise resolving to the newly created order record.</returns>
 */
exports.createorder = async (data) => {
  return await repo.createorder(data);
};

/**
 * <summary>
 * Retrieve all orders for administrative review.
 * </summary>
 * <returns>Promise resolving to an array of order summaries.</returns>
 */
exports.getAllorders = async () => {
  return await repo.getAllOrders();
};

/**
 * <summary>
 * Retrieve all orders placed by a specific user.
 * </summary>
 * <param name="userid">User identifier.</param>
 * <returns>Promise resolving to an array of order records.</returns>
 */
exports.getOrdersByUserId = async (userid) => {
  return await repo.getOrdersByUserId(userid);
};

/**
 * <summary>
 * Retrieve a single order by its internal database ID.
 * </summary>
 * <param name="orderid">Order identifier.</param>
 * <returns>Promise resolving to the order record if found.</returns>
 */
exports.getorderById = async (orderid) => {
  return await repo.getOrderById(orderid);
};

/**
 * <summary>
 * Retrieve a single order by its order number.
 * </summary>
 * <param name="orderno">External order number.</param>
 * <returns>Promise resolving to the order record if found.</returns>
 */
exports.getOrderByInvoiceNo = async (orderno) => {
  return await repo.getOrderByInvoiceNo(orderno);
};

/**
 * <summary>
 * Retrieve order status history for an order.
 * </summary>
 * <param name="orderid">Order identifier.</param>
 * <returns>Promise resolving to a history array.</returns>
 */
exports.getOrderStatusHistory = async (orderid) => {
  return await repo.getOrderStatusHistory(orderid);
};

/**
 * <summary>
 * Update the current status of an order and append history.
 * </summary>
 * <param name="orderid">Order identifier.</param>
 * <param name="data">Status update payload containing status, remarks, and modifiedby.</param>
 * <returns>Promise resolving to the updated order summary.</returns>
 */
exports.updateOrderStatus = async (orderid, data) => {
  const { status, remarks, modifiedby } = data;

  const order = await repo.updateOrderStatus(
    orderid,
    status,
    remarks,
    modifiedby
  );

  return order;
};

/**
 * <summary>
 * Soft delete an order by marking it as deleted.
 * </summary>
 * <param name="orderid">Order identifier.</param>
 * <param name="deletedby">User performing the deletion.</param>
 * <returns>Promise resolving once deletion is complete.</returns>
 */
exports.deleteorder = async (orderid, deletedby) => {
  return await repo.deleteOrder(orderid, deletedby);
};
