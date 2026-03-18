const service = require('./category.service');
const ApiResponse = require('../../utils/apiResponse');

// ================= CREATE =================
exports.createCategory = async (req, res, next) => {
  try {
    const data = await service.createCategory(req.body, req.file);
    res.json(
      ApiResponse.success(data, 'Category created successfully.')
    );
  } catch (err) {
    next(err);
  }
};

// ================= GET ALL =================
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

// ================= GET BY ID =================
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

// ================= UPDATE =================
exports.updateCategory = async (req, res, next) => {
  try {
    const data = await service.updateCategory(
      req.params.id,
      req.body,
      req.file
    );

    res.json(
      ApiResponse.success(data, 'Category updated successfully.')
    );
  } catch (err) {
    next(err);
  }
};

// ================= DELETE =================
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