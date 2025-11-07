// backend/src/validations/auction.validation.js
const Joi = require('joi');

const getAllAuctions = {
    query: Joi.object().keys({
        page: Joi.number().integer().min(1),
        limit: Joi.number().integer().min(1).max(100),
        status: Joi.string().valid('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'),
        sortBy: Joi.string().valid(
            'startTime:asc',
            'startTime:desc',
            'endTime:asc',
            'endTime:desc',
            'currentPrice:asc',
            'currentPrice:desc',
            'createdAt:asc',
            'createdAt:desc'
        ),
    }),
};

const getPaginatedAuctions = {
    query: Joi.object().keys({
        page: Joi.number().integer().min(1),
        limit: Joi.number().integer().min(1).max(100),
    }),
};

const getAuctionById = {
    params: Joi.object().keys({
        auctionId: Joi.string().required(),
    }),
};

const placeBid = {
    params: Joi.object().keys({
        auctionId: Joi.string().required(),
    }),
    body: Joi.object().keys({
        amount: Joi.number().positive().required(),
        isAutoBid: Joi.boolean(),
        maxAmount: Joi.number().positive().greater(Joi.ref('amount')),
    }),
};

const getBidHistory = {
    params: Joi.object().keys({
        auctionId: Joi.string().required(),
    }),
    query: Joi.object().keys({
        page: Joi.number().integer().min(1),
        limit: Joi.number().integer().min(1).max(100),
    }),
};

const payDeposit = {
    params: Joi.object().keys({
        auctionId: Joi.string().required(),
    }),
    body: Joi.object().keys({
        paymentMethod: Joi.string().valid('VNPAY', 'MOMO', 'BLOCKCHAIN', 'WALLET').required(),
    }),
};

module.exports = {
    getAllAuctions,
    getPaginatedAuctions,
    getAuctionById,
    placeBid,
    getBidHistory,
    payDeposit,
};