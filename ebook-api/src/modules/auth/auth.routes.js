const router = require('express').Router();
const authController = require('./auth.controller');
const { validateLogin } = require('./auth.validation');

/**
 * @swagger
 *  /api/auth:
 *   post:
 *     summary: Login user
 *     tags: [Auth]   
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/', validateLogin, authController.login);

/**
 * @swagger
 * /api/auth/changepassword:
 *   post:
 *     summary: Change user password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newpassword
 *             properties:
 *               token:
 *                 type: string
 *                 example: ddddddddqewqewewdffsdfgdgdhgfhgf
 *               newpassword:
 *                 type: string
 *                 example: new123456
 *     responses:
 *       200:
 *         description: Password changed successfully
 */
router.post('/changepassword', authController.changePassword);


/**
 * @swagger
 * /api/auth/forgotPassword:
 *   post:
 *     summary: forgot password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - callbackurl
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               callbackurl:
 *                 type: string
 *                 example: link
 *     responses:
 *       200:
 *         description: Reset link send successfully
 */
router.post('/forgotPassword', authController.forgotPassword);
module.exports = router;