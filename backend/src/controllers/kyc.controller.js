// backend/src/controllers/kyc.controller.js
const { StatusCodes } = require('http-status-codes');
const catchAsync = require('../utils/catchAsync');
const { kycService } = require('../services');
const ApiError = require('../utils/ApiError');

const submitKYC = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const kyc = await kycService.submitKYC(userId, req.body);
    res.status(StatusCodes.CREATED).send(kyc);
});

const getKYCStatus = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const kyc = await kycService.getKYCByUserId(userId);
    if (!kyc) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'KYC not found');
    }
    res.send(kyc);
});

const uploadKYCImage = catchAsync(async (req, res) => {
    if (!req.file) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'No file uploaded');
    }
    const { type } = req.body;
    if (!['idCardFront', 'idCardBack', 'selfieWithId'].includes(type)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid image type');
    }

    // File path will be available in req.file.path after multer processes it
    const imageUrl = req.file.path;

    res.send({
        url: imageUrl,
        type: type,
        publicId: req.file.filename,
    });
});

module.exports = {
    submitKYC,
    getKYCStatus,
    uploadKYCImage,
};