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

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
};