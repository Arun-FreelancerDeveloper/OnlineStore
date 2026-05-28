const repo = require('./recommended.repository');

/**
 * <summary>
 * Retrieve recommended products via the repository layer.
 * </summary>
 * <param name="page">Page number.</param>
 * <param name="pageSize">Number of records per page.</param>
 * <returns>Promise resolving to paginated recommended product results.</returns>
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