const repo = require('./category.repository');

/**
 * <summary>
 * Create a new category record.
 * </summary>
 * <param name="data">Category payload containing groupId, categoryName, imagepath, and createdby.</param>
 * <returns>Promise resolving to the inserted category record.</returns>
 */
exports.createCategory = async (data) =>
  await repo.createCategory(data);

/**
 * <summary>
 * Retrieve categories for a specific group with pagination and optional search.
 * </summary>
 * <param name="groupid">Group identifier to filter categories.</param>
 * <param name="page">Current page number.</param>
 * <param name="pageSize">Items per page.</param>
 * <param name="findWhat">Optional search term for category name.</param>
 * <returns>Promise resolving to a paginated category result object.</returns>
 */
exports.getAllCategorys = async (groupid, page = 1, pageSize = 10, findWhat = '') => {
  const result = await repo.getAllCategorys(groupid, page, pageSize, findWhat);
  return result;
};

/**
 * <summary>
 * Retrieve details for a category by its ID.
 * </summary>
 * <param name="categoryid">Category identifier.</param>
 * <returns>Promise resolving to the category record or null if not found.</returns>
 */
exports.getCategoryById = async (categoryid) =>
  await repo.getCategoryById(categoryid);

/**
 * <summary>
 * Update an existing category record.
 * </summary>
 * <param name="categoryid">Category identifier.</param>
 * <param name="data">Update details including categoryName, imagepath, and modifiedby.</param>
 * <returns>Promise resolving to the updated category record.</returns>
 */
exports.updateCategory = async (categoryid, data) =>
  await repo.updateCategory(categoryid, data);

/**
 * <summary>
 * Soft delete a category record.
 * </summary>
 * <param name="categoryid">Category identifier.</param>
 * <param name="deletedBy">User ID performing the deletion.</param>
 * <returns>Promise resolving once the category is marked deleted.</returns>
 */
exports.deleteCategory = async (categoryid, deletedBy) =>
  await repo.deleteCategory(categoryid, deletedBy);