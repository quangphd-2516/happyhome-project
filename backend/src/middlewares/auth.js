const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');
const prisma = require('../client'); // Import prisma client của chúng ta

/**
 * Middleware to authenticate and authorize a user.
 * @param {...string} requiredRights - The required rights (e.g., 'admin').
 * @returns {function(...*): *}
 */
const auth = (...requiredRights) => async (req, res, next) => {
  try {
    // 1. Lấy token từ header "Authorization: Bearer <token>"
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Please authenticate'));
    }

    // 2. Xác thực token bằng JWT_SECRET
    const payload = jwt.verify(token, config.jwt.secret);

    // 3. Tìm người dùng trong database bằng ID từ token
    const user = await prisma.user.findUnique({
      where: { id: payload.sub }, // 'sub' là ID của user trong JWT payload
    });

    if (!user) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, 'User not found'));
    }

    // 4. Gán thông tin user vào request để các hàm sau có thể dùng
    req.user = user;

    // 5. Kiểm tra quyền (role) nếu có yêu cầu
    if (requiredRights.length) {
      const userRights = [user.role]; // Lấy role từ user trong database
      const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
      if (!hasRequiredRights) {
        return next(new ApiError(StatusCodes.FORBIDDEN, 'Forbidden'));
      }
    }

    next();
  } catch (error) {
    // Xử lý các lỗi khác như token hết hạn hoặc không hợp lệ
    return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Please authenticate'));
  }
};

module.exports = auth;