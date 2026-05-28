const service = require('./product.service');
const ApiResponse = require('../../utils/apiResponse');

// ================= CREATE =================
/**
 * <summary>
 * Create a new product.
 * </summary>
 * <param name="req">Express request. Body contains product fields; `req.files` may contain uploaded images.</param>
 * <param name="res">Express response. Returns ApiResponse with created product.</param>
 * <param name="next">Express next for error forwarding.</param>
 * <returns>ApiResponse with created product object.</returns>
 */
exports.createProduct = async (req, res, next) => {
  try {
    const data = await service.createProduct(req.body, req.files);

    res.json(
      ApiResponse.success(data, 'Product created successfully.')
    );
  } catch (err) {
    next(err);
  }
};

// ================= GET ALL =================
/**
 * <summary>
 * Get paginated list of products with optional category filter and search.
 * </summary>
 * <param name="req">Query params: `categoryId`, `page`, `pageSize`, `findWhat`.</param>
 * <param name="res">Returns ApiResponse with pagination metadata and `products` array.</param>
 * <param name="next">Express next for errors.</param>
 * <returns>ApiResponse with paginated products.</returns>
 */
exports.getAllProducts = async (req, res, next) => {
  try {
    const categoryId = parseInt(req.query.categoryId) || 0;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const findWhat = req.query.findWhat || '';

    const data = await service.getAllProducts(
      categoryId,
      page,
      pageSize,
      findWhat
    );

    res.json(
      ApiResponse.success(data, 'Products fetched successfully.')
    );
  } catch (err) {
    next(err);
  }
};

// ================= GET BY ID =================
/**
 * <summary>
 * Get single product details by id.
 * </summary>
 * <param name="req">Path param `productId`.</param>
 * <param name="res">Returns ApiResponse containing product details.</param>
 * <param name="next">Express next for errors.</param>
 * <returns>ApiResponse with product details.</returns>
 */
exports.getProductById = async (req, res, next) => {
  try {
    const data = await service.getProductById(req.params.productId);
    console.log('Product details:', data);
    res.json(
      ApiResponse.success(
        data,
        'Product details retrieved successfully.'
      )
    );
  } catch (err) {
    next(err);
  }
};

// ================= UPDATE =================
/**
 * <summary>
 * Update an existing product. Supports updating images via `req.files`.
 * </summary>
 * <param name="req">Path param `productId`, body with updated fields, optional `req.files`.</param>
 * <param name="res">Returns ApiResponse with updated product.</param>
 * <param name="next">Express next for errors.</param>
 * <returns>ApiResponse with updated product.</returns>
 */
exports.updateProduct = async (req, res, next) => {
  try {
    const data = await service.updateProduct(
      req.params.productId,
      req.body,
      req.files
    );

    res.json(
      ApiResponse.success(data, 'Product updated successfully.')
    );
  } catch (err) {
    next(err);
  }
};

// ================= DELETE =================
/**
 * <summary>
 * Soft-delete a product. Requires `deletedBy` in request body.
 * </summary>
 * <param name="req">Path param `productId`. Body: { deletedBy }.</param>
 * <param name="res">Returns ApiResponse on success or ApiResponse.error on validation failure.</param>
 * <param name="next">Express next for errors.</param>
 * <returns>ApiResponse acknowledging deletion.</returns>
 */
exports.deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { deletedBy } = req.body;

    if (!deletedBy) {
      return res
        .status(400)
        .json(ApiResponse.error('deletedBy is required'));
    }

    await service.deleteProduct(productId, deletedBy);

    res.json(
      ApiResponse.success(null, 'Product removed successfully.')
    );
  } catch (err) {
    next(err);
  }
};


// ================= UPDATE PRODUCT IMAGES =================
/**
 * <summary>
 * Update images for a product. Requires `userId` either from token (`req.user`) or body.
 * </summary>
 * <param name="req">Path param `productId`. `req.files` must include uploaded images. User id via token or `req.body.userId`.</param>
 * <param name="res">Returns ApiResponse with updated image metadata.</param>
 * <param name="next">Express next for errors.</param>
 * <returns>ApiResponse with image update results.</returns>
 */
exports.updateProductImages = async (req, res, next) => {
  try {
    const { productId } = req.params;

    // You can get userId from token (recommended)
    const userId = req.user?.id || req.body.userId;

    if (!userId) {
      return res
        .status(400)
        .json(ApiResponse.error('userId is required'));
    }

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json(ApiResponse.error('No images uploaded'));
    }

    const data = await service.updateProductImages(
      productId,
      req.files,
      userId
    );

    res.json(
      ApiResponse.success(data, 'Product images updated successfully.')
    );

  } catch (err) {
    next(err);
  }
};