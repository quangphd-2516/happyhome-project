// backend/src/validations/kyc.validation.js
const Joi = require('joi');

const submitKYC = {
    body: Joi.object().keys({
        idCardNumber: Joi.string().required().min(9).max(12),
        idCardFront: Joi.string().required().uri(),
        idCardBack: Joi.string().required().uri(),
        selfieWithId: Joi.string().required().uri(),
        fullName: Joi.string().required().min(2).max(100),
        dateOfBirth: Joi.date().required().max('now'),
        address: Joi.string().required().min(10).max(500),
    }),
};

module.exports = {
    submitKYC,
};