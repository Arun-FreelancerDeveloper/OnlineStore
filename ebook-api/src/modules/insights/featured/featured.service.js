const repo = require('./featured.repository');

/**
 * <summary>
 * Retrieve featured products via the repository layer.
 * </summary>
 * <param name="page">Page number.</param>
 * <param name="pageSize">Number of records per page.</param>
 * <returns>Promise resolving to paginated featured product results.</returns>
 */
exports.getFeaturedProducts = async (
  page = 1,
  pageSize = 10
) => {
  return await repo.getFeaturedProducts(
    page,
    pageSize
  );
};