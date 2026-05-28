const service = require('./featured.service');
const ApiResponse = require('../../../utils/apiResponse');

/**
 * <summary>
 * Retrieve featured products with pagination.
 * </summary>
 * <param name="req">Express request object containing pagination query params.</param>
 * <param name="res">Express response object returning featured products.</param>
 * <param name="next">Express next middleware callback for error handling.</param>
 * <returns>JSON response with paginated featured products.</returns>
 */
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const result = await service.getFeaturedProducts(page, pageSize);
    res.status(200).json({
      success: true,
      message: 'Featured Products fetched successfully',
      data: result
    });

  } catch (error) {
    next(error);
  }
};
