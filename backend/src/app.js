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
const server = http.createServer(app);

// ============================
// 🔥 FIX CORS PRINT — Render bắt buộc
// ============================

const allowedOrigins = process.env.FRONTEND_URL?.split(',') || [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://happyhome-project.vercel.app",
  "https://happyhome-project-7hk4p7lqc-quangnt22810310333-6281s-projects.vercel.app"
];

// ⚠️ CORS MUST be placed BEFORE all middlewares
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.warn("❌ Blocked by CORS:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// ⚠️ FIX QUAN TRỌNG CHO OPTIONS PRE-FLIGHT
app.options("*", cors());

// ============================
// Socket.IO
// ============================
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

app.set('io', io);
initializeWebSocket(io);
initializeAuctionScheduler();

// Logging
if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// Security
app.use(helmet());

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Rate limit (auth)
if (config.env === 'production') {
  app.use('/api/v1/auth', authLimiter);
}

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler (ignore socket)
app.use((req, res, next) => {
  if (req.path.startsWith('/socket.io')) return next();
  next(new ApiError(StatusCodes.NOT_FOUND, 'Route not found'));
});

// Error handlers
app.use(errorConverter);
app.use(errorHandler);

module.exports = { app, server, io };
