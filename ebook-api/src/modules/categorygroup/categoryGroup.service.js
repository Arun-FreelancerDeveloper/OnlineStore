const repo = require('./categoryGroup.repository');

/**
 * <summary>
 * Create a new category group.
 * </summary>
 * <param name="data">Payload containing groupname, imagepath, and createdby.</param>
 * <returns>Promise resolving to the created category group.</returns>
 */
exports.createCategoryGroup = async (data) =>
  await repo.createCategoryGroup(data);

/**
 * <summary>
 * Retrieve category groups with pagination and optional search.
 * </summary>
 * <param name="page">Current page number.</param>
 * <param name="pageSize">Number of groups per page.</param>
 * <param name="findWhat">Optional group name filter.</param>
 * <returns>Promise resolving to a paginated category group list.</returns>
 */
exports.getAllCategoryGroups = async (page = 1, pageSize = 10, findWhat = '') => {
  const result = await repo.getAllCategoryGroups(page, pageSize, findWhat);
  return result;
};

/**
 * <summary>
 * Retrieve a category group by its identifier.
 * </summary>
 * <param name="groupId">Group identifier.</param>
 * <returns>Promise resolving to the category group or null.</returns>
 */
exports.getCategoryGroupById = async (groupId) =>
  await repo.getCategoryGroupById(groupId);

/**
 * <summary>
 * Update an existing category group.
 * </summary>
 * <param name="groupId">Group identifier.</param>
 * <param name="data">Payload containing updated groupname, imagepath, and modifiedby.</param>
 * <returns>Promise resolving to the updated category group.</returns>
 */
exports.updateCategoryGroup = async (groupId, data) =>
  await repo.updateCategoryGroup(groupId, data);

/**
 * <summary>
 * Soft delete a category group.
 * </summary>
 * <param name="groupId">Group identifier.</param>
 * <param name="deletedBy">User ID performing the deletion.</param>
 * <returns>Promise resolving once deletion is complete.</returns>
 */
exports.deleteCategoryGroup = async (groupId, deletedBy) =>
  await repo.deleteCategoryGroup(groupId, deletedBy);