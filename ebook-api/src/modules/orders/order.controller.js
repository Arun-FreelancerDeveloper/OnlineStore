const service = require('./order.service');
const ApiResponse = require('../../utils/apiResponse');
const logger = require('../../utils/logger');

/**
 * <summary>
 * Create a new order, including items, initial status, and email notification.
 * </summary>
 * <param name="req">Express request object containing order payload in body.</param>
 * <param name="res">Express response object for sending JSON responses.</param>
 * <param name="next">Express next middleware callback for error handling.</param>
 * <returns>JSON response with the created order and success message.</returns>
 */
exports.createorder = async (req, res, next) => {
  try {
    const data = await service.createorder(req.body);
    res.json(
      ApiResponse.success(data, 'Order created successfully.')
    );
  } catch (err) {
    next(err);
  }
};

/**
 * <summary>
 * Retrieve all orders for admin view.
 * </summary>
 * <param name="req">Express request object.</param>
 * <param name="res">Express response object returning order list.</param>
 * <param name="next">Express next middleware callback for error handling.</param>
 * <returns>JSON response with all orders.</returns>
 */
exports.getAllorders = async (req, res, next) => {
  try {
    const data = await service.getAllorders();
    res.json(ApiResponse.success(data));
  } catch (err) {
    next(err);
  }
};

/**
 * <summary>
 * Retrieve a single order by its database ID.
 * </summary>
 * <param name="req">Express request object containing order ID in params.</param>
 * <param name="res">Express response object returning order details.</param>
 * <param name="next">Express next middleware callback for error handling.</param>
 * <returns>JSON response with order details.</returns>
 */
exports.getorder = async (req, res, next) => {
  try {
    const data = await service.getorderById(req.params.id);
    res.json(
      ApiResponse.success(data, 'Order details retrieved successfully.')
    );
  } catch (err) {
    next(err);
  }
};

/**
 * <summary>
 * Retrieve a single order by its order number.
 * </summary>
 * <param name="req">Express request object containing order number in params.</param>
 * <param name="res">Express response object returning order details.</param>
 * <param name="next">Express next middleware callback for error handling.</param>
 * <returns>JSON response with order details.</returns>
 */
exports.getorderinvoice = async (req, res, next) => {
  try {
    logger.info(`Fetching order details for order number: ${req.params.orderno}`);
    const data = await service.getOrderByInvoiceNo(req.params.orderno);
    res.json(
      ApiResponse.success(data, 'Order details retrieved successfully.')
    );
  } catch (err) {
    next(err);
  }
};

/**
 * <summary>
 * Retrieve orders for a specific user.
 * </summary>
 * <param name="req">Express request object containing userid in params.</param>
 * <param name="res">Express response object returning user orders.</param>
 * <param name="next">Express next middleware callback for error handling.</param>
 * <returns>JSON response with the user's orders.</returns>
 */
exports.getOrdersByUser = async (req, res, next) => {
  try {
    const data = await service.getOrdersByUserId(req.params.userid);
    res.json(ApiResponse.success(data));
  } catch (err) {
    next(err);
  }
};

/**
 * <summary>
 * Update the status of an existing order and record status history.
 * </summary>
 * <param name="req">Express request object containing order ID in params and status payload in body.</param>
 * <param name="res">Express response object returning updated order state.</param>
 * <param name="next">Express next middleware callback for error handling.</param>
 * <returns>JSON response with the updated status.</returns>
 */
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, remarks, modifiedby } = req.body;

    const data = await service.updateOrderStatus(
      req.params.id,
      status,
      remarks,
      modifiedby
    );

    res.json(
      ApiResponse.success(data, 'Order status updated successfully.')
    );
  } catch (err) {
    next(err);
  }
};

/**
 * <summary>
 * Soft delete an order by ID.
 * </summary>
 * <param name="req">Express request object containing order ID in params and deletedby in body.</param>
 * <param name="res">Express response object returning success.</param>
 * <param name="next">Express next middleware callback for error handling.</param>
 * <returns>JSON success response with no payload.</returns>
 */
exports.deleteorder = async (req, res, next) => {
  try {
    await service.deleteOrder(
      req.params.id,
      req.body.deletedby
    );

    res.json(
      ApiResponse.success(null, 'Order removed successfully.')
    );
  } catch (err) {
    next(err);
  }
};

/**
 * <summary>
 * Retrieve history records for a specific order.
 * </summary>
 * <param name="req">Express request object containing order ID in params.</param>
 * <param name="res">Express response object returning status history.</param>
 * <param name="next">Express next middleware callback for error handling.</param>
 * <returns>JSON response with order history array.</returns>
 */
exports.getOrderStatusHistory = async (req, res, next) => {
  try {
    const data = await service.getOrderStatusHistory(
      req.params.id
    );

    res.json(
      ApiResponse.success(
        data,
        'Order status history retrieved successfully.'
      )
    );
  } catch (err) {
    next(err);
  }
};
