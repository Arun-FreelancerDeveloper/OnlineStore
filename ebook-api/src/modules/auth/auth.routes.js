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
 *               password:
 *                 type: string
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
 *               - userId
 *               - newPassword
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 1
 *               newPassword:
 *                 type: string
 *                 example: new123456
 *     responses:
 *       200:
 *         description: Password changed successfully
 */
router.post('/changepassword', authController.changePassword);
module.exports = router;