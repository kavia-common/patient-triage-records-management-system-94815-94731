'use strict';
const { validationResult } = require('express-validator');

/**
 * PUBLIC_INTERFACE
 * Validate request against declared rules. Sends 400 with error details if invalid.
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  return res.status(400).json({
    status: 'error',
    message: 'Validation failed',
    errors: errors.array().map(e => ({ field: e.param, message: e.msg })),
  });
}

module.exports = validate;
