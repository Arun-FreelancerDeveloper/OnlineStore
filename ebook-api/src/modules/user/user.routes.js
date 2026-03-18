const router = require('express').Router();
const controller = require('./user.controller');
const { validateBody, validateQuery, validateParams, createUserSchema, getUsersSchema, updateUserSchema, deleteUserSchema } = require('./user.validation');


/**
 * User Routes
 *
 * - Defines all API endpoints related to User
 * - Maps each endpoint to corresponding controller function
 * - Supports CRUD operations
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: 
 */

/**
 * @swagger
 * /api/user:
 *   post:
 *     summary: Create a new user
 *     description: Add a new user to the system
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullname
 *               - email
 *               - passwordhash
 *               - userType
 *               - vendorNumber
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               passwordhash:
 *                 type: string
 *                 example: 123456
 *               userType:
 *                 type: string
 *                 example: Customer
 *               vendorNumber:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 userid: 1
 *                 fullname: John Doe
 *                 email: john@example.com
 *               message: Your account has been created successfully.
 */
router.post('/', validateBody(createUserSchema), controller.createUser);

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get paginated users with search
 *     description: Retrieve active users with optional search and pagination
 *     tags: [Users]
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
 *         description: Number of users per page
 *       - in: query
 *         name: findWhat
 *         schema:
 *           type: string
 *         description: Optional search term for fullname or email
 *     responses:
 *       200:
 *         description: Paginated list of users
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 currentPage: 1
 *                 pageSize: 10
 *                 totalPages: 3
 *                 totalRecords: 25
 *                 users:
 *                   - userid: 1
 *                     fullname: John Doe
 *                     email: john@example.com
 *                     userType: Admin
 *                   - userid: 2
 *                     fullname: Jane Smith
 *                     email: jane@example.com
 *                     userType: User
 *               message: User list fetched successfully.
 */
router.get('/', validateQuery(getUsersSchema), controller.getUsers);

/**
 * @swagger
 * /api/user/{id}:
 *   put:
 *     summary: Update user by ID
 *     description: Update user's fullname and email
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: John Smith
 *               email:
 *                 type: string
 *                 example: johnsmith@example.com
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 userid: 1
 *                 fullname: John Smith
 *                 email: johnsmith@example.com
 *               message: Your account details have been updated successfully.
 */
router.put('/:id', validateBody(updateUserSchema), controller.updateUser);

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     description: Soft delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data: null
 *               message: Your account has been removed successfully.
 */
router.delete('/:id', validateParams(deleteUserSchema), controller.deleteUser);
module.exports = router;


