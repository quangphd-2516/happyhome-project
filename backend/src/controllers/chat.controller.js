// backend/src/controllers/chat.controller.js
const { StatusCodes } = require('http-status-codes');
const catchAsync = require('../utils/catchAsync');
const chatService = require('../services/chat.service');

/**
 * Get all chats for current user
 */
const getChats = catchAsync(async (req, res) => {
    const chats = await chatService.getUserChats(req.user.id);
    res.status(StatusCodes.OK).json({
        success: true,
        data: chats,
    });
});

/**
 * Create or get existing chat
 */
const createChat = catchAsync(async (req, res) => {
    const chat = await chatService.createChat(req.user.id, req.body.participantId);
    res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Chat created successfully',
        data: chat,
    });
});

/**
 * Get chat by ID with messages
 */
const getChatById = catchAsync(async (req, res) => {
    const result = await chatService.getChatById(req.params.chatId, req.user.id, req.query);
    res.status(StatusCodes.OK).json({
        success: true,
        ...result,
    });
});

/**
 * Send message
 */
const sendMessage = catchAsync(async (req, res) => {
    const message = await chatService.sendMessage(
        req.params.chatId,
        req.user.id,
        req.body.content
    );

    // Emit WebSocket event for real-time chat
    /*const io = req.app.get('io');
    if (io) {
        io.to(`chat:${req.params.chatId}`).emit('new_message', {
            message,
            chatId: req.params.chatId,
        });
    }*/

    res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Message sent successfully',
        data: message,
    });
});

/**
 * Mark messages as read
 */
const markAsRead = catchAsync(async (req, res) => {
    const result = await chatService.markAsRead(req.params.chatId, req.user.id);
    res.status(StatusCodes.OK).json({
        success: true,
        ...result,
    });
});

/**
 * Get unread message count
 */
const getUnreadCount = catchAsync(async (req, res) => {
    const count = await chatService.getUnreadCount(req.user.id);
    res.status(StatusCodes.OK).json({
        success: true,
        data: { unreadCount: count },
    });
});

/**
 * Search chats
 */
const searchChats = catchAsync(async (req, res) => {
    const chats = await chatService.searchChats(req.user.id, req.query.q);
    res.status(StatusCodes.OK).json({
        success: true,
        data: chats,
    });
});

/**
 * Delete chat
 */
const deleteChat = catchAsync(async (req, res) => {
    const result = await chatService.deleteChat(req.params.chatId, req.user.id);
    res.status(StatusCodes.OK).json({
        success: true,
        ...result,
    });
});

module.exports = {
    getChats,
    createChat,
    getChatById,
    sendMessage,
    markAsRead,
    getUnreadCount,
    searchChats,
    deleteChat,
};