// backend/src/controllers/property.controller.js
const { StatusCodes } = require('http-status-codes');
const catchAsync = require('../utils/catchAsync');
const { propertyService } = require('../services');
const ApiError = require('../utils/ApiError');

/**
 * Get all properties with filters
 * GET /api/v1/properties
 */
const getAllProperties = catchAsync(async (req, res) => {
    const result = await propertyService.getAllProperties(req.query);

    res.status(StatusCodes.OK).json({
        success: true,
        data: result.properties,
        pagination: result.pagination,
    });
});
/**
 * Get current user's properties
 * GET /api/v1/properties/my-properties
 */
const getMyProperties = catchAsync(async (req, res) => {
    console.log('🔍 User in request:', req.user); // thêm dòng này kiểm tra
    const properties = await propertyService.getUserProperties(req.user.id);

    res.status(StatusCodes.OK).json({
        success: true,
        data: properties,
    });
});

/**
 * Get property by ID
 * GET /api/v1/properties/:id
 */
const getPropertyById = catchAsync(async (req, res) => {
    const userId = req.user?.id; // Optional user ID if authenticated
    const property = await propertyService.getPropertyById(req.params.id, userId);

    res.status(StatusCodes.OK).json({
        success: true,
        data: property,
    });
});

/**
 * Create new property
 * POST /api/v1/properties
 */
const createProperty = catchAsync(async (req, res) => {
    const property = await propertyService.createProperty(req.user.id, req.body);

    res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Property created successfully',
        data: property,
    });
});

/**
 * Update property
 * PUT /api/v1/properties/:id
 */
const updateProperty = catchAsync(async (req, res) => {
    const property = await propertyService.updatePropertyById(
        req.params.id,
        req.user.id,
        req.user.role,
        req.body
    );

    res.status(StatusCodes.OK).json({
        success: true,
        message: 'Property updated successfully',
        data: property,
    });
});

/**
 * Delete property
 * DELETE /api/v1/properties/:id
 */
const deleteProperty = catchAsync(async (req, res) => {
    await propertyService.deletePropertyById(
        req.params.id,
        req.user.id,
        req.user.role
    );

    res.status(StatusCodes.OK).json({
        success: true,
        message: 'Property deleted successfully',
    });
});

/**
 * Search properties
 * GET /api/v1/properties/search
 */
const searchProperties = catchAsync(async (req, res) => {
    const properties = await propertyService.searchProperties(req.query.q);

    res.status(StatusCodes.OK).json({
        success: true,
        data: properties,
    });
});

/**
 * Get nearby properties
 * GET /api/v1/properties/nearby
 */
const getNearbyProperties = catchAsync(async (req, res) => {
    const { lat, lng, radius } = req.query;
    const properties = await propertyService.getNearbyProperties(lat, lng, radius);

    res.status(StatusCodes.OK).json({
        success: true,
        data: properties,
    });
});

/**
 * Get user's favorite properties
 * GET /api/v1/properties/favorites
 */
const getFavorites = catchAsync(async (req, res) => {
    const properties = await propertyService.getFavoriteProperties(req.user.id);

    res.status(StatusCodes.OK).json({
        success: true,
        data: properties,
    });
});

/**
 * Add property to favorites
 * POST /api/v1/properties/:id/favorite
 */
const addToFavorites = catchAsync(async (req, res) => {
    await propertyService.addToFavorites(req.user.id, req.params.id);

    res.status(StatusCodes.OK).json({
        success: true,
        message: 'Property added to favorites',
    });
});

/**
 * Remove property from favorites
 * DELETE /api/v1/properties/:id/favorite
 */
const removeFromFavorites = catchAsync(async (req, res) => {
    await propertyService.removeFromFavorites(req.user.id, req.params.id);

    res.status(StatusCodes.OK).json({
        success: true,
        message: 'Property removed from favorites',
    });
});

// === UPLOAD PROPERTY IMAGES ===
const uploadPropertyImages = catchAsync(async (req, res) => {
    if (!req.files || req.files.length === 0) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'No file uploaded');
    }
    const urls = req.files.map(file => ({
        url: file.path,
        publicId: file.filename,
        originalName: file.originalname
    }));
    res.status(StatusCodes.OK).json({
        success: true,
        images: urls,
    });
});
// --- ở cuối file, thêm vào module.exports ---

module.exports = {
    getAllProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
    getMyProperties,
    searchProperties,
    getNearbyProperties,
    getFavorites,
    addToFavorites,
    removeFromFavorites,
    uploadPropertyImages,
};