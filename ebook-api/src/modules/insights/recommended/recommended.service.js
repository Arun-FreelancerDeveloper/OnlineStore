const repo = require('./recommended.repository');
/**
 * Get All Products (Pagination + Search)
 * - Supports filtering by category
 * - Supports search by product name
 * - @param {number} page
 * - @param {number} pageSize
 */
exports.getRecommendedProducts = async (
  page = 1,
  pageSize = 10
) => {
  return await repo.getRecommendedProducts(
    page,
    pageSize
  );
};