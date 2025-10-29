const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcryptjs');
const userService = require('./user.service');
const tokenService = require('./token.service');
const ApiError = require('../utils/ApiError');
const prisma = require('../client');
const emailService = require('../services/email.service');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (user.isBlocked) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Your account has been blocked. Please contact support.');
  }
  console.log("🧩 [DEBUG] User from DB:", user);
  // Check if user exists and if password is correct
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Incorrect email or password');
  }

  return user;
};

/**
 * Logout
 * We don't need to do anything here for stateless JWTs,
 * but the function is kept for structural consistency.
 * In the future, we could add token blocklisting here.
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  // For stateless JWTs, logout is handled on the client side by deleting the tokens.
  // No server-side logic is needed for this basic setup.
  return;
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    // Since we are not storing refresh tokens in the DB,
    // we just need to verify the token is valid.
    // The `auth` middleware already does this, but for a dedicated refresh endpoint,
    // you would add JWT verification logic here.
    // For now, we'll assume the token is valid if it reaches this service.

    // This is a simplified version. A production app would re-verify the JWT here.
    const { sub: userId } = jwt.verify(refreshToken, config.jwt.secret);
    const user = await userService.getUserById(userId);

    if (!user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'User not found');
    }

    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Please authenticate');
  }
};
/**
 * Đăng ký user mới với OTP
 * @param {Object} userData - { fullName, email, password }
 * @returns {Promise<Object>}
 */
const registerWithOTP = async (userData) => {
  const { fullName, email, password } = userData;

  // Kiểm tra email đã tồn tại chưa
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already registered');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate OTP (6 chữ số)
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 phút

  // Tạo user mới (chưa verify)
  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      password: hashedPassword,
      isVerified: false,
      otp,
      otpExpiry
    }
  });

  // Gửi OTP qua email
  try {
    await emailService.sendOTPEmail(email, otp, fullName);
  } catch (emailError) {
    console.error('Failed to send OTP email:', emailError);
    // Không throw error, vì user đã được tạo
  }

  return {
    userId: user.id,
    email: user.email
  };
};

/**
 * Verify OTP
 * @param {string} email
 * @param {string} otp
 * @returns {Promise<Object>}
 */
const verifyOTP = async (email, otp) => {
  // Tìm user
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  // Kiểm tra đã verify chưa
  if (user.isVerified) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Account already verified');
  }

  // Kiểm tra OTP hết hạn
  if (user.otpExpiry && new Date() > user.otpExpiry) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'OTP has expired. Please request a new one.');
  }

  // Kiểm tra OTP đúng không
  if (user.otp !== otp) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid OTP code');
  }

  // Update user: set verified = true
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      otp: null,
      otpExpiry: null
    }
  });

  // Tạo token
  const tokens = await tokenService.generateAuthTokens(updatedUser);

  // Omit password
  const { password, ...userWithoutPassword } = updatedUser;

  return {
    user: userWithoutPassword,
    tokens
  };
};

/**
 * Resend OTP
 * @param {string} email
 * @returns {Promise<void>}
 */
const resendOTP = async (email) => {
  // Tìm user
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  // Kiểm tra đã verify chưa
  if (user.isVerified) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Account already verified');
  }

  // Generate OTP mới
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  // Update OTP
  await prisma.user.update({
    where: { id: user.id },
    data: {
      otp,
      otpExpiry
    }
  });

  // Gửi email
  await emailService.sendOTPEmail(email, otp, user.fullName);
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  registerWithOTP,
  verifyOTP,
  resendOTP,
};