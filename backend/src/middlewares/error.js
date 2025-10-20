const { Prisma } = require('@prisma/client');
const { StatusCodes } = require('http-status-codes');
const config = require('../config/config');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    let message = error.message || StatusCodes[statusCode];

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Xử lý các lỗi phổ biến của Prisma
      switch (error.code) {
        case 'P2002':
          statusCode = StatusCodes.BAD_REQUEST;
          message = `Duplicate field value: ${error.meta.target.join(', ')}`;
          break;
        case 'P2025':
          statusCode = StatusCodes.NOT_FOUND;
          message = 'Record to update/delete was not found';
          break;
        default:
          // Mặc định là lỗi server nếu không nhận diện được
          statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
          message = 'An unexpected database error occurred';
          break;
      }
    }

    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  // Nếu statusCode không tồn tại, mặc định là 500 (Internal Server Error)
  if (!statusCode) {
    statusCode = 500;
  }

  if (config.env === 'production' && !err.isOperational) {
    statusCode = 500;
    message = 'Internal Server Error';
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack }),
  };

  if (config.env === 'development') {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};

module.exports = {
  errorConverter,
  errorHandler,
};