const { server, io } = require('./app'); // ✅ Import server thay vì app
const config = require('./config/config');
const logger = require('./config/logger');

let serverInstance;

const startServer = () => {
  serverInstance = server.listen(config.port, () => {
    logger.info(`🚀 Server is running on port ${config.port}`);
    logger.info(`📡 WebSocket server is ready`);
    logger.info(`⏰ Auction scheduler is active`);
    logger.info(`🌍 Environment: ${config.env}`);
  });
};

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

const unexpectedErrorHandler = (error) => {
  logger.error('Unexpected error:', error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (serverInstance) {
    serverInstance.close();
  }
});

startServer();