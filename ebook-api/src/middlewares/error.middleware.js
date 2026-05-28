/**
 * Global Error Handler Middleware
 *
 * - Catches errors passed using next(err)
 * - Logs error details to the console
 * - Sends a standard JSON error response
 */

const logger = require('../utils/logger');
exports.errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;

  // Log error with contextual details
  logger.error('❌ An error occurred', {
    message: err.message,
    status,
    stack: err.stack
  });

  // Prepare safe payload
  const payload = {
    success: false,
    message: err.message || 'INTERNAL_SERVER_ERROR'
  };

  // Include stack trace only in non-production for debugging
  if ((process.env.NODE_ENV || 'development') !== 'production') {
    payload.stack = err.stack;
  }

  res.status(status).json(payload);
};
