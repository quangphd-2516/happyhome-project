// backend/src/routes/v1/kyc.route.js
const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const kycValidation = require('../../validations/kyc.validation');
const kycController = require('../../controllers/kyc.controller');
const multer = require('multer');
const path = require('path');
const { uploadKYC } = require('../../utils/uploadHelper');

const router = express.Router();

// Configure multer for file upload

router.use(auth()); // Apply auth middleware to all routes below
router.post('/submit', validate(kycValidation.submitKYC), kycController.submitKYC);
router.get('/status', kycController.getKYCStatus);
router.post('/upload', uploadKYC.single('image'), kycController.uploadKYCImage);


module.exports = router;