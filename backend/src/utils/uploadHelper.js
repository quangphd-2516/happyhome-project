// backend/src/utils/uploadHelper.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// KYC Upload Configuration
const kycStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'happyhome/kyc',
        allowed_formats: ['jpg', 'jpeg', 'png'],
        transformation: [{ width: 1500, height: 1500, crop: 'limit' }]
    }
});

const uploadKYC = multer({
    storage: kycStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const extname = allowedTypes.test(file.originalname.toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
});

// Avatar Upload Configuration
const avatarStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'happyhome/avatars',
        allowed_formats: ['jpg', 'jpeg', 'png'],
        transformation: [{ width: 500, height: 500, crop: 'fill', gravity: 'face' }]
    }
});

const uploadAvatar = multer({
    storage: avatarStorage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const extname = allowedTypes.test(file.originalname.toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
});

// Property Upload Configuration
const propertyStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'happyhome/properties',
        allowed_formats: ['jpg', 'jpeg', 'png'],
        transformation: [{ width: 1920, height: 1080, crop: 'limit' }]
    }
});

const uploadProperty = multer({
    storage: propertyStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const extname = allowedTypes.test(file.originalname.toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
});

// Helper to delete image from Cloudinary
const deleteImage = async (imageUrl) => {
    try {
        // Extract public_id from Cloudinary URL
        const urlParts = imageUrl.split('/');
        const filename = urlParts[urlParts.length - 1];
        const publicId = filename.split('.')[0];
        const folder = urlParts[urlParts.length - 2];

        const fullPublicId = `happyhome/${folder}/${publicId}`;

        await cloudinary.uploader.destroy(fullPublicId);
        return true;
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        return false;
    }
};

module.exports = {
    uploadKYC,
    uploadAvatar,
    uploadProperty,
    deleteImage
};