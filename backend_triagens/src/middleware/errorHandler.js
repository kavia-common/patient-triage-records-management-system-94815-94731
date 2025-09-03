'use strict';

/**
 * PUBLIC_INTERFACE
 * Express error handling middleware. Normalizes known errors to JSON responses.
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  // Mongoose validation or cast errors
  if (err && err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: Object.values(err.errors).map(e => ({ field: e.path, message: e.message })),
    });
  }
  if (err && err.name === 'CastError') {
    return res.status(400).json({
      status: 'error',
      message: `Invalid identifier for ${err.path}`,
    });
  }

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  if (status >= 500) {
    console.error('[error]', err);
  }

  return res.status(status).json({ status: 'error', message });
}

module.exports = errorHandler;
