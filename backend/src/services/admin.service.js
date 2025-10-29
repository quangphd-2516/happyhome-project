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
};