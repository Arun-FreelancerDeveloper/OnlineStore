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
CategoryGroupRoutes = require('../modules/categorygroup/categoryGroup.routes');
CategoryRoutes = require('../modules/category/category.routes');
ProductRoutes = require('../modules/products/product.routes');
InsightsFlashsaleRoutes = require('../modules/insights/flashsalestoday/flashsalestoday.routes');
InsightsFeaturedRoutes = require('../modules/insights/featured/featured.routes');
InsightsRecommendedRoutes = require('../modules/insights/recommended/recommended.routes');
CartRoutes = require('../modules/carts/cart.routes');
ShippingRoutes = require('../modules/shipping/shipping.routes');
OrderRoutes = require('../modules/orders/order.routes');

/* Use Module Routes */
router.use('/auth', AuthRoutes);
router.use('/user', UserRoutes);
router.use('/categorygroup', CategoryGroupRoutes);
router.use('/category', CategoryRoutes);
router.use('/products', ProductRoutes);
router.use('/insights/flashsale', InsightsFlashsaleRoutes);
router.use('/insights/recommended', InsightsRecommendedRoutes);
router.use('/product', ProductRoutes);
router.use('/cart', CartRoutes);
router.use('/shipping', ShippingRoutes);
router.use('/order', OrderRoutes);
module.exports = router;
