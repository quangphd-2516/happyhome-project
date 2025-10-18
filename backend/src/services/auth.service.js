const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const userService = require('./user.service');
const tokenService = require('./token.service');
const ApiError = require('../utils/ApiError');
const prisma = require('../client');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);

  // Check if user exists and if password is correct
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
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
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found');
    }

    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};


module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
};