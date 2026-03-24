/**
 * Featured Routes
 *
 * - Provides featured products
 * - If orders exist today → returns ordered products
 * - If no orders today → returns top 5 products per category
 * - Swagger enabled
 */

const router = require('express').Router();
const controller = require('./featured.controller');

/**
 * @swagger
 * /api/insights/featured:
 *   get:
 *     summary: Get Featured Products
 *     description: >
 *       Returns featured products with pagination.
 *       If orders exist today, top selling products are returned.
 *       Otherwise, active products are returned sorted by name.
 *     tags:
 *       - Insights
 *     parameters:
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
 *     responses:
 *       200:
 *         description: Featured product list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Featured products fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     pageSize:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                     totalRecords:
 *                       type: integer
 *                       example: 50
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productid:
 *                             type: integer
 *                           productname:
 *                             type: string
 *                           productcode:
 *                             type: string
 *                           productimage:
 *                             type: string
 *                           groupid:
 *                             type: integer
 *                           groupname:
 *                             type: string
 *                           categoryid:
 *                             type: integer
 *                           categoryname:
 *                             type: string
 *                           subcategoryid:
 *                             type: integer
 *                           subcategoryname:
 *                             type: string
 *                           deptid:
 *                             type: integer
 *                           deptname:
 *                             type: string
 *                           storeid:
 *                             type: integer
 *                           storename:
 *                             type: string
 *                           mrp:
 *                             type: number
 *                           wholesaleprice:
 *                             type: number
 *                           total_sold:
 *                             type: integer
 *       500:
 *         description: Server error
 */
router.get('/', controller.getFeaturedProducts);
module.exports = router;