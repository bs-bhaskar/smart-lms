const { logError } = require('../utils/logger');

function errorHandler(err, req, res, next) {
  logError('unhandled_error', {
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
  });

  res.status(err.status || 500).json({
    message: err.message || 'Unexpected server error',
  });
}

module.exports = errorHandler;

