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
    origin: process.env.FRONTEND_URL?.split(',') || [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://happyhome-project.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

app.set('io', io);

// ✅ Khởi tạo WebSocket và Scheduler
initializeWebSocket(io);
initializeAuctionScheduler();

// Logging
if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// ✅ CORS phải để trước route
const allowedOrigins = process.env.FRONTEND_URL?.split(',') || [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://happyhome-project.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser requests
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

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

// ✅ Mount API routes 1 lần duy nhất
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Catch 404 (trừ socket.io)
app.use((req, res, next) => {
  if (req.path.startsWith('/socket.io')) return next();
  next(new ApiError(StatusCodes.NOT_FOUND, 'Route not found'));
});

// Error handlers
app.use(errorConverter);
app.use(errorHandler);

module.exports = { app, server, io };
