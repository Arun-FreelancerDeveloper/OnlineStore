/**
 * Server Startup
 *
 * - Loads environment variables
 * - Connects to the database
 * - Starts the Express server
 */

require('dotenv-flow').config(); // Load .env variables for multiple environments
const app = require('./src/app');
const { connectDB } = require('./src/config/database');
const logger = require('./src/utils/logger'); // import logger

(async () => {
  // Connect to PostgreSQL database
  await connectDB();

  // Start Express server
  app.listen(process.env.PORT, () => {
    logger.info(`🚀 ${process.env.NODE_ENV} server running on ${process.env.PORT}`);
  });
})();
