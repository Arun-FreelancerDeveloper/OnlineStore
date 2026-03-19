/**
 * Product Routes
 * All Product APIs in one file
 */

const express = require('express');
const router = express.Router();
const controller = require('./product.controller');

const { uploadProductImages } = require('../../middlewares/upload.middleware');

const {
  validateBody,
  validateParams,
  validateQuery,
  createProductSchema,
  updateProductSchema,
  getProductsSchema,
  deleteProductSchema
} = require('./product.validation');

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product Management APIs
 */

/**
 * @swagger
 * /api/product:
 *   post:
 *     summary: Create product
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - productname
 *               - categoryid
 *             properties:
 *               productcode:
 *                 type: string
 *               productname:
 *                 type: string
 *               shortdescription:
 *                 type: string
 *               categoryid:
 *                 type: integer
 *               subcategoryid:
 *                 type: integer
 *               deptid:
 *                 type: integer
 *               storeid:
 *                 type: integer
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post(
  '/',
  uploadProductImages,
  validateBody(createProductSchema),
  controller.createProduct
);

/**
 * @swagger
 * /api/product:
 *   get:
 *     summary: Get all products
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *           default: 0
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: findWhat
 *         schema:
 *           type: string
 *           default: ''
 *     responses:
 *       200:
 *         description: Product list retrieved successfully
 *       404:
 *         description: No products found
 *       500:
 *         description: Internal server error
 */
router.get(
  '/',
  validateQuery(getProductsSchema),
  controller.getAllProducts
);

/**
 * @swagger
 * /api/product/{productId}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.get(
  '/:productId',
  controller.getProductById
);

/**
 * @swagger
 * /api/product/{productId}:
 *   put:
 *     summary: Update product
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               productname:
 *                 type: string
 *               shortdescription:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.put(
  '/:productId',
  uploadProductImages,
  validateBody(updateProductSchema),
  controller.updateProduct
);

/**
 * @swagger
 * /api/product/{productId}:
 *   delete:
 *     summary: Delete product
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: productId
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
 *         description: Product deleted successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  '/:productId',
  validateBody(deleteProductSchema),
  controller.deleteProduct
);

module.exports = router;