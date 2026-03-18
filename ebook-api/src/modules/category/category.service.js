const repo = require('./category.repository');

/**
 * Create a new Category Group
 *
 * - Calls repository to insert a new category group
 * - @param {Object} data - { groupname, imagepath, createdBy }
 * @returns {Promise<Object>} The created category group record
 */
exports.createCategory = async (data) =>
  await repo.createCategory(data);

/**
 * Get all Category Groups with pagination and optional search
 *
 * - Calls repository to fetch active category groups
 * - Supports pagination and search by group name
 * - @param {number} groupid - The ID of the category group to fetch
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
exports.getAllCategorys = async (groupid, page = 1, pageSize = 10, findWhat = '') => {
  const result = await repo.getAllCategorys(groupid, page, pageSize, findWhat);
  return result;
};

/**
 * Get Category Group by ID
 *
 * - Fetches a single category group by categoryid
 * - @param {number} categoryid
 * @returns {Promise<Object|null>} Category group record or null if not found
 */
exports.getCategoryById = async (categoryid) =>
  await repo.getCategoryById(categoryid);

/**
 * Update a Category Group
 *
 * - Calls repository to update group details
 * - @param {number} categoryid
 * - @param {Object} data - { groupname, imagepath, modifiedBy }
 * @returns {Promise<Object>} Updated category group record
 */
exports.updateCategory = async (categoryid, data) =>
  await repo.updateCategory(categoryid, data);

/**
 * Delete a Category Group (Soft Delete)
 *
 * - Marks the category group as deleted
 * - @param {number} categoryid
 * - @param {number} deletedBy - User ID performing the deletion
 * @returns {Promise<void>}
 */
exports.deleteCategory = async (categoryid, deletedBy) =>
  await repo.deleteCategory(categoryid, deletedBy);