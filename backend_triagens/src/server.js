const app = require('./app');
const { disconnectMongo } = require('./config/db');
const config = require('./config/env');

const PORT = config.port;
const HOST = config.host;

const server = app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});

// Graceful shutdown
async function shutdown(signal) {
  console.log(`${signal} signal received: closing HTTP server`);
  server.close(async () => {
    console.log('HTTP server closed');
    try {
      await disconnectMongo();
    } catch (e) {
      console.warn('Error closing Mongo connection:', e.message);
    }
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

module.exports = server;
