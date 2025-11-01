// backend/src/routes/v1/chat.route.js
const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const chatValidation = require('../../validations/chat.validation');
const chatController = require('../../controllers/chat.controller');

const router = express.Router();

// All routes require authentication
router.use(auth());

// Get all chats
router.get(
    '/',
    chatController.getChats
);

// Create or get chat with user
router.post(
    '/',
    validate(chatValidation.createChat),
    chatController.createChat
);

// Get unread count
router.get(
    '/unread-count',
    chatController.getUnreadCount
);

// Search chats
router.get(
    '/search',
    validate(chatValidation.searchChats),
    chatController.searchChats
);

// Get chat by ID
router.get(
    '/:chatId',
    validate(chatValidation.getChat),
    chatController.getChatById
);

// Mark chat as read
router.put(
    '/:chatId/read',
    validate(chatValidation.markAsRead),
    chatController.markAsRead
);

// Send message
router.post(
    '/:chatId/messages',
    validate(chatValidation.sendMessage),
    chatController.sendMessage
);

// Delete chat
router.delete(
    '/:chatId',
    validate(chatValidation.deleteChat),
    chatController.deleteChat
);

module.exports = router;