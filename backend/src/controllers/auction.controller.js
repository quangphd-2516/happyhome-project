// backend/src/controllers/auction.controller.js
const { StatusCodes } = require('http-status-codes');
const catchAsync = require('../utils/catchAsync');
const { auctionService } = require('../services');
const ApiError = require('../utils/ApiError');

// ========== Public Auction Endpoints ==========

const getAllAuctions = catchAsync(async (req, res) => {
    const { page = 1, limit = 10, status, sortBy = 'startTime:desc' } = req.query;
    const auctions = await auctionService.getAllAuctions({
        page: parseInt(page),
        limit: parseInt(limit),
        status,
        sortBy,
    });
    res.send(auctions);
});

const getAuctionById = catchAsync(async (req, res) => {
    const { auctionId } = req.params;
    const userId = req.user?.id; // Optional for view tracking

    const auction = await auctionService.getAuctionById(auctionId, userId);
    if (!auction) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Auction not found');
    }
    res.send(auction);
});

const getUpcomingAuctions = catchAsync(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const auctions = await auctionService.getUpcomingAuctions({
        page: parseInt(page),
        limit: parseInt(limit),
    });
    res.send(auctions);
});

const getOngoingAuctions = catchAsync(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const auctions = await auctionService.getOngoingAuctions({
        page: parseInt(page),
        limit: parseInt(limit),
    });
    res.send(auctions);
});

const getCompletedAuctions = catchAsync(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const auctions = await auctionService.getCompletedAuctions({
        page: parseInt(page),
        limit: parseInt(limit),
    });
    res.send(auctions);
});

const getAuctionStatistics = catchAsync(async (req, res) => {
    const { auctionId } = req.params;
    const statistics = await auctionService.getAuctionStatistics(auctionId);
    res.send(statistics);
});

// ========== User Auction Participation ==========

const getMyAuctions = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const auctions = await auctionService.getMyAuctions(userId, {
        page: parseInt(page),
        limit: parseInt(limit),
    });
    res.send(auctions);
});

const checkDepositStatus = catchAsync(async (req, res) => {
    const { auctionId } = req.params;
    const userId = req.user.id;

    const status = await auctionService.checkDepositStatus(auctionId, userId);
    res.send(status);
});

const payDeposit = catchAsync(async (req, res) => {
    const { auctionId } = req.params;
    const userId = req.user.id;
    const { paymentMethod } = req.body;

    if (!['VNPAY', 'MOMO', 'BLOCKCHAIN', 'WALLET'].includes(paymentMethod)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid payment method');
    }

    const result = await auctionService.payDeposit(auctionId, userId, paymentMethod);

    // If requires external payment
    if (result.requiresPayment) {
        const ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            '127.0.0.1';

        // VNPay
        if (paymentMethod === 'VNPAY') {
            const { paymentService } = require('../services');

            const paymentUrl = await paymentService.createVNPayPayment({
                userId,
                auctionId,
                amount: parseFloat(result.amount),
                orderId: result.transactionId,
                orderInfo: `Deposit for auction ${auctionId}`,
                ipAddr,
            });

            return res.send({
                success: true,
                requiresPayment: true,
                paymentUrl,
                transactionId: result.transactionId,
            });
        }

        // MoMo - ✅ THÊM MỚI
        if (paymentMethod === 'MOMO') {
            const { paymentService } = require('../services');

            const momoResult = await paymentService.createMoMoPayment({
                userId,
                auctionId,
                amount: parseFloat(result.amount),
                orderId: result.transactionId,
                orderInfo: `Deposit for auction ${auctionId}`,
                ipAddr,
            });

            return res.send({
                success: true,
                requiresPayment: true,
                payUrl: momoResult.payUrl,
                deeplink: momoResult.deeplink,
                qrCodeUrl: momoResult.qrCodeUrl,
                transactionId: result.transactionId,
            });
        }

        // BLOCKCHAIN - chưa implement
        return res.send({
            success: false,
            message: `${paymentMethod} payment not implemented yet`,
        });
    }

    // Direct payment success (WALLET)
    res.send(result);
});

const registerAuction = catchAsync(async (req, res) => {
    const { auctionId } = req.params;
    const userId = req.user.id;

    const result = await auctionService.registerAuction(auctionId, userId);
    res.send(result);
});

// ========== Bidding ==========

const placeBid = catchAsync(async (req, res) => {
    const { auctionId } = req.params;
    const userId = req.user.id;
    const { amount, isAutoBid = false, maxAmount } = req.body;

    const bid = await auctionService.placeBid(
        auctionId,
        userId,
        parseFloat(amount),
        isAutoBid,
        maxAmount ? parseFloat(maxAmount) : null
    );

    res.status(StatusCodes.CREATED).send(bid);
});

const getBidHistory = catchAsync(async (req, res) => {
    const { auctionId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const bids = await auctionService.getBidHistory(auctionId, {
        page: parseInt(page),
        limit: parseInt(limit),
    });
    res.send(bids);
});

const getParticipants = catchAsync(async (req, res) => {
    const { auctionId } = req.params;

    const participants = await auctionService.getParticipants(auctionId);
    res.send(participants);
});

const getWinner = catchAsync(async (req, res) => {
    const { auctionId } = req.params;

    const winner = await auctionService.getWinner(auctionId);
    if (!winner) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Winner not determined yet');
    }
    res.send(winner);
});

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