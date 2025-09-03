'use strict';
const mongoose = require('mongoose');
const config = require('./env');

let isConnected = false;

/**
 * PUBLIC_INTERFACE
 * Initialize and return a shared Mongoose connection.
 * Handles reconnection and logs key connection lifecycle events.
 */
async function connectMongo() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  if (!config.mongo.url || !config.mongo.dbName) {
    console.error('[db] MongoDB configuration missing. Ensure MONGODB_URL and MONGODB_DB are set.');
    throw new Error('MongoDB configuration missing');
  }

  mongoose.connection.on('connected', () => {
    isConnected = true;
    console.log('[db] MongoDB connected');
  });

  mongoose.connection.on('error', (err) => {
    isConnected = false;
    console.error('[db] MongoDB connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    console.warn('[db] MongoDB disconnected');
  });

  await mongoose.connect(config.mongo.url, {
    dbName: config.mongo.dbName,
  });

  return mongoose.connection;
}

/**
 * PUBLIC_INTERFACE
 * Close mongoose connection gracefully.
 */
async function disconnectMongo() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    isConnected = false;
    console.log('[db] MongoDB connection closed');
  }
}

module.exports = {
  connectMongo,
  disconnectMongo,
};
