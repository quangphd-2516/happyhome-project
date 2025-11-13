// src/services/websocketService.js
import { io } from 'socket.io-client';

class WebSocketService {
    constructor() {
        this.socket = null;
        this.isSocketConnected = false;
        this.connectionPromise = null;
    }

    // Kết nối socket và trả về Promise
    connect(token) {
        if (this.socket && this.isSocketConnected) {
            return Promise.resolve();
        }

        if (this.connectionPromise) {
            return this.connectionPromise;
        }

        this.connectionPromise = new Promise((resolve, reject) => {
            // Ưu tiên VITE_SOCKET_URL, fallback về VITE_API_URL rồi xóa /api
            const socketURL = import.meta.env.VITE_SOCKET_URL ||
                (import.meta.env.VITE_API_URL || 'http://localhost:5000')
                    .replace('/api/v1', '')
                    .replace('/api', '');

            console.log('🔌 Connecting to Socket.IO:', socketURL);

            this.socket = io(socketURL, {
                auth: { token },
                path: '/socket.io',
                transports: ['websocket', 'polling'],
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
            });

            this.socket.on('connect', () => {
                console.log('✅ Socket connected:', this.socket.id);
                this.isSocketConnected = true;
                this.connectionPromise = null;
                resolve();
            });

            this.socket.on('connect_error', (error) => {
                console.error('❌ Socket connection error:', error);
                this.isSocketConnected = false;
                this.connectionPromise = null;
                reject(error);
            });

            this.socket.on('disconnect', (reason) => {
                console.log('Socket disconnected:', reason);
                this.isSocketConnected = false;
            });

            // Timeout sau 10 giây
            setTimeout(() => {
                if (!this.isSocketConnected) {
                    this.connectionPromise = null;
                    reject(new Error('Connection timeout'));
                }
            }, 10000);
        });

        return this.connectionPromise;
    }

    isConnected() {
        return this.socket && this.isSocketConnected;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isSocketConnected = false;
            this.connectionPromise = null;
        }
    }

    // Đảm bảo socket đã kết nối trước khi emit
    async ensureConnected() {
        if (!this.isConnected()) {
            throw new Error('Socket not connected. Please wait for connection.');
        }
    }

    // ==================== AUCTION EVENTS ====================

    async joinAuction(auctionId) {
        await this.ensureConnected();
        console.log('Joining auction:', auctionId);
        this.socket.emit('join_auction', auctionId);
    }

    leaveAuction(auctionId) {
        if (this.isConnected()) {
            this.socket.emit('leave_auction', auctionId);
        }
    }

    async placeBid(auctionId, amount) {
        await this.ensureConnected();
        this.socket.emit('place_bid', { auctionId, amount });
    }

    // ==================== AUCTION EVENT LISTENERS ====================

    onAuctionJoined(callback) {
        if (this.socket) this.socket.on('auction_joined', callback);
    }

    onAuctionError(callback) {
        if (this.socket) this.socket.on('auction_error', callback);
    }

    onNewBid(callback) {
        if (this.socket) this.socket.on('new_bid', callback);
    }

    onBidPlaced(callback) {
        if (this.socket) this.socket.on('bid_placed', callback);
    }

    onBidError(callback) {
        if (this.socket) this.socket.on('bid_error', callback);
    }

    onUserJoinedAuction(callback) {
        if (this.socket) this.socket.on('user_joined_auction', callback);
    }

    onUserLeftAuction(callback) {
        if (this.socket) this.socket.on('user_left_auction', callback);
    }

    onAuctionStarted(callback) {
        if (this.socket) this.socket.on('auction_started', callback);
    }

    onAuctionEnded(callback) {
        if (this.socket) this.socket.on('auction_ended', callback);
    }

    onAuctionUpdate(callback) {
        if (this.socket) this.socket.on('auction_update', callback);
    }

    // ==================== CHAT EVENTS ====================

    async joinChat(chatId) {
        await this.ensureConnected();
        console.log('Joining chat:', chatId);
        this.socket.emit('join_chat', chatId);
    }

    leaveChat(chatId) {
        if (this.isConnected()) {
            this.socket.emit('leave_chat', chatId);
        }
    }

    async sendMessage(chatId, content) {
        await this.ensureConnected();
        this.socket.emit('send_message', { chatId, content });
    }

    typing(chatId) {
        if (this.isConnected()) {
            this.socket.emit('typing', { chatId });
        }
    }

    stopTyping(chatId) {
        if (this.isConnected()) {
            this.socket.emit('stop_typing', { chatId });
        }
    }

    // ==================== CHAT EVENT LISTENERS ====================

    onChatJoined(callback) {
        if (this.socket) this.socket.on('chat_joined', callback);
    }

    onNewMessage(callback) {
        if (this.socket) this.socket.on('new_message', callback);
    }

    onMessageSent(callback) {
        if (this.socket) this.socket.on('message_sent', callback);
    }

    onMessageError(callback) {
        if (this.socket) this.socket.on('message_error', callback);
    }

    onUserTyping(callback) {
        if (this.socket) this.socket.on('user_typing', callback);
    }

    onUserStopTyping(callback) {
        if (this.socket) this.socket.on('user_stop_typing', callback);
    }

    // ==================== NOTIFICATION EVENTS ====================

    onNewNotification(callback) {
        if (this.socket) this.socket.on('new_notification', callback);
    }

    // ==================== REMOVE LISTENERS ====================

    off(eventName) {
        if (this.socket) {
            this.socket.off(eventName);
        }
    }

    // Remove all listeners
    removeAllListeners() {
        if (this.socket) {
            this.socket.removeAllListeners();
        }
    }
}

export default new WebSocketService();