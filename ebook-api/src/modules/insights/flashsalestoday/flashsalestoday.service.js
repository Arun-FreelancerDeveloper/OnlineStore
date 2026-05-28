const repo = require('./flashsalestoday.repository');

/**
 * <summary>
 * Retrieve flash sale products via the repository layer.
 * </summary>
 * <param name="page">Page number.</param>
 * <param name="pageSize">Number of records per page.</param>
 * <returns>Promise resolving to paginated flash sale product results.</returns>
 */
exports.getFlashSaleProducts = async (
  page = 1,
  pageSize = 10
) => {
  return await repo.getFlashSaleProducts(
    page,
    pageSize
  );
};