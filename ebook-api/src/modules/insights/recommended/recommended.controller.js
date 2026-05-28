const service = require('./recommended.service');
const ApiResponse = require('../../../utils/apiResponse');

/**
 * <summary>
 * Retrieve recommended products with pagination.
 * </summary>
 * <param name="req">Express request object containing pagination query params.</param>
 * <param name="res">Express response object returning recommended products.</param>
 * <param name="next">Express next middleware callback for error handling.</param>
 * <returns>JSON response with paginated recommended products.</returns>
 */
exports.getRecommendedProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const result = await service.getRecommendedProducts(page, pageSize);
    res.status(200).json({
      success: true,
      message: 'Recommended Products fetched successfully',
      data: result
    });

  } catch (error) {
    next(error);
  }
};
