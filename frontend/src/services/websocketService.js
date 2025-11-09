// src/services/websocketService.js
import { io } from 'socket.io-client';

class WebSocketService {
    constructor() {
        this.socket = null;
        this.listeners = new Map();
    }

    connect(token) {
        if (this.socket?.connected) return;

        this.socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
            auth: { token },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
        });

        this.socket.on('connect', () => {
            console.log('✅ WebSocket connected');
        });

        this.socket.on('disconnect', () => {
            console.log('❌ WebSocket disconnected');
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

    // ==================== CHAT METHODS ====================

    // Join chat room
    joinChat(chatId) {
        if (this.socket && this.socket.connected) {
            this.socket.emit('join_chat', { chatId });
        }
    }

    // Leave chat room
    leaveChat(chatId) {
        if (this.socket) {
            this.socket.emit('leave_chat', chatId);
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

    // Emit typing status
    emitTyping(chatId, isTyping) {
        if (this.socket) {
            this.socket.emit('typing', { chatId, isTyping });
        }
    }

    // Listen for message sent confirmation
    onMessageSent(callback) {
        if (this.socket) {
            this.socket.on('message_sent', callback);
            this.listeners.set('message_sent', callback);
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

    // Listen for message read
    onMessageRead(callback) {
        if (this.socket) {
            this.socket.on('message_read', callback);
            this.listeners.set('message_read', callback);
        }
    }

    // Listen for chat joined
    onChatJoined(callback) {
        if (this.socket) {
            this.socket.on('chat_joined', callback);
            this.listeners.set('chat_joined', callback);
        }
    }

    // ==================== AUCTION METHODS ====================

    // Join auction room
    joinAuction(auctionId) {
        if (this.socket && this.socket.connected) {
            console.log('Joining auction:', auctionId);
            this.socket.emit('join_auction', { auctionId });
        } else {
            console.error('Socket not connected. Cannot join auction.');
        }
    }

    // Leave auction room
    leaveAuction(auctionId) {
        if (this.socket) {
            this.socket.emit('leave_auction', { auctionId });
        }
    }

    // Place bid via socket
    placeBid(auctionId, amount) {
        if (this.socket && this.socket.connected) {
            this.socket.emit('place_bid', {
                auctionId,
                amount: parseFloat(amount)
            });
        } else {
            console.error('Socket not connected. Cannot place bid.');
        }
    }

    // Listen for auction joined confirmation
    onAuctionJoined(callback) {
        if (this.socket) {
            this.socket.on('auction_joined', callback);
            this.listeners.set('auction_joined', callback);
        }
    }

    // Listen for auction errors
    onAuctionError(callback) {
        if (this.socket) {
            this.socket.on('auction_error', callback);
            this.listeners.set('auction_error', callback);
        }
    }

    // Listen for new bids
    onNewBid(callback) {
        if (this.socket) {
            this.socket.on('new_bid', callback);
            this.listeners.set('new_bid', callback);
        }
    }

    // Listen for bid placed confirmation
    onBidPlaced(callback) {
        if (this.socket) {
            this.socket.on('bid_placed', callback);
            this.listeners.set('bid_placed', callback);
        }
    }

    // Listen for bid errors
    onBidError(callback) {
        if (this.socket) {
            this.socket.on('bid_error', callback);
            this.listeners.set('bid_error', callback);
        }
    }

    // Listen for user joined auction
    onUserJoinedAuction(callback) {
        if (this.socket) {
            this.socket.on('user_joined_auction', callback);
            this.listeners.set('user_joined_auction', callback);
        }
    }

    // Listen for user left auction
    onUserLeftAuction(callback) {
        if (this.socket) {
            this.socket.on('user_left_auction', callback);
            this.listeners.set('user_left_auction', callback);
        }
    }

    // Listen for auction started
    onAuctionStarted(callback) {
        if (this.socket) {
            this.socket.on('auction_started', callback);
            this.listeners.set('auction_started', callback);
        }
    }

    // Listen for auction ended
    onAuctionEnded(callback) {
        if (this.socket) {
            this.socket.on('auction_ended', callback);
            this.listeners.set('auction_ended', callback);
        }
    }

    // Listen for auction updates (status changes, etc.)
    onAuctionUpdate(callback) {
        if (this.socket) {
            this.socket.on('auction_update', callback);
            this.listeners.set('auction_update', callback);
        }
    }

    // ==================== NOTIFICATION METHODS ====================

    // Listen for new notifications
    onNewNotification(callback) {
        if (this.socket) {
            this.socket.on('new_notification', callback);
            this.listeners.set('new_notification', callback);
        }
    }

    // ==================== UTILITY METHODS ====================

    // Remove specific listener
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

    // Check connection status
    isConnected() {
        return this.socket?.connected || false;
    }

    // Get socket instance (for direct access if needed)
    getSocket() {
        return this.socket;
    }
}

export default new WebSocketService();