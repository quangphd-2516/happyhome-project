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
// 🔥 CORS CONFIGURATION - CRITICAL
// ============================

// Allowed origins from environment or defaults
const allowedOrigins = [
  process.env.FRONTEND_URL, // From Render env vars
  'https://happyhome-project.vercel.app', // Production URL
  'http://localhost:3000', // Local development
  'http://localhost:5173', // Vite default port
].filter(Boolean); // Remove undefined values

console.log('🌐 Allowed CORS origins:', allowedOrigins);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) {
      return callback(null, true);
    }

    // Check if origin is allowed
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Allow Vercel preview deployments (*.vercel.app)
      if (origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        console.log('❌ CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('/(.*)', cors(corsOptions));

// ============================
// Socket.IO
// ============================
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

app.set('io', io);
initializeWebSocket(io);
initializeAuctionScheduler();

// ============================
// Middlewares
// ============================

// Logging
if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// Security headers (adjusted for CORS)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  })
);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Disable caching for API responses
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

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
    env: config.env,
  });
});

// 404 handler (ignore socket.io)
app.use((req, res, next) => {
  if (req.path.startsWith('/socket.io')) return next();
  next(new ApiError(StatusCodes.NOT_FOUND, 'Route not found'));
});

// Error handlers
app.use(errorConverter);
app.use(errorHandler);

module.exports = { app, server, io };