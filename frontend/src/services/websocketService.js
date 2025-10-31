// src/services/websocketService.js
import { io } from 'socket.io-client';

class WebSocketService {
    constructor() {
        this.socket = null;
        this.listeners = new Map();
    }

    connect(token) {
        if (this.socket?.connected) return;

        this.socket = io(import.meta.env.VITE_WS_URL || 'http://localhost:5000', {
            auth: { token },
            transports: ['websocket'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
        });

        this.socket.on('connect', () => {
            console.log('WebSocket connected');
        });

        this.socket.on('disconnect', () => {
            console.log('WebSocket disconnected');
        });

        this.socket.on('error', (error) => {
            console.error('WebSocket error:', error);
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.listeners.clear();
        }
    }

    // Join chat room
    joinChat(chatId) {
        if (this.socket) {
            this.socket.emit('join_chat', { chatId });
        }
    }

    // Leave chat room
    leaveChat(chatId) {
        if (this.socket) {
            this.socket.emit('leave_chat', { chatId });
        }
    }

    // Send message
    sendMessage(chatId, content) {
        if (this.socket && this.socket.connected) {
            this.socket.emit('send_message', {
                chatId,
                content
            });
        }
    }

    // Thêm listener cho message sent confirmation
    onMessageSent(callback) {
        if (this.socket) {
            this.socket.on('message_sent', callback);
        }
    }

    // Listen for new messages
    onNewMessage(callback) {
        if (this.socket) {
            this.socket.on('new_message', callback);
            this.listeners.set('new_message', callback);
        }
    }

    // Listen for typing indicator
    onUserTyping(callback) {
        if (this.socket) {
            this.socket.on('user_typing', callback);
            this.listeners.set('user_typing', callback);
        }
    }

    // Emit typing status
    emitTyping(chatId, isTyping) {
        if (this.socket) {
            this.socket.emit('typing', { chatId, isTyping });
        }
    }

    // Listen for new notifications
    onNewNotification(callback) {
        if (this.socket) {
            this.socket.on('new_notification', callback);
            this.listeners.set('new_notification', callback);
        }
    }

    // Listen for message read
    onMessageRead(callback) {
        if (this.socket) {
            this.socket.on('message_read', callback);
            this.listeners.set('message_read', callback);
        }
    }

    // Remove listener
    off(event) {
        if (this.socket && this.listeners.has(event)) {
            this.socket.off(event, this.listeners.get(event));
            this.listeners.delete(event);
        }
    }

    // Remove all listeners
    removeAllListeners() {
        if (this.socket) {
            this.listeners.forEach((callback, event) => {
                this.socket.off(event, callback);
            });
            this.listeners.clear();
        }
    }

    isConnected() {
        return this.socket?.connected || false;
    }
}

export default new WebSocketService();