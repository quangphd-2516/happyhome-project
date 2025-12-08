// backend/src/services/auction.service.js
const { StatusCodes } = require('http-status-codes');
const prisma = require('../client');
const ApiError = require('../utils/ApiError');
const { emitAuctionUpdate, emitNewBid } = require('./websocket.service');

// ========== Public Auction Queries ==========

/**
 * Get all auctions with filters
 */
const getAllAuctions = async (options) => {
    const { page = 1, limit = 10, status, sortBy = 'startTime:desc' } = options;

    const skip = (page - 1) * limit;
    const [field, order] = sortBy.split(':');

    const where = {};
    if (status) where.status = status;

    const [auctions, total] = await Promise.all([
        prisma.auction.findMany({
            where,
            skip,
            take: limit,
            orderBy: { [field]: order || 'desc' },
            include: {
                property: {
                    select: {
                        id: true,
                        title: true,
                        thumbnail: true,
                        address: true,
                        city: true,
                        type: true,
                        area: true,
                        bedrooms: true,
                        bathrooms: true,
                        images: true,
                    },
                },
                _count: {
                    select: {
                        bids: true,
                        participants: true,
                    },
                },
            },
        }),
        prisma.auction.count({ where }),
    ]);

    return {
        data: auctions,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

/**
 * Get auction by ID with full details
 */
const getAuctionById = async (auctionId, userId = null) => {
    const auction = await prisma.auction.findUnique({
        where: { id: auctionId },
        include: {
            property: {
                include: {
                    owner: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                            phone: true,
                            avatar: true,
                        },
                    },
                },
            },
            creator: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    avatar: true,
                },
            },
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
                    bids: true,
                    participants: true,
                },
            },
        },
    });

    if (!auction) return null;

    // Increment view count if userId provided
    if (userId) {
        await prisma.property.update({
            where: { id: auction.propertyId },
            data: { views: { increment: 1 } },
        });
    }

    return auction;
};

/**
 * Get upcoming auctions
 */
const getUpcomingAuctions = async (options) => {
    return getAllAuctions({ ...options, status: 'UPCOMING' });
};

/**
 * Get ongoing auctions
 */
const getOngoingAuctions = async (options) => {
    return getAllAuctions({ ...options, status: 'ONGOING' });
};

/**
 * Get completed auctions
 */
const getCompletedAuctions = async (options) => {
    return getAllAuctions({ ...options, status: 'COMPLETED' });
};

/**
 * Get auction statistics
 */
const getAuctionStatistics = async (auctionId) => {
    const auction = await prisma.auction.findUnique({
        where: { id: auctionId },
        include: {
            bids: {
                select: {
                    userId: true,
                    amount: true,
                },
            },
            participants: true,
        },
    });

    if (!auction) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Auction not found');
    }

    const uniqueBidders = new Set(auction.bids.map(b => b.userId)).size;
    const totalBids = auction.bids.length;
    const averageBid = totalBids > 0
        ? auction.bids.reduce((sum, b) => sum + parseFloat(b.amount), 0) / totalBids
        : 0;

    return {
        totalParticipants: auction.participants.length,
        totalBids,
        uniqueBidders,
        averageBid,
        highestBid: auction.currentPrice,
        startPrice: auction.startPrice,
    };
};

// ========== User Participation ==========

/**
 * Get user's participated auctions
 */
const getMyAuctions = async (userId, options) => {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    // Get auctions where user has placed bids
    const [auctions, total] = await Promise.all([
        prisma.auction.findMany({
            where: {
                bids: {
                    some: { userId },
                },
            },
            skip,
            take: limit,
            orderBy: { updatedAt: 'desc' },
            include: {
                property: {
                    select: {
                        id: true,
                        title: true,
                        thumbnail: true,
                        address: true,
                        images: true,
                    },
                },
                bids: {
                    where: { userId },
                    orderBy: { amount: 'desc' },
                    take: 1,
                },
                _count: {
                    select: { bids: true },
                },
            },
        }),
        prisma.auction.count({
            where: {
                bids: {
                    some: { userId },
                },
            },
        }),
    ]);

    // Add isWinning flag
    const auctionsWithStatus = auctions.map(auction => ({
        ...auction,
        myBid: auction.bids[0]?.amount || 0,
        isWinning: auction.winnerId === userId ||
            (auction.status === 'ONGOING' && auction.currentPrice === auction.bids[0]?.amount),
    }));

    return {
        data: auctionsWithStatus,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

/**
 * Check if user has paid deposit
 */
const checkDepositStatus = async (auctionId, userId) => {
    const participant = await prisma.auctionParticipant.findUnique({
        where: {
            auctionId_userId: {
                auctionId,
                userId,
            },
        },
    });

    return {
        depositPaid: participant?.depositPaid || false,
        depositTxId: participant?.depositTxId || null,
        registeredAt: participant?.createdAt || null,
    };
};

/**
 * Pay deposit for auction
 * Can be paid during UPCOMING or ONGOING status
 */
const payDeposit = async (auctionId, userId, paymentMethod) => {
    const auction = await prisma.auction.findUnique({
        where: { id: auctionId },
    });

    if (!auction) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Auction not found');
    }

    // Allow deposit payment for UPCOMING or ONGOING auctions
    if (auction.status !== 'UPCOMING' && auction.status !== 'ONGOING') {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            'Deposit can only be paid for upcoming or ongoing auctions'
        );
    }

    // Check if already paid
    const existing = await prisma.auctionParticipant.findUnique({
        where: {
            auctionId_userId: {
                auctionId,
                userId,
            },
        },
    });

    if (existing?.depositPaid) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Deposit already paid');
    }

    // Check if auction has ended
    const now = new Date();
    if (auction.status === 'ONGOING' && new Date(auction.endTime) < now) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Auction has already ended');
    }

    // Get or create wallet
    let wallet = await prisma.wallet.findUnique({
        where: { userId },
    });

    if (!wallet) {
        wallet = await prisma.wallet.create({
            data: { userId, balance: 0 },
        });
    }

    // For VNPAY, MOMO, BLOCKCHAIN - return payment info to create payment URL
    if (paymentMethod === 'VNPAY' || paymentMethod === 'MOMO' || paymentMethod === 'BLOCKCHAIN') {
        // Create pending transaction
        const transaction = await prisma.transaction.create({
            data: {
                walletId: wallet.id,
                type: 'AUCTION_DEPOSIT',
                amount: auction.depositAmount,
                status: 'PENDING',
                paymentMethod,
                description: `Deposit for auction: ${auction.title}`,
                metadata: { auctionId, userId },
            },
        });

        return {
            success: false,
            requiresPayment: true,
            transactionId: transaction.id,
            amount: auction.depositAmount,
            auctionId,
            paymentMethod,
        };
    }

    // For WALLET payment - direct deduction
    if (paymentMethod === 'WALLET') {
        if (parseFloat(wallet.balance) < parseFloat(auction.depositAmount)) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Insufficient balance');
        }

        // Deduct from wallet
        await prisma.wallet.update({
            where: { userId },
            data: {
                balance: {
                    decrement: auction.depositAmount,
                },
            },
        });

        // Create completed transaction
        const transaction = await prisma.transaction.create({
            data: {
                walletId: wallet.id,
                type: 'AUCTION_DEPOSIT',
                amount: auction.depositAmount,
                status: 'COMPLETED',
                paymentMethod: 'WALLET',
                description: `Deposit for auction: ${auction.title}`,
                metadata: { auctionId, userId },
            },
        });

        // Create or update participant
        await prisma.auctionParticipant.upsert({
            where: {
                auctionId_userId: {
                    auctionId,
                    userId,
                },
            },
            create: {
                auctionId,
                userId,
                depositPaid: true,
                depositTxId: transaction.id,
            },
            update: {
                depositPaid: true,
                depositTxId: transaction.id,
            },
        });

        return {
            success: true,
            transactionId: transaction.id,
        };
    }

    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid payment method');
};

/**
 * Register for auction (legacy - same as pay deposit)
 */
const registerAuction = async (auctionId, userId) => {
    return checkDepositStatus(auctionId, userId);
};

// ========== Bidding ==========

/**
 * Place a bid
 * Only allowed during ONGOING status
 */
const placeBid = async (auctionId, userId, amount, isAutoBid = false, maxAmount = null) => {
    const auction = await prisma.auction.findUnique({
        where: { id: auctionId },
        include: {
            participants: {
                where: { userId },
            },
        },
    });

    if (!auction) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Auction not found');
    }

    // CRITICAL: Only allow bidding during ONGOING status
    if (auction.status !== 'ONGOING') {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            auction.status === 'UPCOMING'
                ? 'Auction has not started yet'
                : 'Auction has ended'
        );
    }

    // Check if user has paid deposit
    const participant = auction.participants[0];
    if (!participant?.depositPaid) {
        throw new ApiError(
            StatusCodes.PAYMENT_REQUIRED,
            'Deposit payment required to place bid'
        );
    }

    // Check auction hasn't ended
    const now = new Date();
    if (new Date(auction.endTime) < now) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Auction time has expired');
    }

    // Validate bid amount
    const minBid = parseFloat(auction.currentPrice) + parseFloat(auction.bidStep);
    if (amount < minBid) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            `Minimum bid is ${minBid}`
        );
    }

    // Create bid
    const bid = await prisma.bid.create({
        data: {
            auctionId,
            userId,
            amount,
            isAutoBid,
            maxAmount,
        },
        include: {
            user: {
                select: {
                    id: true,
                    fullName: true,
                    avatar: true,
                },
            },
        },
    });

    // Update auction current price
    await prisma.auction.update({
        where: { id: auctionId },
        data: {
            currentPrice: amount,
        },
    });

    // Emit socket event for real-time update
    emitNewBid(auctionId, {
        bid: {
            id: bid.id,
            amount: bid.amount,
            userId: bid.userId,
            userName: bid.user.fullName,
            createdAt: bid.createdAt,
        },
        auction: {
            id: auctionId,
            currentPrice: amount,
        },
    });

    return bid;
};

/**
 * Get bid history
 */
const getBidHistory = async (auctionId, options) => {
    const { page = 1, limit = 50 } = options;
    const skip = (page - 1) * limit;

    const [bids, total] = await Promise.all([
        prisma.bid.findMany({
            where: { auctionId },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        avatar: true,
                    },
                },
            },
        }),
        prisma.bid.count({ where: { auctionId } }),
    ]);

    return {
        data: bids,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

/**
 * Get auction participants
 */
const getParticipants = async (auctionId) => {
    const participants = await prisma.auctionParticipant.findMany({
        where: {
            auctionId,
            depositPaid: true,
        },
        select: {
            userId: true,
            depositPaid: true,
            createdAt: true,
        },
    });

    return {
        total: participants.length,
        participants,
    };
};

/**
 * Get auction winner
 */
const getWinner = async (auctionId) => {
    const auction = await prisma.auction.findUnique({
        where: { id: auctionId },
        include: {
            bids: {
                orderBy: { amount: 'desc' },
                take: 1,
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                            phone: true,
                            avatar: true,
                        },
                    },
                },
            },
        },
    });

    if (!auction) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Auction not found');
    }

    if (auction.status !== 'COMPLETED') {
        return null;
    }

    const winningBid = auction.bids[0];
    if (!winningBid) {
        return null;
    }

    return {
        auction: {
            id: auction.id,
            title: auction.title,
            finalPrice: auction.currentPrice,
        },
        winner: winningBid.user,
        winningBid: {
            amount: winningBid.amount,
            placedAt: winningBid.createdAt,
        },
    };
};

module.exports = {
    // Public
    getAllAuctions,
    getAuctionById,
    getUpcomingAuctions,
    getOngoingAuctions,
    getCompletedAuctions,
    getAuctionStatistics,

    // User participation
    getMyAuctions,
    checkDepositStatus,
    payDeposit,
    registerAuction,

    // Bidding
    placeBid,
    getBidHistory,
    getParticipants,
    getWinner,
};