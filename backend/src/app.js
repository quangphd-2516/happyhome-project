// backend/src/app.js
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
const { initializeAuctionScheduler } = require('./services/auctionScheduler');

const app = express();

// ✅ Tạo HTTP server
const server = http.createServer(app);

// ✅ Tạo Socket.IO server
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

// ✅ Gắn io vào app để có thể dùng ở nơi khác
app.set('io', io);

// ✅ Khởi tạo WebSocket và Scheduler
initializeWebSocket(io);
initializeAuctionScheduler(); // ✅ nếu có cron job

// Logging
if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// CORS
app.use(
  cors({
    origin: process.env.front_url?.split(',') || [
      "http://localhost:3000",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Security headers
app.use(helmet());

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Compression
app.use(compression());

// Rate limiter cho auth
if (config.env === 'production') {
  app.use('/api/v1/auth', authLimiter);
}
app.use('/api', routes); // 👈 Thêm dòng này ngay sau /api/v1

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

// Catch 404 (trừ socket.io)
app.use((req, res, next) => {
  if (req.path.startsWith('/socket.io')) return next();
  next(new ApiError(StatusCodes.NOT_FOUND, 'Route not found'));
});

// Error handlers
app.use(errorConverter);
app.use(errorHandler);

// ✅ Export cả app, server và io
module.exports = { app, server, io };
