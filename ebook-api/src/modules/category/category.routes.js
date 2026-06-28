/**
 * Category Routes
 * All Category APIs in one file
 */

const express = require('express');
const router = express.Router();
const controller = require('./category.controller'); // or category.controller
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
 *   description: 
 */

/**
 * @swagger
 * /api/category:
 *   post:
 *     summary: Create category
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - categoryname
 *             properties:
 *               categoryname:
 *                 type: string
 *               createdby:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Category created successfully
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
 *     summary: Get all categories
 *     tags: [Category]
 *     parameters:
 *       - in: query
 *         name: groupId
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Filter categories by group ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of records per page
 *       - in: query
 *         name: findWhat
 *         schema:
 *           type: string
 *           default: ''
 *         description: Search keyword
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
 *     summary: Get category by ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Category details
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
 *     summary: Update category
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               categoryname:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Category updated successfully
 */
router.put(
  '/:id',
  uploadCategoryImage,
  validateBody(updateCategorySchema),
  controller.updateCategory
);

/**
 * @swagger
 * /api/category/{id}:
 *   delete:
 *     summary: Delete category
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 */
router.delete(
  '/:id',
  validateBody(deleteCategorySchema),
  controller.deleteCategory
);

module.exports = router;