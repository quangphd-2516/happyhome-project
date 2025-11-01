const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { StatusCodes } = require('http-status-codes');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const { initializeWebSocket } = require('./services/websocket.service');
//const { initializeAuctionScheduler } = require('./utils/auctionScheduler');

const app = express();

// ✅ TẠO HTTP SERVER
const server = http.createServer(app);

// ✅ TẠO SOCKET.IO SERVER
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

// ✅ LƯU io VÀO app
app.set('io', io);

// ✅ KHỞI TẠO WEBSOCKET VÀ SCHEDULER
initializeWebSocket(io);
//initializeAuctionScheduler(io);

// Logging
if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// CORS
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Security headers
app.use(helmet());

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Compression
app.use(compression());

// Rate limiter for auth
if (config.env === 'production') {
  app.use('/api/v1/auth', authLimiter);
}

// Health check
app.get('/health', (req, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/v1', routes);
app.use('/api', routes);
// Catch 404 - EXCLUDE socket.io paths
app.use((req, res, next) => {
  if (req.path.startsWith('/socket.io')) {
    return next();
  }

  next(new ApiError(StatusCodes.NOT_FOUND, 'Route not found'));
});

// Error handlers
app.use(errorConverter);
app.use(errorHandler);

// ✅ EXPORT CẢ app, server VÀ io
module.exports = { app, server, io };