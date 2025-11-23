// backend/src/validations/admin.validation.js
const Joi = require('joi');

// ========== Auction Management Validations ==========

const getAllAuctions = {
    query: Joi.object().keys({
        page: Joi.number().integer().min(1),
        limit: Joi.number().integer().min(1).max(100),
        status: Joi.string().valid('all', 'UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED').allow(''),
        propertyId: Joi.string(),
        search: Joi.string().allow('').optional(),
        dateFrom: Joi.string().allow('').optional(),
        dateTo: Joi.string().allow('').optional(),
        sortBy: Joi.string().valid(
            'createdAt:asc',
            'createdAt:desc',
            'startTime:asc',
            'startTime:desc',
            'endTime:asc',
            'endTime:desc',
            'currentPrice:asc',
            'currentPrice:desc'
        ),
    }),
};

const getAuctionById = {
    params: Joi.object().keys({
        auctionId: Joi.string().required(),
    }),
};

const createAuction = {
    body: Joi.object().keys({
        propertyId: Joi.string().required(),
        title: Joi.string().required().min(10).max(200),
        description: Joi.string().max(2000),
        startPrice: Joi.number().positive().required(),
        bidStep: Joi.number().positive().required(),
        depositAmount: Joi.number().positive().required(),
        startTime: Joi.date().greater('now').required(),
        endTime: Joi.date().greater(Joi.ref('startTime')).required(),
    }),
};

const updateAuction = {
    params: Joi.object().keys({
        auctionId: Joi.string().required(),
    }),
    body: Joi.object().keys({
        title: Joi.string().min(10).max(200),
        description: Joi.string().max(2000),
        startPrice: Joi.number().positive(),
        bidStep: Joi.number().positive(),
        depositAmount: Joi.number().positive(),
        startTime: Joi.date().greater('now'),
        endTime: Joi.date(),
    }).min(1),
};

const cancelAuction = {
    params: Joi.object().keys({
        auctionId: Joi.string().required(),
    }),
    body: Joi.object().keys({
        reason: Joi.string().required().min(10).max(500),
    }),
};
// ========== Property Management Validations ==========

const getAllProperties = {
    query: Joi.object().keys({
        page: Joi.number().integer().min(1),
        limit: Joi.number().integer().min(1).max(100),
        status: Joi.string().valid('DRAFT', 'PENDING', 'PUBLISHED', 'SOLD'),
        type: Joi.string().valid('HOUSE', 'APARTMENT', 'LAND', 'VILLA', 'SHOPHOUSE'),
        city: Joi.string(),
        district: Joi.string(),
        hasAuction: Joi.boolean().optional(),
        sortBy: Joi.string().valid(
            'createdAt:asc',
            'createdAt:desc',
            'updatedAt:asc',
            'updatedAt:desc',
            'publishedAt:asc',
            'publishedAt:desc',
            'price:asc',
            'price:desc',
            'views:asc',
            'views:desc'
        ),
    }),
};

module.exports = {
    // Auction Management Validations
    getAllAuctions,
    getAuctionById,
    createAuction,
    updateAuction,
    cancelAuction,
    // Property Management Validations
    getAllProperties,
}