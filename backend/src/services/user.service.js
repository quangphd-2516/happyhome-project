// backend/src/services/user.service.js
const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcryptjs');
const prisma = require('../client');
const ApiError = require('../utils/ApiError');

/**
 * Check if email is taken
 * @param {string} email
 * @param {string} [excludeUserId]
 * @returns {Promise<boolean>}
 */
const isEmailTaken = async (email, excludeUserId) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return !!user && (!excludeUserId || user.id !== excludeUserId);
};

/**
 * Check if phone is taken
 * @param {string} phone
 * @param {string} [excludeUserId]
 * @returns {Promise<boolean>}
 */
const isPhoneTaken = async (phone, excludeUserId) => {
  if (!phone) return false;
  const user = await prisma.user.findUnique({
    where: { phone },
  });
  return !!user && (!excludeUserId || user.id !== excludeUserId);
};

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await isEmailTaken(userBody.email)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already taken');
  }
  if (userBody.phone && await isPhoneTaken(userBody.phone)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Phone number already taken');
  }

  const hashedPassword = await bcrypt.hash(userBody.password, 8);
  const user = await prisma.user.create({
    data: {
      ...userBody,
      password: hashedPassword,
    },
  });
  return user;
};

/**
 * Get user by id
 * @param {string} id
 * @returns {Promise<User | null>}
 */
const getUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    include: {
      kycData: true,
      wallet: {
        include: {
          _count: {
            select: { transactions: true }
          }
        }
      },
      _count: {
        select: {
          properties: true,
          auctions: true,
          favorites: true,
          reviews: true,
        }
      }
    }
  });
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User | null>}
 */
const getUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

/**
 * Update user by id
 * @param {string} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  if (updateBody.email && (await isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already taken');
  }

  if (updateBody.phone && (await isPhoneTaken(updateBody.phone, userId))) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Phone number already taken');
  }

  // If password is being updated, hash it
  if (updateBody.password) {
    updateBody.password = await bcrypt.hash(updateBody.password, 8);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateBody,
  });
  return updatedUser;
};

/**
 * Delete user by id
 * @param {string} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }
  await prisma.user.delete({ where: { id: userId } });
  return user;
};

/**
 * Get user profile with full details
 * @param {string} userId
 * @returns {Promise<User>}
 */
const getUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      kycData: true,
      wallet: {
        include: {
          _count: {
            select: { transactions: true }
          }
        }
      },
      _count: {
        select: {
          properties: true,
          auctions: true,
          bids: true,
          favorites: true,
          reviews: true,
        }
      }
    }
  });

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  return user;
};

/**
 * Update user avatar
 * @param {string} userId
 * @param {string} avatarUrl
 * @returns {Promise<User>}
 */
const updateAvatar = async (userId, avatarUrl) => {
  return updateUserById(userId, { avatar: avatarUrl });
};

/**
 * Delete user avatar
 * @param {string} userId
 * @returns {Promise<User>}
 */
const deleteAvatar = async (userId) => {
  return updateUserById(userId, { avatar: null });
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  getUserProfile,
  updateAvatar,
  deleteAvatar,
};