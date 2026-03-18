const repo = require('./categoryGroup.repository');

/**
 * Create a new Category Group
 *
 * - Calls repository to insert a new category group
 * - @param {Object} data - { groupname, imagepath, createdBy }
 * @returns {Promise<Object>} The created category group record
 */
exports.createCategoryGroup = async (data) =>
  await repo.createCategoryGroup(data);

/**
 * Get all Category Groups with pagination and optional search
 *
 * - Calls repository to fetch active category groups
 * - Supports pagination and search by group name
 * - @param {number} page - Current page number (default 1)
 * - @param {number} pageSize - Number of records per page (default 10)
 * - @param {string} [findWhat] - Optional search term for groupname
 * @returns {Promise<Object>} Paginated result:
 * {
 *   currentPage: number,
 *   pageSize: number,
 *   totalPages: number,
 *   totalRecords: number,
 *   data: Array of category groups
 * }
 */
exports.getAllCategoryGroups = async (page = 1, pageSize = 10, findWhat = '') => {
  const result = await repo.getAllCategoryGroups(page, pageSize, findWhat);
  return result;
};

/**
 * Get Category Group by ID
 *
 * - Fetches a single category group by groupId
 * - @param {number} groupId
 * @returns {Promise<Object|null>} Category group record or null if not found
 */
exports.getCategoryGroupById = async (groupId) =>
  await repo.getCategoryGroupById(groupId);

/**
 * Update a Category Group
 *
 * - Calls repository to update group details
 * - @param {number} groupId
 * - @param {Object} data - { groupname, imagepath, modifiedBy }
 * @returns {Promise<Object>} Updated category group record
 */
exports.updateCategoryGroup = async (groupId, data) =>
  await repo.updateCategoryGroup(groupId, data);

/**
 * Delete a Category Group (Soft Delete)
 *
 * - Marks the category group as deleted
 * - @param {number} groupId
 * - @param {number} deletedBy - User ID performing the deletion
 * @returns {Promise<void>}
 */
exports.deleteCategoryGroup = async (groupId, deletedBy) =>
  await repo.deleteCategoryGroup(groupId, deletedBy);