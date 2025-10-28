// backend/src/routes/v1/user.route.js
const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');
const multer = require('multer');
const path = require('path');
const { uploadAvatar } = require('../../utils/uploadHelper');

const router = express.Router();



// Apply auth middleware to all routes
router.use(auth());

// ==================== Profile Routes ====================
router.get('/profile', userController.getProfile);
router.put('/profile', validate(userValidation.updateProfile), userController.updateProfile);

// ==================== Avatar Routes ====================
router.post('/avatar', uploadAvatar.single('avatar'), userController.uploadAvatar);
router.delete('/avatar', userController.deleteAvatar);

// ==================== Admin User Management Routes ====================
router.post('/', auth('manageUsers'), validate(userValidation.createUser), userController.createUser);

router.get('/:userId', auth('getUsers'), validate(userValidation.getUser), userController.getUser);
router.patch('/:userId', auth('manageUsers'), validate(userValidation.updateUser), userController.updateUser);
router.delete('/:userId', auth('manageUsers'), validate(userValidation.deleteUser), userController.deleteUser);

module.exports = router;