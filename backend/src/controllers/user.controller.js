// backend/src/controllers/user.controller.js
const { StatusCodes } = require('http-status-codes');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  // Omit password from response
  const { password, ...userWithoutPassword } = user;
  res.status(StatusCodes.CREATED).send(userWithoutPassword);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }
  // Omit password from response
  const { password, ...userWithoutPassword } = user;
  res.send(userWithoutPassword);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  // Omit password from response
  const { password, ...userWithoutPassword } = user;
  res.send(userWithoutPassword);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(StatusCodes.NO_CONTENT).send();
});

// ==================== Profile Management ====================
const getProfile = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const user = await userService.getUserById(userId);
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }
  // Omit password from response
  const { password, otp, otpExpiry, ...userWithoutSensitiveData } = user;
  res.send(userWithoutSensitiveData);
});

const updateProfile = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const user = await userService.updateUserById(userId, req.body);
  // Omit password from response
  const { password, otp, otpExpiry, ...userWithoutSensitiveData } = user;
  res.send(userWithoutSensitiveData);
});

// ==================== Avatar Management ====================
const uploadAvatar = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'No file uploaded');
  }

  const userId = req.user.id;

  // Delete old avatar from Cloudinary if exists
  const user = await userService.getUserById(userId);
  if (user.avatar) {
    const { deleteImage } = require('../../utils/uploadHelper');
    await deleteImage(user.avatar);
  }

  const avatarUrl = req.file.path; // Cloudinary URL

  const updatedUser = await userService.updateUserById(userId, { avatar: avatarUrl });

  res.send({
    avatar: updatedUser.avatar,
    message: 'Avatar uploaded successfully'
  });
});

const deleteAvatar = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const user = await userService.getUserById(userId);

  // Delete from Cloudinary
  if (user.avatar) {
    const { deleteImage } = require('../../utils/uploadHelper');
    await deleteImage(user.avatar);
  }

  await userService.updateUserById(userId, { avatar: null });

  res.send({ message: 'Avatar deleted successfully' });
});

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
  uploadAvatar,
  deleteAvatar,
};