// backend/src/services/websocket.service.js
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const prisma = require('../client');
// const bidService = require('./bid.service'); // ❌ Comment dòng này
const chatService = require('./chat.service');

const initializeWebSocket = (io) => {
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token || socket.handshake.query.token;

            if (!token) {
                return next(new Error('Authentication token required'));
            }

            const decoded = jwt.verify(token, config.jwt.secret);
            const user = await prisma.user.findUnique({
                where: { id: decoded.sub },
                select: {
                    id: true,
                    email: true,
                    fullName: true,
                    avatar: true,
                    role: true,
                },
            });

            if (!user) {
                return next(new Error('User not found'));
            }

            socket.user = user;
            next();
        } catch (error) {
            next(new Error('Invalid token'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.user.fullName} (${socket.user.id})`);

        // ==================== CHAT EVENTS ONLY ====================

        // Dòng 45-60 - THAY THẾ TOÀN BỘ
        socket.on('join_chat', async (data) => {
            try {
                const chatId = typeof data === 'string' ? data : data.chatId;
                console.log('Joining chat:', chatId, typeof chatId); // Debug log

                const chat = await prisma.chat.findFirst({
                    where: {
                        id: chatId, // ✅ CHỈ chatId - KHÔNG WRAP {}
                        participants: {
                            some: {
                                userId: socket.user.id
                            }
                        }
                    }
                });

                if (!chat) {
                    socket.emit('error', { message: 'Chat not found or access denied' });
                    return;
                }

                socket.join(`chat:${chatId}`);
                socket.currentChat = chatId;

                socket.emit('chat_joined', {
                    chatId,
                    timestamp: new Date(),
                });

                console.log(`User ${socket.user.fullName} joined chat ${chatId}`);
            } catch (error) {
                console.error('Error joining chat:', error);
                socket.emit('error', { message: 'Failed to join chat' });
            }
        });

        socket.on('leave_chat', (chatId) => {
            socket.leave(`chat:${chatId}`);
            socket.currentChat = null;
            console.log(`User ${socket.user.fullName} left chat ${chatId}`);
        });

        socket.on('send_message', async (data) => {
            try {
                const { chatId, content } = data;

                const message = await chatService.sendMessage(chatId, socket.user.id, content);

                io.to(`chat:${chatId}`).emit('new_message', {
                    message: {
                        ...message,
                        sender: {
                            id: socket.user.id,
                            fullName: socket.user.fullName,
                            avatar: socket.user.avatar,
                        },
                    },
                    chatId,
                    timestamp: new Date(),
                });

                socket.emit('message_sent', {
                    success: true,
                    message,
                });

                console.log(`Message sent: ${socket.user.fullName} in chat ${chatId}`);
            } catch (error) {
                console.error('Error sending message:', error);
                socket.emit('message_error', {
                    message: error.message || 'Failed to send message',
                });
            }
        });

        socket.on('typing', (data) => {
            const { chatId } = data;
            socket.to(`chat:${chatId}`).emit('user_typing', {
                userId: socket.user.id,
                userName: socket.user.fullName,
                chatId,
            });
        });

        socket.on('stop_typing', (data) => {
            const { chatId } = data;
            socket.to(`chat:${chatId}`).emit('user_stop_typing', {
                userId: socket.user.id,
                chatId,
            });
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.user.fullName}`);
        });

        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });
    });

    console.log('WebSocket server initialized (Chat only)');
};

module.exports = {
    initializeWebSocket,
};