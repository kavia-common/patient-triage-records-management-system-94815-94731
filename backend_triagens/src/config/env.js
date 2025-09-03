'use strict';
/**
 * PUBLIC_INTERFACE
 * Load environment variables and provide configuration values.
 * Reads MongoDB connection details and JWT secret from process.env.
 *
 * Required env vars:
 * - MONGODB_URL: Mongo connection string (e.g., mongodb://user:pass@host:port)
 * - MONGODB_DB: Database name
 * - JWT_SECRET: Secret for signing JWT tokens (for auth scaffolding)
 * - PORT (optional): Server port, default 3000
 * - HOST (optional): Host, default 0.0.0.0
 */
require('dotenv').config();

const required = (name) => {
  const val = process.env[name];
  if (!val) {
    // We do not throw to allow app to start in CI; controllers will handle missing config gracefully.
    // But we log a clear warning so users know to set env vars.
    console.warn(`[env] Missing environment variable: ${name}`);
  }
  return val;
};

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST || '0.0.0.0',
  mongo: {
    url: required('MONGODB_URL'),
    dbName: required('MONGODB_DB'),
  },
  auth: {
    jwtSecret: required('JWT_SECRET') || 'change-me-in-production',
    tokenExpiry: process.env.JWT_EXPIRES_IN || '1h',
  },
};
