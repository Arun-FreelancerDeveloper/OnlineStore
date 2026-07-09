const service = require('./category.service');
const ApiResponse = require('../../utils/apiResponse');

/**
 * <summary>
 * Create a new category record.
 * </summary>
 * <param name="req">Express request object with category payload and optional file upload.</param>
 * <param name="res">Express response object returning the created category.</param>
 * <param name="next">Express next middleware callback for error handling.</param>
 * <returns>JSON response containing the created category.</returns>
 */
exports.createCategory = async (req, res, next) => {
  try {
    console.log('Request body:', req.body);
    const groupId = parseInt(req.body.groupId ?? req.body.groupid ?? req.query.groupId ?? 0) || 0;
    const categoryName = req.body.categoryName ?? req.body.categoryname ?? '';
    const imagepath = req.body.imagepath || (req.file ? `uploads/category/${req.file.filename}` : '');
    const createdby = req.body.createdBy ?? req.body.createdby ?? 1;

    const data = await service.createCategory({
      groupId,
      categoryName,
      imagepath,
      createdby
    }, req.file);

    res.json(
      ApiResponse.success(data, 'Category created successfully.')
    );
  } catch (err) {
    next(err);
  }
};

/**
 * <summary>
 * Retrieve categories with pagination and optional search.
 * </summary>
 * <param name="req">Express request object containing groupId, page, pageSize, and findWhat query params.</param>
 * <param name="res">Express response object returning paginated category results.</param>
 * <param name="next">Express next middleware callback for error handling.</param>
 * <returns>JSON response with category list and paging metadata.</returns>
 */
exports.getAllCategorys = async (req, res, next) => {
  try {
    const groupid = parseInt(req.query.groupId) || 0;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const findWhat = req.query.findWhat || '';
    const data = await service.getAllCategorys(
      groupid,
      page,
      pageSize,
      findWhat
    );

    res.json(
      ApiResponse.success(data, 'Category fetched successfully.')
    );
  } catch (err) {
    next(err);
  }
};

/**
 * <summary>
 * Retrieve a category by its ID.
 * </summary>
 * <param name="req">Express request object containing category ID in params.</param>
 * <param name="res">Express response object returning category details.</param>
 * <param name="next">Express next middleware callback for error handling.</param>
 * <returns>JSON response with category details.</returns>
 */
exports.getCategoryById = async (req, res, next) => {
  try {
    const data = await service.getCategoryById(req.params.id);
    res.json(
      ApiResponse.success(
        data,
        'Category details retrieved successfully.'
      )
    );
  } catch (err) {
    next(err);
  }
};

/**
 * <summary>
 * Update an existing category record.
 * </summary>
 * <param name="req">Express request object containing category ID in params and update payload in body.</param>
 * <param name="res">Express response object returning the updated category.</param>
 * <param name="next">Express next middleware callback for error handling.</param>
 * <returns>JSON response with updated category data.</returns>
 */
exports.updateCategory = async (req, res, next) => {
  try {
    const payload = {
      categoryName: req.body.categoryname ?? req.body.categoryName ?? '',
      imagepath: req.body.imagepath || (req.file ? `uploads/category/${req.file.filename}` : ''),
      modifiedby: req.body.modifiedby ?? req.body.modifiedBy ?? 1
    };

    const data = await service.updateCategory(
      req.params.id,
      payload,
      req.file
    );

    res.json(
      ApiResponse.success(data, 'Category updated successfully.')
    );
  } catch (err) {
    next(err);
  }
};

/**
 * <summary>
 * Soft delete a category by marking it removed.
 * </summary>
 * <param name="req">Express request object containing category ID in params and deletedBy in body.</param>
 * <param name="res">Express response object returning success.</param>
 * <param name="next">Express next middleware callback for error handling.</param>
 * <returns>JSON response confirming deletion.</returns>
 */
exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { deletedBy } = req.body;

    if (!deletedBy) {
      return res
        .status(400)
        .json(ApiResponse.error('deletedBy is required'));
    }

    await service.deleteCategory(id, deletedBy);

    res.json(
      ApiResponse.success(null, 'Category removed successfully.')
    );
  } catch (err) {
    next(err);
  }
};