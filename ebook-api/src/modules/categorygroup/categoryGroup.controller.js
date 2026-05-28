const service = require('./categoryGroup.service');
const ApiResponse = require('../../utils/apiResponse');

/**
 * <summary>
 * Create a new category group.
 * </summary>
 * <param name="req">Express request object containing category group payload.</param>
 * <param name="res">Express response object returning the created group.</param>
 * <param name="next">Express next middleware callback for error handling.</param>
 * <returns>JSON response with the created category group.</returns>
 */
exports.createCategoryGroup = async (req, res, next) => {
  try {
    const data = await service.createCategoryGroup(req.body);
    res.json(
      ApiResponse.success(data, 'Category group created successfully.')
    );
  } catch (err) {
    next(err);
  }
};

/**
 * <summary>
 * Retrieve paginated category groups with optional search.
 * </summary>
 * <param name="req">Express request object containing page, pageSize, and findWhat query params.</param>
 * <param name="res">Express response object returning paginated groups.</param>
 * <param name="next">Express next middleware callback for error handling.</param>
 * <returns>JSON response with category group list.</returns>
 */
exports.getAllCategoryGroups = async (req, res, next) => {
 try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const findWhat = req.query.findWhat || '';
    const data = await service.getAllCategoryGroups(page, pageSize, findWhat);
    res.json(ApiResponse.success(data, 'Category Groups fetched successfully.'));
  } catch (err) {
    next(err);
  }
};

/**
 * <summary>
 * Retrieve a category group by ID.
 * </summary>
 * <param name="req">Express request object containing group ID in params.</param>
 * <param name="res">Express response object returning the group details.</param>
 * <param name="next">Express next middleware callback for error handling.</param>
 * <returns>JSON response with category group details.</returns>
 */
exports.getCategoryGroupById = async (req, res, next) => {
  try {
    const data = await service.getCategoryGroupById(req.params.id);
    res.json(
      ApiResponse.success(data, 'Category group details retrieved successfully.')
    );
  } catch (err) {
    next(err);
  }
};

/**
 * <summary>
 * Update an existing category group.
 * </summary>
 * <param name="req">Express request object containing group ID in params and update payload in body.</param>
 * <param name="res">Express response object returning the updated group.</param>
 * <param name="next">Express next middleware callback for error handling.</param>
 * <returns>JSON response with updated category group.</returns>
 */
exports.updateCategoryGroup = async (req, res, next) => {
  try {
    const data = await service.updateCategoryGroup(
      req.params.id,
      req.body
    );
    res.json(
      ApiResponse.success(data, 'Category group updated successfully.')
    );
  } catch (err) {
    next(err);
  }
};

/**
 * <summary>
 * Soft delete a category group by ID.
 * </summary>
 * <param name="req">Express request object containing group ID in params and deletedBy in body.</param>
 * <param name="res">Express response object returning success.</param>
 * <param name="next">Express next middleware callback for error handling.</param>
 * <returns>JSON response confirming deletion.</returns>
 */
exports.deleteCategoryGroup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { deletedBy } = req.body;

    // ✅ Validation
    if (!deletedBy) {
      return res.status(400).json(
        ApiResponse.error('deletedBy is required')
      );
    }

    await service.deleteCategoryGroup(id, deletedBy);

    res.json(
      ApiResponse.success(null, 'Category group removed successfully.')
    );
  } catch (err) {
    next(err);
  }
};
