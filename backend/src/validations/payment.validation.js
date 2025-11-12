// backend/src/validations/payment.validation.js
const Joi = require('joi');

const createVNPayPayment = {
    body: Joi.object().keys({
        auctionId: Joi.string().required(),
        amount: Joi.number().positive().required(),
        orderId: Joi.string(),
        orderInfo: Joi.string(),
    }),
};
const createMoMoPayment = {
    body: Joi.object().keys({
        auctionId: Joi.string().required(),
        amount: Joi.number().positive().required(),
        orderId: Joi.string(),
        orderInfo: Joi.string(),
    }),
};

module.exports = {
    createVNPayPayment,
    createMoMoPayment,
};