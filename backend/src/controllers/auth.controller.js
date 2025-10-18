const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { authService, userService, tokenService } = require('../services');

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

module.exports = {
  register,
  login,
  logout,
};