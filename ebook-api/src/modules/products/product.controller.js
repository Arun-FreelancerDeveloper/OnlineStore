const service = require('./product.service');
const ApiResponse = require('../../utils/apiResponse');

// ================= CREATE =================
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
exports.getProductById = async (req, res, next) => {
  try {
    const data = await service.getProductById(req.params.productId);
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