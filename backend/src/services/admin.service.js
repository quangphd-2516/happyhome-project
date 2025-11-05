// backend/src/services/admin.service.js
const { StatusCodes } = require('http-status-codes');
const prisma = require('../client');
const ApiError = require('../utils/ApiError');

// ==================== KYC Management ====================

/**
 * Get KYC statistics
 * @returns {Promise<Object>}
 */
const getKYCStats = async () => {
    const [total, pending, approved, rejected] = await Promise.all([
        prisma.kYC.count(),
        prisma.kYC.count({ where: { status: 'PENDING' } }),
        prisma.kYC.count({ where: { status: 'APPROVED' } }),
        prisma.kYC.count({ where: { status: 'REJECTED' } })
    ]);

    return { total, pending, approved, rejected };
};

/**
 * Get KYC list with filters
 * @param {Object} filters
 * @returns {Promise<Object>}
 */
const getKYCList = async (filters) => {
    const { status, search, dateFrom, dateTo, page = 1, limit = 10 } = filters;

    const where = {};

    // Status filter
    if (status && status !== 'all') {
        where.status = status;
    }

    // Search filter
    if (search) {
        where.OR = [
            { fullName: { contains: search, mode: 'insensitive' } },
            { idCardNumber: { contains: search } },
            { user: { email: { contains: search, mode: 'insensitive' } } },
            { user: { fullName: { contains: search, mode: 'insensitive' } } }
        ];
    }

    // Date range filter
    if (dateFrom || dateTo) {
        where.createdAt = {};
        if (dateFrom) where.createdAt.gte = new Date(dateFrom);
        if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
        prisma.kYC.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        phone: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        }),
        prisma.kYC.count({ where })
    ]);

    return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
    };
};

/**
 * Get KYC by ID
 * @param {string} kycId
 * @returns {Promise<KYC>}
 */
const getKYCById = async (kycId) => {
    return prisma.kYC.findUnique({
        where: { id: kycId },
        include: {
            user: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    phone: true
                }
            }
        }
    });
};

/**
 * Approve KYC
 * @param {string} kycId
 * @param {string} adminId
 * @returns {Promise<KYC>}
 */
const approveKYC = async (kycId, adminId) => {
    const kyc = await getKYCById(kycId);
    if (!kyc) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'KYC not found');
    }

    if (kyc.status === 'APPROVED') {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'KYC already approved');
    }

    const updatedKYC = await prisma.kYC.update({
        where: { id: kycId },
        data: {
            status: 'APPROVED',
            verifiedBy: adminId,
            verifiedAt: new Date(),
            rejectionReason: null
        }
    });

    // Update user KYC status
    await prisma.user.update({
        where: { id: kyc.userId },
        data: { kycStatus: 'APPROVED' }
    });

    return updatedKYC;
};

/**
 * Reject KYC
 * @param {string} kycId
 * @param {string} adminId
 * @param {string} reason
 * @returns {Promise<KYC>}
 */
const rejectKYC = async (kycId, adminId, reason) => {
    const kyc = await getKYCById(kycId);
    if (!kyc) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'KYC not found');
    }

    const updatedKYC = await prisma.kYC.update({
        where: { id: kycId },
        data: {
            status: 'REJECTED',
            verifiedBy: adminId,
            verifiedAt: new Date(),
            rejectionReason: reason
        }
    });

    // Update user KYC status
    await prisma.user.update({
        where: { id: kyc.userId },
        data: { kycStatus: 'REJECTED' }
    });

    return updatedKYC;
};

/**
 * Bulk approve KYC
 * @param {string[]} kycIds
 * @param {string} adminId
 * @returns {Promise<Object>}
 */
const bulkApproveKYC = async (kycIds, adminId) => {
    const results = {
        success: [],
        failed: []
    };

    for (const kycId of kycIds) {
        try {
            await approveKYC(kycId, adminId);
            results.success.push(kycId);
        } catch (error) {
            results.failed.push({ kycId, error: error.message });
        }
    }

    return results;
};

/**
 * Bulk reject KYC
 * @param {string[]} kycIds
 * @param {string} adminId
 * @param {string} reason
 * @returns {Promise<Object>}
 */
const bulkRejectKYC = async (kycIds, adminId, reason) => {
    const results = {
        success: [],
        failed: []
    };

    for (const kycId of kycIds) {
        try {
            await rejectKYC(kycId, adminId, reason);
            results.success.push(kycId);
        } catch (error) {
            results.failed.push({ kycId, error: error.message });
        }
    }

    return results;
};

// ==================== User Management ====================

/**
 * Get all users with filters
 * @param {Object} filters
 * @returns {Promise<Object>}
 */
const getAllUsers = async (filters) => {
    const { role, kycStatus, isBlocked, isVerified, search, page = 1, limit = 10 } = filters;

    const where = {};

    if (role) where.role = role;
    if (kycStatus) where.kycStatus = kycStatus;
    if (isBlocked !== undefined && isBlocked !== '') where.isBlocked = isBlocked === 'true';
    if (isVerified !== undefined && isVerified !== '') where.isVerified = isVerified === 'true';

    if (search) {
        where.OR = [
            { fullName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search } }
        ];
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
        prisma.user.findMany({
            where,
            select: {
                id: true,
                email: true,
                fullName: true,
                phone: true,
                avatar: true,
                role: true,
                isVerified: true,
                isBlocked: true,
                kycStatus: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        properties: true,
                        auctions: true,
                        favorites: true,
                        reviews: true
                    }
                },
                wallet: {
                    select: {
                        balance: true,
                        _count: {
                            select: { transactions: true }
                        }
                    }
                },
                kycData: {
                    select: {
                        idCardNumber: true,
                        dateOfBirth: true,
                        address: true,
                        status: true,
                        verifiedAt: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        }),
        prisma.user.count({ where })
    ]);

    return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
    };
};

/**
 * Get user by ID
 * @param {string} userId
 * @returns {Promise<User>}
 */
const getUserById = async (userId) => {
    return prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            fullName: true,
            phone: true,
            avatar: true,
            role: true,
            isVerified: true,
            isBlocked: true,
            kycStatus: true,
            createdAt: true,
            updatedAt: true,
            _count: {
                select: {
                    properties: true,
                    auctions: true,
                    favorites: true,
                    reviews: true
                }
            },
            wallet: {
                select: {
                    balance: true,
                    _count: {
                        select: { transactions: true }
                    }
                }
            },
            kycData: true
        }
    });
};

/**
 * Block user
 * @param {string} userId
 * @returns {Promise<User>}
 */
const blockUser = async (userId) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }

    if (user.isBlocked) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'User is already blocked');
    }

    return prisma.user.update({
        where: { id: userId },
        data: { isBlocked: true }
    });
};

/**
 * Unblock user
 * @param {string} userId
 * @returns {Promise<User>}
 */
const unblockUser = async (userId) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }

    if (!user.isBlocked) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'User is not blocked');
    }

    return prisma.user.update({
        where: { id: userId },
        data: { isBlocked: false }
    });
};

// ========== Auction Management ==========

/**
 * Get all auctions with filters and pagination
 * @param {Object} options
 * @returns {Promise<Object>}
 */
const getAllAuctions = async (options) => {
    const { page = 1, limit = 10, status, propertyId, sortBy = 'createdAt:desc' } = options;

    const skip = (page - 1) * limit;
    const [field, order] = sortBy.split(':');

    const where = {};
    // Only filter by a specific status when it is not 'all'
    if (status && status !== 'all') where.status = status;
    if (propertyId) where.propertyId = propertyId;

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
                        address: true,
                        thumbnail: true,
                        type: true,
                    },
                },
                creator: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                    },
                },
                bids: {
                    select: {
                        id: true,
                        amount: true,
                        userId: true,
                        createdAt: true,
                    },
                    orderBy: { amount: 'desc' },
                    take: 1,
                },
                participants: {
                    select: {
                        id: true,
                        userId: true,
                        depositPaid: true,
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
 * Get auction by ID
 * @param {string} auctionId
 * @returns {Promise<Auction>}
 */
const getAuctionById = async (auctionId) => {
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
                        },
                    },
                },
            },
            creator: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    role: true,
                },
            },
            bids: {
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            },
            participants: {
                include: {
                    auction: {
                        select: {
                            id: true,
                            title: true,
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

    return auction;
};

/**
 * Create auction
 * @param {string} adminId
 * @param {Object} auctionData
 * @returns {Promise<Auction>}
 */
const createAuction = async (adminId, auctionData) => {
    const {
        propertyId,
        title,
        description,
        startPrice,
        bidStep,
        depositAmount,
        startTime,
        endTime,
    } = auctionData;

    // Validate property exists and is published
    const property = await prisma.property.findUnique({
        where: { id: propertyId },
    });

    if (!property) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Property not found');
    }

    if (property.status !== 'PUBLISHED') {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Property must be published to create auction');
    }

    // Check if property already has an active auction
    const existingAuction = await prisma.auction.findFirst({
        where: {
            propertyId,
            status: {
                in: ['UPCOMING', 'ONGOING'],
            },
        },
    });

    if (existingAuction) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Property already has an active auction');
    }

    // Validate times
    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    if (start < now) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Start time must be in the future');
    }

    if (end <= start) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'End time must be after start time');
    }

    // Create auction
    const auction = await prisma.auction.create({
        data: {
            propertyId,
            createdBy: adminId,
            title,
            description,
            startPrice,
            bidStep,
            depositAmount,
            startTime: start,
            endTime: end,
            currentPrice: startPrice,
            status: 'UPCOMING',
        },
        include: {
            property: {
                select: {
                    id: true,
                    title: true,
                    address: true,
                },
            },
            creator: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                },
            },
        },
    });

    return auction;
};

/**
 * Update auction
 * @param {string} auctionId
 * @param {Object} updateData
 * @returns {Promise<Auction>}
 */
const updateAuction = async (auctionId, updateData) => {
    const auction = await prisma.auction.findUnique({
        where: { id: auctionId },
    });

    if (!auction) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Auction not found');
    }

    // Cannot update ongoing or completed auctions
    if (auction.status === 'ONGOING') {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Cannot update ongoing auction');
    }

    if (auction.status === 'COMPLETED') {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Cannot update completed auction');
    }

    if (auction.status === 'CANCELLED') {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Cannot update cancelled auction');
    }

    // Validate times if provided
    if (updateData.startTime || updateData.endTime) {
        const start = new Date(updateData.startTime || auction.startTime);
        const end = new Date(updateData.endTime || auction.endTime);
        const now = new Date();

        if (start < now) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Start time must be in the future');
        }

        if (end <= start) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'End time must be after start time');
        }
    }

    const updatedAuction = await prisma.auction.update({
        where: { id: auctionId },
        data: {
            ...updateData,
            startTime: updateData.startTime ? new Date(updateData.startTime) : undefined,
            endTime: updateData.endTime ? new Date(updateData.endTime) : undefined,
        },
        include: {
            property: {
                select: {
                    id: true,
                    title: true,
                    address: true,
                },
            },
            creator: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                },
            },
        },
    });

    return updatedAuction;
};

/**
 * Cancel auction
 * @param {string} auctionId
 * @param {string} reason
 * @returns {Promise<Auction>}
 */
const cancelAuction = async (auctionId, reason) => {
    const auction = await prisma.auction.findUnique({
        where: { id: auctionId },
        include: {
            participants: true,
        },
    });

    if (!auction) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Auction not found');
    }

    if (auction.status === 'COMPLETED') {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Cannot cancel completed auction');
    }

    if (auction.status === 'CANCELLED') {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Auction already cancelled');
    }

    // Update auction status
    const updatedAuction = await prisma.auction.update({
        where: { id: auctionId },
        data: {
            status: 'CANCELLED',
        },
    });

    // TODO: Refund deposits to all participants
    // This should be handled by a separate transaction service

    return updatedAuction;
};

/**
 * Get auction results
 * @param {string} auctionId
 * @returns {Promise<Object>}
 */
const getAuctionResults = async (auctionId) => {
    const auction = await prisma.auction.findUnique({
        where: { id: auctionId },
        include: {
            property: {
                select: {
                    id: true,
                    title: true,
                    address: true,
                    thumbnail: true,
                },
            },
            bids: {
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                        },
                    },
                },
                orderBy: { amount: 'desc' },
            },
            participants: {
                select: {
                    userId: true,
                    depositPaid: true,
                    isRefunded: true,
                },
            },
        },
    });

    if (!auction) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Auction not found');
    }

    // Get winner info if exists
    let winner = null;
    if (auction.winnerId) {
        winner = await prisma.user.findUnique({
            where: { id: auction.winnerId },
            select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
            },
        });
    }

    // Calculate statistics
    const totalBids = auction.bids.length;
    const uniqueBidders = new Set(auction.bids.map(bid => bid.userId)).size;
    const totalParticipants = auction.participants.length;

    return {
        auction: {
            id: auction.id,
            title: auction.title,
            status: auction.status,
            startPrice: auction.startPrice,
            currentPrice: auction.currentPrice,
            startTime: auction.startTime,
            endTime: auction.endTime,
            property: auction.property,
        },
        winner,
        statistics: {
            totalBids,
            uniqueBidders,
            totalParticipants,
            highestBid: auction.currentPrice,
        },
        bids: auction.bids,
        participants: auction.participants,
    };
};

/**
 * Get auction statistics
 * @returns {Promise<Object>}
 */
const getAuctionStatistics = async () => {
    const [
        totalAuctions,
        upcomingAuctions,
        ongoingAuctions,
        completedAuctions,
        cancelledAuctions,
    ] = await Promise.all([
        prisma.auction.count(),
        prisma.auction.count({ where: { status: 'UPCOMING' } }),
        prisma.auction.count({ where: { status: 'ONGOING' } }),
        prisma.auction.count({ where: { status: 'COMPLETED' } }),
        prisma.auction.count({ where: { status: 'CANCELLED' } }),
    ]);

    // Get total bids and participants
    const [totalBids, totalParticipants] = await Promise.all([
        prisma.bid.count(),
        prisma.auctionParticipant.count(),
    ]);

    return {
        totalAuctions,
        upcomingAuctions,
        ongoingAuctions,
        completedAuctions,
        cancelledAuctions,
        totalBids,
        totalParticipants,
    };
};

// ========== Property Management ==========

/**
 * Get all properties with filters and pagination
 * @param {Object} options
 * @returns {Promise<Object>}
 */
const getAllProperties = async (options) => {
    const { page = 1, limit = 10, status, type, city, district, sortBy = 'createdAt:desc' } = options;

    const skip = (page - 1) * limit;
    const [field, order] = sortBy.split(':');

    const where = {};

    // ✅ Chỉ lọc theo status khi khác 'all'
    if (status && status !== 'all') {
        where.status = status;
    }
    if (type) where.type = type;
    if (city) where.city = city;
    if (district) where.district = district;

    const [properties, total] = await Promise.all([
        prisma.property.findMany({
            where,
            skip,
            take: limit,
            orderBy: { [field]: order || 'desc' },
            include: {
                owner: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        phone: true,
                        kycStatus: true,
                    },
                },
                auctions: {
                    select: {
                        id: true,
                        status: true,
                        startTime: true,
                        endTime: true,
                        currentPrice: true,
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
                _count: {
                    select: {
                        auctions: true,
                        favorites: true,
                        reviews: true,
                    },
                },
            },
        }),
        prisma.property.count({ where }),
    ]);

    return {
        data: properties,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

module.exports = {
    // KYC Management
    getKYCStats,
    getKYCList,
    getKYCById,
    approveKYC,
    rejectKYC,
    bulkApproveKYC,
    bulkRejectKYC,
    // User Management
    getAllUsers,
    getUserById,
    blockUser,
    unblockUser,
    // Auction Management
    getAllAuctions,
    getAuctionById,
    createAuction,
    updateAuction,
    cancelAuction,
    getAuctionResults,
    getAuctionStatistics,
    // Property Management
    getAllProperties,
};