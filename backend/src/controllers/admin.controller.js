// backend/src/controllers/admin.controller.js
const { StatusCodes } = require('http-status-codes');
const catchAsync = require('../utils/catchAsync');
const { adminService } = require('../services');
const ApiError = require('../utils/ApiError');

// ==================== Dashboard ====================

const getDashboardStats = catchAsync(async (req, res) => {
    const stats = await adminService.getDashboardStats();
    res.send(stats);
});

const getRevenueData = catchAsync(async (req, res) => {
    const { period = '7days' } = req.query;
    const data = await adminService.getRevenueData(period);
    res.send(data);
});

const getUserGrowthData = catchAsync(async (req, res) => {
    const { period = '7days' } = req.query;
    const data = await adminService.getUserGrowthData(period);
    res.send(data);
});

const getRecentActivities = catchAsync(async (req, res) => {
    const { limit = 10 } = req.query;
    const data = await adminService.getRecentActivities(limit);
    res.send(data);
});

// ==================== KYC Management ====================

const getKYCStats = catchAsync(async (req, res) => {
    const stats = await adminService.getKYCStats();
    res.send(stats);
});

const getKYCList = catchAsync(async (req, res) => {
    const filters = {
        status: req.query.status,
        search: req.query.search,
        dateFrom: req.query.dateFrom,
        dateTo: req.query.dateTo,
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10
    };

    const result = await adminService.getKYCList(filters);
    res.send(result);
});

const getPendingKYC = catchAsync(async (req, res) => {
    const filters = {
        ...req.query,
        status: 'PENDING'
    };

    const result = await adminService.getKYCList(filters);
    res.send(result);
});

const getKYCById = catchAsync(async (req, res) => {
    const kyc = await adminService.getKYCById(req.params.kycId);
    if (!kyc) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'KYC not found');
    }
    res.send(kyc);
});

const approveKYC = catchAsync(async (req, res) => {
    const adminId = req.user.id;
    const kyc = await adminService.approveKYC(req.params.kycId, adminId);
    res.send(kyc);
});

const rejectKYC = catchAsync(async (req, res) => {
    const adminId = req.user.id;
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Rejection reason is required');
    }

    const kyc = await adminService.rejectKYC(req.params.kycId, adminId, reason);
    res.send(kyc);
});

const bulkApproveKYC = catchAsync(async (req, res) => {
    const adminId = req.user.id;
    const { kycIds } = req.body;

    if (!kycIds || !Array.isArray(kycIds) || kycIds.length === 0) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'KYC IDs array is required');
    }

    const result = await adminService.bulkApproveKYC(kycIds, adminId);
    res.send(result);
});

const bulkRejectKYC = catchAsync(async (req, res) => {
    const adminId = req.user.id;
    const { kycIds, reason } = req.body;

    if (!kycIds || !Array.isArray(kycIds) || kycIds.length === 0) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'KYC IDs array is required');
    }

    if (!reason || !reason.trim()) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Rejection reason is required');
    }

    const result = await adminService.bulkRejectKYC(kycIds, adminId, reason);
    res.send(result);
});

// ==================== User Management ====================

const getAllUsers = catchAsync(async (req, res) => {
    const filters = {
        role: req.query.role,
        kycStatus: req.query.kycStatus,
        isBlocked: req.query.isBlocked,
        isVerified: req.query.isVerified,
        search: req.query.search,
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10
    };

    const result = await adminService.getAllUsers(filters);
    res.send(result);
});

const getUserById = catchAsync(async (req, res) => {
    const user = await adminService.getUserById(req.params.userId);
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }
    res.send(user);
});

const blockUser = catchAsync(async (req, res) => {
    const user = await adminService.blockUser(req.params.userId);
    res.send({ message: 'User blocked successfully', user });
});

const unblockUser = catchAsync(async (req, res) => {
    const user = await adminService.unblockUser(req.params.userId);
    res.send({ message: 'User unblocked successfully', user });
});
// ========== Auction Management ==========

const getAllAuctions = catchAsync(async (req, res) => {
    const { page = 1, limit = 10, status, propertyId, sortBy = 'createdAt:desc' } = req.query;
    const auctions = await adminService.getAllAuctions({
        page: parseInt(page),
        limit: parseInt(limit),
        status,
        propertyId,
        sortBy,
    });
    res.send(auctions);
});

const getAuctionById = catchAsync(async (req, res) => {
    const { auctionId } = req.params;
    const auction = await adminService.getAuctionById(auctionId);
    if (!auction) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Auction not found');
    }
    res.send(auction);
});

const createAuction = catchAsync(async (req, res) => {
    const adminId = req.user.id;
    const auction = await adminService.createAuction(adminId, req.body);
    res.status(StatusCodes.CREATED).send(auction);
});

const updateAuction = catchAsync(async (req, res) => {
    const { auctionId } = req.params;
    const auction = await adminService.updateAuction(auctionId, req.body);
    res.send(auction);
});

const cancelAuction = catchAsync(async (req, res) => {
    const { auctionId } = req.params;
    const { reason } = req.body;
    const auction = await adminService.cancelAuction(auctionId, reason);
    res.send(auction);
});

const getAuctionResults = catchAsync(async (req, res) => {
    const { auctionId } = req.params;
    const results = await adminService.getAuctionResults(auctionId);
    res.send(results);
});

const getAuctionStatistics = catchAsync(async (req, res) => {
    const stats = await adminService.getAuctionStatistics();
    res.send(stats);
});

// ========== Property Management ==========

const getAllProperties = catchAsync(async (req, res) => {
    const { page = 1, limit = 10, status, type, city, district, sortBy = 'createdAt:desc' } = req.query;
    const properties = await adminService.getAllProperties({
        page: parseInt(page),
        limit: parseInt(limit),
        status,
        type,
        city,
        district,
        sortBy,
    });
    res.send(properties);
});
module.exports = {
    // Dashboard
    getDashboardStats,
    getRevenueData,
    getUserGrowthData,
    getRecentActivities,
    // KYC Management
    getKYCStats,
    getKYCList,
    getPendingKYC,
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