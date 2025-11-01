// backend/src/services/chat.service.js
const { StatusCodes } = require('http-status-codes');
const prisma = require('../client');
const ApiError = require('../utils/ApiError');

/**
 * Create or get existing chat between two users
 * @param {string} userId - Current user ID
 * @param {string} participantId - Other user ID
 * @returns {Promise<Chat>}
 */
const createChat = async (userId, participantId) => {
    // Validate participant exists
    const participant = await prisma.user.findUnique({
        where: { id: participantId },
    });

    if (!participant) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Participant not found');
    }

    // Check if user trying to chat with themselves
    if (userId === participantId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Cannot create chat with yourself');
    }

    // Check if chat already exists between these two users
    const existingChat = await prisma.chat.findFirst({
        where: {
            AND: [
                {
                    participants: {
                        some: { userId },
                    },
                },
                {
                    participants: {
                        some: { userId: participantId },
                    },
                },
            ],
        },
        include: {
            participants: {
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                            avatar: true,
                        },
                    },
                },
            },
            messages: {
                orderBy: { createdAt: 'desc' },
                take: 1,
            },
        },
    });

    if (existingChat) {
        return existingChat;
    }

    // Create new chat
    const chat = await prisma.chat.create({
        data: {
            participants: {
                create: [
                    { userId },
                    { userId: participantId },
                ],
            },
        },
        include: {
            participants: {
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                            avatar: true,
                        },
                    },
                },
            },
            messages: true,
        },
    });

    return chat;
};

/**
 * Get all chats for user
 * @param {string} userId
 * @returns {Promise<Array>}
 */
const getUserChats = async (userId) => {
    const chats = await prisma.chat.findMany({
        where: {
            participants: {
                some: { userId },
            },
        },
        include: {
            participants: {
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                            avatar: true,
                        },
                    },
                },
            },
            messages: {
                orderBy: { createdAt: 'desc' },
                take: 1,
            },
            _count: {
                select: {
                    messages: {
                        where: {
                            senderId: { not: userId },
                            isRead: false,
                        },
                    },
                },
            },
        },
        orderBy: {
            updatedAt: 'desc',
        },
    });

    // Format response to show other participant and unread count
    const formattedChats = chats.map(chat => {
        const otherParticipant = chat.participants.find(p => p.userId !== userId);
        const lastMessage = chat.messages[0] || null;
        const unreadCount = chat._count.messages;

        return {
            id: chat.id,
            participant: otherParticipant?.user || null,
            lastMessage,
            unreadCount,
            updatedAt: chat.updatedAt,
            createdAt: chat.createdAt,
        };
    });

    return formattedChats;
};

/**
 * Get chat by ID with messages
 * @param {string} chatId
 * @param {string} userId
 * @param {Object} options
 * @returns {Promise<Object>}
 */
const getChatById = async (chatId, userId, options = {}) => {
    const { page = 1, limit = 50 } = options;

    // Verify user is participant
    const chat = await prisma.chat.findFirst({
        where: {
            id: chatId,
            participants: {
                some: { userId },
            },
        },
        include: {
            participants: {
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                            avatar: true,
                        },
                    },
                },
            },
        },
    });

    if (!chat) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Chat not found or access denied');
    }

    // Get messages with pagination
    const skip = (page - 1) * limit;
    const take = parseInt(limit);

    const [messages, totalMessages] = await Promise.all([
        prisma.chatMessage.findMany({
            where: { chatId },
            include: {
                chat: {
                    include: {
                        participants: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        fullName: true,
                                        avatar: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take,
        }),
        prisma.chatMessage.count({ where: { chatId } }),
    ]);

    // Get other participant
    const otherParticipant = chat.participants.find(p => p.userId !== userId);

    return {
        chat: {
            id: chat.id,
            participant: otherParticipant?.user || null,
            createdAt: chat.createdAt,
            updatedAt: chat.updatedAt,
        },
        messages: messages.reverse(), // Return oldest first for display
        pagination: {
            page,
            limit: take,
            totalPages: Math.ceil(totalMessages / take),
            totalMessages,
        },
    };
};

/**
 * Send message
 * @param {string} chatId
 * @param {string} senderId
 * @param {string} content
 * @returns {Promise<ChatMessage>}
 */
const sendMessage = async (chatId, senderId, content) => {
    // Verify user is participant
    const chat = await prisma.chat.findFirst({
        where: {
            id: chatId,
            participants: {
                some: { userId: senderId },
            },
        },
    });

    if (!chat) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Chat not found or access denied');
    }

    // Create message
    const message = await prisma.chatMessage.create({
        data: {
            chatId,
            senderId,
            content,
        },
    });

    // Update chat timestamp
    await prisma.chat.update({
        where: { id: chatId },
        data: { updatedAt: new Date() },
    });

    return message;
};

/**
 * Mark messages as read
 * @param {string} chatId
 * @param {string} userId
 * @returns {Promise<Object>}
 */
const markAsRead = async (chatId, userId) => {
    // Verify user is participant
    const chat = await prisma.chat.findFirst({
        where: {
            id: chatId,
            participants: {
                some: { userId },
            },
        },
    });

    if (!chat) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Chat not found or access denied');
    }

    // Mark all messages from other users as read
    const result = await prisma.chatMessage.updateMany({
        where: {
            chatId,
            senderId: { not: userId },
            isRead: false,
        },
        data: {
            isRead: true,
        },
    });

    return {
        success: true,
        updatedCount: result.count,
    };
};

/**
 * Get unread message count
 * @param {string} userId
 * @returns {Promise<number>}
 */
const getUnreadCount = async (userId) => {
    const count = await prisma.chatMessage.count({
        where: {
            chat: {
                participants: {
                    some: { userId },
                },
            },
            senderId: { not: userId },
            isRead: false,
        },
    });

    return count;
};

/**
 * Search chats
 * @param {string} userId
 * @param {string} query
 * @returns {Promise<Array>}
 */
const searchChats = async (userId, query) => {
    const chats = await prisma.chat.findMany({
        where: {
            participants: {
                some: { userId },
            },
            OR: [
                {
                    participants: {
                        some: {
                            user: {
                                fullName: {
                                    contains: query,
                                    mode: 'insensitive',
                                },
                            },
                        },
                    },
                },
                {
                    messages: {
                        some: {
                            content: {
                                contains: query,
                                mode: 'insensitive',
                            },
                        },
                    },
                },
            ],
        },
        include: {
            participants: {
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                            avatar: true,
                        },
                    },
                },
            },
            messages: {
                orderBy: { createdAt: 'desc' },
                take: 1,
            },
        },
        orderBy: {
            updatedAt: 'desc',
        },
    });

    // Format response
    const formattedChats = chats.map(chat => {
        const otherParticipant = chat.participants.find(p => p.userId !== userId);
        const lastMessage = chat.messages[0] || null;

        return {
            id: chat.id,
            participant: otherParticipant?.user || null,
            lastMessage,
            updatedAt: chat.updatedAt,
        };
    });

    return formattedChats;
};

/**
 * Delete chat
 * @param {string} chatId
 * @param {string} userId
 * @returns {Promise<Object>}
 */
const deleteChat = async (chatId, userId) => {
    // Verify user is participant
    const chat = await prisma.chat.findFirst({
        where: {
            id: chatId,
            participants: {
                some: { userId },
            },
        },
    });

    if (!chat) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Chat not found or access denied');
    }

    // Delete chat (will cascade delete messages and participants)
    await prisma.chat.delete({
        where: { id: chatId },
    });

    return {
        success: true,
        message: 'Chat deleted successfully',
    };
};

module.exports = {
    createChat,
    getUserChats,
    getChatById,
    sendMessage,
    markAsRead,
    getUnreadCount,
    searchChats,
    deleteChat,
};