// src/services/chatService.js
import api from './api';

export const chatService = {
    // Get all chats for current user
    getChats: async () => {
        const response = await api.get('/chats');
        return response.data;
    },

    // Get chat by ID with messages
    getChatById: async (chatId, page = 1, limit = 50) => {
        const response = await api.get(`/chats/${chatId}`, {
            params: { page, limit }
        });
        return response.data;
    },

    // Create or get existing chat with user
    createChat: async (participantId) => {
        const response = await api.post(`/chats`, {
            participantId
        });
        return response.data;
    },

    // Send message
    sendMessage: async (chatId, content) => {
        const response = await api.post(`/chats/${chatId}/messages`, {
            content
        });
        return response.data;
    },

    // Mark messages as read
    markAsRead: async (chatId) => {
        const response = await api.put(`/chats/${chatId}/read`);
        return response.data;
    },

    // Get unread count
    getUnreadCount: async () => {
        const response = await api.get('/chats/unread-count');
        return response.data;
    },

    // Search chats
    searchChats: async (query) => {
        const response = await api.get('/chats/search', {
            params: { q: query }
        });
        return response.data;
    },

    // Delete chat
    deleteChat: async (chatId) => {
        const response = await api.delete(`/chats/${chatId}`);
        return response.data;
    },
};