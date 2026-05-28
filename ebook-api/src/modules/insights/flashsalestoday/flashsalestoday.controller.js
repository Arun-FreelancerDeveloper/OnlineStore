const service = require('./flashsalestoday.service');
const ApiResponse = require('../../../utils/apiResponse');

/**
 * <summary>
 * Retrieve flash sale products with pagination.
 * </summary>
 * <param name="req">Express request object containing pagination query params.</param>
 * <param name="res">Express response object returning flash sale products.</param>
 * <param name="next">Express next middleware callback for error handling.</param>
 * <returns>JSON response with paginated flash sale products.</returns>
 */
exports.getFlashSaleProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const result = await service.getFlashSaleProducts(page, pageSize);
    res.status(200).json({
      success: true,
      message: 'Flash sale products fetched successfully',
      data: result
    });

  } catch (error) {
    next(error);
  }
};
