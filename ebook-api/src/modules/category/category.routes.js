/**
 * Category Routes
 * All Category APIs in one file
 */

const express = require('express');
const router = express.Router();

const controller = require('./category.controller');
const { uploadCategoryImage } = require('../../middlewares/upload.middleware');

const {
  validateBody,
  validateParams,
  validateQuery,
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
  getCategoryByIdSchema,
  getCategorysSchema
} = require('./category.validation');

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Category Management APIs
 */

/**
 * @swagger
 * /api/category:
 *   post:
 *     summary: Create Category
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - groupId
 *               - categoryname
 *             properties:
 *               groupId:
 *                 type: integer
 *                 default: 0
 *               categoryname:
 *                 type: string
 *               createdBy:
 *                 type: integer
 *               imagePath:
 *                 type: string
 *                 default: content/Category/1/1-general-books.png
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Category created successfully
 *       400:
 *         description: Validation failed
 */
router.post(
  '/',
  uploadCategoryImage,
  validateBody(createCategorySchema),
  controller.createCategory
);

/**
 * @swagger
 * /api/category:
 *   get:
 *     summary: Get All Categories
 *     tags: [Category]
 *     parameters:
 *       - in: query
 *         name: groupId
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Group ID
 *
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page Number
 *
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Records per page
 *
 *       - in: query
 *         name: findWhat
 *         schema:
 *           type: string
 *           default: ""
 *         description: Search keyword
 *
 *     responses:
 *       200:
 *         description: Category list retrieved successfully
 */
router.get(
  '/',
  validateQuery(getCategorysSchema),
  controller.getAllCategorys
);

/**
 * @swagger
 * /api/category/{id}:
 *   get:
 *     summary: Get Category By ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category details retrieved successfully
 *       404:
 *         description: Category not found
 */
router.get(
  '/:id',
  validateParams(getCategoryByIdSchema),
  controller.getCategoryById
);

/**
 * @swagger
 * /api/category/{id}:
 *   put:
 *     summary: Update Category
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               groupId:
 *                 type: integer
 *               categoryname:
 *                 type: string
 *               updatedBy:
 *                 type: integer
 *               imagePath:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Category not found
 */
router.put(
  '/:id',
  uploadCategoryImage,
  validateParams(getCategoryByIdSchema),
  validateBody(updateCategorySchema),
  controller.updateCategory
);

/**
 * @swagger
 * /api/category/{id}:
 *   delete:
 *     summary: Delete Category
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deletedBy
 *             properties:
 *               deletedBy:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Category not found
 */
router.delete(
  '/:id',
  validateParams(getCategoryByIdSchema),
  validateBody(deleteCategorySchema),
  controller.deleteCategory
);

module.exports = router;