const service = require('./featured.service');
const ApiResponse = require('../../../utils/apiResponse');

/**
 * GET /api/products/flash-sale
 */
exports.getFeaturedProducts = async (req, res) => {
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
    console.error('Controller Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};
