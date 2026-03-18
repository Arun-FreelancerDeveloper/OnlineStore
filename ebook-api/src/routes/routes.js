/**
 * Main Router
 * - Aggregates all module routes
 * - Prefixes endpoints for each module
 */


/* Import Module Routes Path */
const express = require('express');
const router = express.Router();
AuthRoutes = require('../modules/auth/auth.routes');
UserRoutes = require('../modules/user/user.routes');
CategoryGroupRoutes = require('../modules/categorygroup/categorygroup.routes');
CategoryRoutes = require('../modules/category/category.routes');

/* Use Module Routes */
router.use('/auth', AuthRoutes);
router.use('/user', UserRoutes);
router.use('/categorygroup', CategoryGroupRoutes);
router.use('/category', CategoryRoutes);
module.exports = router;
