// backend/src/services/websocket.service.js
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const prisma = require('../client');
const chatService = require('./chat.service');

let io;

const initializeWebSocket = (ioInstance) => {
    io = ioInstance;

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

        // ==================== CHAT EVENTS ====================

        socket.on('join_chat', async (data) => {
            try {
                const chatId = typeof data === 'string' ? data : data.chatId;
                console.log('Joining chat:', chatId, typeof chatId);

                const chat = await prisma.chat.findFirst({
                    where: {
                        id: chatId,
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

        // ==================== AUCTION EVENTS ====================

        socket.on('join_auction', async (data) => {
            try {
                const auctionId = typeof data === 'string' ? data : data.auctionId;
                console.log('Joining auction:', auctionId);

                // Verify user has paid deposit
                const participant = await prisma.auctionParticipant.findUnique({
                    where: {
                        auctionId_userId: {
                            auctionId,
                            userId: socket.user.id,
                        },
                    },
                });

                if (!participant?.depositPaid) {
                    socket.emit('auction_error', { message: 'Deposit required to join auction' });
                    return;
                }

                // Join room
                socket.join(`auction:${auctionId}`);
                socket.currentAuction = auctionId;

                // Get current auction state
                const auction = await prisma.auction.findUnique({
                    where: { id: auctionId },
                    include: {
                        bids: {
                            take: 10,
                            orderBy: { amount: 'desc' },
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
                        _count: {
                            select: {
                                participants: true,
                                bids: true,
                            },
                        },
                    },
                });

                if (!auction) {
                    socket.emit('auction_error', { message: 'Auction not found' });
                    return;
                }

                if (auction.status !== 'ONGOING') {
                    socket.emit('auction_error', { message: 'Auction is not ongoing' });
                    return;
                }

                // Send current state to user
                socket.emit('auction_joined', {
                    auctionId,
                    currentPrice: auction.currentPrice,
                    participantCount: auction._count.participants,
                    recentBids: auction.bids.map(bid => ({
                        id: bid.id,
                        amount: bid.amount,
                        userId: bid.userId,
                        userName: bid.user.fullName,
                        userAvatar: bid.user.avatar,
                        createdAt: bid.createdAt,
                    })),
                    timestamp: new Date(),
                });

                // Get participant count
                const participantCount = await getAuctionParticipantCount(auctionId);

                // Notify others
                socket.to(`auction:${auctionId}`).emit('user_joined_auction', {
                    userId: socket.user.id,
                    userName: socket.user.fullName,
                    participantCount,
                });

                console.log(`User ${socket.user.fullName} joined auction ${auctionId}`);
            } catch (error) {
                console.error('Error joining auction:', error);
                socket.emit('auction_error', { message: 'Failed to join auction' });
            }
        });

        socket.on('leave_auction', (data) => {
            const auctionId = typeof data === 'string' ? data : data.auctionId;
            socket.leave(`auction:${auctionId}`);
            socket.currentAuction = null;

            // Notify others
            socket.to(`auction:${auctionId}`).emit('user_left_auction', {
                userId: socket.user.id,
                userName: socket.user.fullName,
            });

            console.log(`User ${socket.user.fullName} left auction ${auctionId}`);
        });

        socket.on('place_bid', async (data) => {
            try {
                const { auctionId, amount } = data;

                // Verify auction is ongoing
                const auction = await prisma.auction.findUnique({
                    where: { id: auctionId },
                    include: {
                        participants: {
                            where: { userId: socket.user.id },
                        },
                    },
                });

                if (!auction) {
                    socket.emit('bid_error', { message: 'Auction not found' });
                    return;
                }

                if (auction.status !== 'ONGOING') {
                    socket.emit('bid_error', { message: 'Auction is not ongoing' });
                    return;
                }

                if (!auction.participants[0]?.depositPaid) {
                    socket.emit('bid_error', { message: 'Deposit required' });
                    return;
                }

                // Validate bid amount
                const minBid = parseFloat(auction.currentPrice) + parseFloat(auction.bidStep);
                if (amount < minBid) {
                    socket.emit('bid_error', {
                        message: `Minimum bid is ${minBid}`,
                        minBid,
                        currentPrice: auction.currentPrice,
                    });
                    return;
                }

                // Create bid
                const bid = await prisma.bid.create({
                    data: {
                        auctionId,
                        userId: socket.user.id,
                        amount: parseFloat(amount),
                    },
                });

                // Update auction
                await prisma.auction.update({
                    where: { id: auctionId },
                    data: { currentPrice: parseFloat(amount) },
                });

                // Emit to all participants
                io.to(`auction:${auctionId}`).emit('new_bid', {
                    bid: {
                        id: bid.id,
                        amount: bid.amount,
                        userId: socket.user.id,
                        userName: socket.user.fullName,
                        userAvatar: socket.user.avatar,
                        createdAt: bid.createdAt,
                    },
                    auction: {
                        id: auctionId,
                        currentPrice: parseFloat(amount),
                    },
                    timestamp: new Date(),
                });

                // Confirm to bidder
                socket.emit('bid_placed', {
                    success: true,
                    bidId: bid.id,
                    amount: bid.amount,
                });

                console.log(`User ${socket.user.fullName} placed bid ${amount} on auction ${auctionId}`);
            } catch (error) {
                console.error('Place bid error:', error);
                socket.emit('bid_error', { message: 'Failed to place bid' });
            }
        });

        // ==================== COMMON EVENTS ====================

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.user.fullName}`);
        });

        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });
    });

    console.log('WebSocket server initialized (Chat + Auction)');
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Get participant count in auction room
 */
const getAuctionParticipantCount = async (auctionId) => {
    if (!io) return 0;
    const room = io.sockets.adapter.rooms.get(`auction:${auctionId}`);
    return room ? room.size : 0;
};

// ==================== EMIT FUNCTIONS (for external use) ====================

/**
 * Emit new bid to all participants (can be called from HTTP endpoints)
 */
const emitNewBid = (auctionId, data) => {
    if (io) {
        io.to(`auction:${auctionId}`).emit('new_bid', data);
    }
};

/**
 * Emit auction update (status change, etc.)
 */
const emitAuctionUpdate = (auctionId, update) => {
    if (io) {
        io.to(`auction:${auctionId}`).emit('auction_update', {
            ...update,
            timestamp: new Date(),
        });
    }
};

/**
 * Emit auction started
 */
const emitAuctionStarted = (auctionId) => {
    if (io) {
        io.to(`auction:${auctionId}`).emit('auction_started', {
            auctionId,
            timestamp: new Date(),
        });
    }
};

/**
 * Emit auction ended
 */
const emitAuctionEnded = async (auctionId, winnerId) => {
    if (io) {
        const winner = winnerId ? await prisma.user.findUnique({
            where: { id: winnerId },
            select: { id: true, fullName: true, avatar: true },
        }) : null;

        io.to(`auction:${auctionId}`).emit('auction_ended', {
            auctionId,
            winner,
            timestamp: new Date(),
        });
    }
};

/**
 * Send notification to specific user
 */
const sendNotification = (userId, notification) => {
    if (io) {
        io.to(`user:${userId}`).emit('new_notification', {
            ...notification,
            timestamp: new Date(),
        });
    }
};

module.exports = {
    initializeWebSocket,
    emitNewBid,
    emitAuctionUpdate,
    emitAuctionStarted,
    emitAuctionEnded,
    sendNotification,
    getAuctionParticipantCount,
};