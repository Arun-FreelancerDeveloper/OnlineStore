const repo = require('./product.repository');

/**
 * Create Product
 *
 * - Handles product creation
 * - Processes uploaded images
 * - @param {Object} data
 * - @param {Array} files
 */
exports.createProduct = async (data, files) => {
  let imagePaths = [];

  if (files && files.length > 0) {
    imagePaths = files.map(file => file.path); // or file.filename
  }

  const productData = {
    ...data,
    images: imagePaths
  };

  return await repo.createProduct(productData);
};

/**
 * Get All Products (Pagination + Search)
 * - Supports filtering by category
 * - Supports search by product name
 * - @param {number} categoryId
 * - @param {number} page
 * - @param {number} pageSize
 * - @param {string} findWhat
 */
exports.getAllProducts = async (
  categoryId,
  page = 1,
  pageSize = 10,
  findWhat = ''
) => {
  return await repo.getAllProducts(
    categoryId,
    page,
    pageSize,
    findWhat
  );
};

/**
 * Get Product by ID
 * - Retrieves detailed information about a specific product
 * - @param {number} productId
 */
exports.getProductById = async (productId) => {
  return await repo.getProductById(productId);
};

/**
 * Update Product
 *
 * - Handles optional image update
 * - If new images are uploaded, they replace existing ones
 * - @param {number} productId
 * - @param {Object} data
 * - @param {Array} files
 */
exports.updateProduct = async (productId, data, files) => {
  let imagePaths = [];

  if (files && files.length > 0) {
    imagePaths = files.map(file => file.path);
  }

  const productData = {
    ...data,
    ...(imagePaths.length > 0 && { images: imagePaths })
  };

  return await repo.updateProduct(productId, productData);
};

/**
 * Delete Product (Soft Delete)
 * - Marks the product as inactive instead of removing it from the database
 * - @param {number} productId
 * - @param {number} deletedBy
 */
exports.deleteProduct = async (productId, deletedBy) => {
  return await repo.deleteProduct(productId, deletedBy);
};