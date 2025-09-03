'use strict';
const jwt = require('jsonwebtoken');
const config = require('../config/env');

/**
 * PUBLIC_INTERFACE
 * Authentication middleware. If enforce=true, requires a valid Bearer token.
 * If enforce=false (default), it parses token if present, otherwise continues.
 */
function auth(enforce = false) {
  return (req, res, next) => {
    const header = req.headers['authorization'] || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      if (enforce) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized: token missing' });
      }
      return next();
    }
    try {
      const payload = jwt.verify(token, config.auth.jwtSecret);
      req.user = { id: payload.sub, roles: payload.roles || [] };
      return next();
    } catch (err) {
      if (enforce) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized: invalid token' });
      }
      return next();
    }
  };
}

module.exports = auth;
