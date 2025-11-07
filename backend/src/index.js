// backend/src/index.js
const { server } = require('./app'); // ✅ Import server thay vì app
const config = require('./config/config');
const logger = require('./config/logger');

let serverInstance;

// ✅ Start server
const startServer = () => {
  serverInstance = server.listen(config.port, () => {
    logger.info(`🚀 Server running on port ${config.port}`);
    logger.info(`📡 WebSocket ready (Chat + Auction)`);
    logger.info(`⏰ Auction scheduler active`);
    logger.info(`🌍 Environment: ${config.env}`);
  });
};

// ✅ Graceful shutdown
const exitHandler = () => {
  if (serverInstance) {
    serverInstance.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

// ✅ Error handling
const unexpectedErrorHandler = (error) => {
  logger.error('Unexpected error:', error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  if (serverInstance) {
    serverInstance.close();
  }
});

// ✅ Run server
startServer();
