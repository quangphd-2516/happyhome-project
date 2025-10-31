// backend/src/validations/chat.validation.js
const Joi = require('joi');

const createChat = {
    body: Joi.object().keys({
        participantId: Joi.string().required(),
    }),
};

const getChat = {
    params: Joi.object().keys({
        chatId: Joi.string().required(),
    }),
    query: Joi.object().keys({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(50),
    }),
};

const sendMessage = {
    params: Joi.object().keys({
        chatId: Joi.string().required(),
    }),
    body: Joi.object().keys({
        content: Joi.string().required().min(1).max(5000),
    }),
};

const markAsRead = {
    params: Joi.object().keys({
        chatId: Joi.string().required(),
    }),
};

const searchChats = {
    query: Joi.object().keys({
        q: Joi.string().required().min(1),
    }),
};

const deleteChat = {
    params: Joi.object().keys({
        chatId: Joi.string().required(),
    }),
};

module.exports = {
    createChat,
    getChat,
    sendMessage,
    markAsRead,
    searchChats,
    deleteChat,
};