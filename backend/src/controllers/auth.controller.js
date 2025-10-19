const catchAsync = require('../utils/catchAsync');
const { StatusCodes } = require('http-status-codes');
const { authService, userService, tokenService } = require('../services');

console.log("✅ StatusCodes.CREATED:", StatusCodes.CREATED);

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  // Omit password from the user object before sending it back
  const { password, ...userWithoutPassword } = user;
  res.status(201).send({ user: userWithoutPassword, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  // Omit password from the user object
  const { password: _, ...userWithoutPassword } = user;
  res.send({ user: userWithoutPassword, tokens });
});

const logout = catchAsync(async (req, res) => {
  // Since we use stateless JWTs, logout is handled on the client.
  // We can just send a success status.
  res.status(204).send();
});
// ============ THÊM MỚI - CHỨC NĂNG OTP ============

/**
 * Đăng ký với OTP verification
 */
const registerWithOTP = catchAsync(async (req, res) => {
  const { fullName, email, password } = req.body;

  // Validate password format
  if (password.length < 8) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      success: false,
      message: 'Password must be at least 8 characters long'
    });
  }

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (!hasLetter || !hasNumber) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      success: false,
      message: 'Password must contain both letters and numbers'
    });
  }

  // Gọi service để tạo user + gửi OTP
  const result = await authService.registerWithOTP({
    fullName,
    email,
    password
  });

  res.status(StatusCodes.CREATED).send({
    success: true,
    message: 'Registration successful. Please check your email for OTP.',
    data: result
  });
});

/**
 * Verify OTP
 */
const verifyOTP = catchAsync(async (req, res) => {
  const { email, otp } = req.body;

  const result = await authService.verifyOTP(email, otp);

  res.status(StatusCodes.OK).send({
    success: true,
    message: 'Email verified successfully',
    data: result
  });
});

/**
 * Resend OTP
 */
const resendOTP = catchAsync(async (req, res) => {
  const { email } = req.body;

  await authService.resendOTP(email);

  res.status(StatusCodes.OK).send({
    success: true,
    message: 'OTP has been resent to your email'
  });
});

module.exports = {
  register,
  login,
  logout,
  registerWithOTP,
  verifyOTP,
  resendOTP,
};