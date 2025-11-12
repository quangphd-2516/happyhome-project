// backend/src/controllers/payment.controller.js
const { StatusCodes } = require('http-status-codes');
const catchAsync = require('../utils/catchAsync');
const { paymentService } = require('../services');
const ApiError = require('../utils/ApiError');

/**
 * Create VNPay payment URL
 */
const createVNPayPayment = catchAsync(async (req, res) => {
    console.log('==============================================');
    console.log('BẠN ĐANG CHẠY CODE MỚI TINH (CONTROLLER) 100%');
    console.log('==============================================');
    const { auctionId, amount, orderId, orderInfo } = req.body;
    const userId = req.user.id;
    // Tạm thời comment đoạn code cũ lại khi test trên localhost
    // const ipAddr = req.headers['x-forwarded-for'] ||
    //     req.connection.remoteAddress ||
    //     req.socket.remoteAddress ||
    //     '127.0.0.1';

    // ⚠️ FIX TẠM THỜI: Gán cứng IP public để test VNPAY Sandbox
    const ipAddr = '118.69.172.162'; // (Đây là một IP public ngẫu nhiên, bạn dùng IP này là được)

    const paymentUrl = await paymentService.createVNPayPayment({
        userId,
        auctionId,
        amount,
        orderId,
        orderInfo,
        ipAddr,
    });

    res.send({
        success: true,
        paymentUrl,
    });
});

/**
 * Handle VNPay return (IPN - Instant Payment Notification)
 */
const vnpayReturn = catchAsync(async (req, res) => {
    const vnp_Params = req.query;

    const result = await paymentService.handleVNPayReturn(vnp_Params);

    if (result.success) {
        res.send({
            success: true,
            message: 'Payment successful',
            data: result.data,
        });
    } else {
        throw new ApiError(StatusCodes.BAD_REQUEST, result.message);
    }
});

/**
 * Handle VNPay IPN (backend notification)
 */
const vnpayIPN = catchAsync(async (req, res) => {
    const vnp_Params = req.query;

    const result = await paymentService.handleVNPayIPN(vnp_Params);

    if (result.success) {
        res.send({
            RspCode: '00',
            Message: 'success',
        });
    } else {
        res.send({
            RspCode: '97',
            Message: result.message,
        });
    }
});
/**
 * Create MoMo payment URL
 */
const createMoMoPayment = catchAsync(async (req, res) => {
    console.log('==============================================');
    console.log('📱 CREATING MOMO PAYMENT (CONTROLLER)');
    console.log('==============================================');

    const { auctionId, amount, orderId, orderInfo } = req.body;
    const userId = req.user.id;

    const ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        '127.0.0.1';

    const result = await paymentService.createMoMoPayment({
        userId,
        auctionId,
        amount,
        orderId,
        orderInfo,
        ipAddr,
    });

    res.send({
        success: true,
        payUrl: result.payUrl,
        orderId: result.orderId,
        deeplink: result.deeplink,
        qrCodeUrl: result.qrCodeUrl,
    });
});

/**
 * Handle MoMo return (user redirect)
 */
const momoReturn = catchAsync(async (req, res) => {
    const momoParams = req.query;

    const result = await paymentService.handleMoMoReturn(momoParams);

    if (result.success) {
        res.send({
            success: true,
            message: 'Payment successful',
            data: result.data,
        });
    } else {
        throw new ApiError(StatusCodes.BAD_REQUEST, result.message);
    }
});

/**
 * Handle MoMo IPN (backend notification)
 */
const momoIPN = catchAsync(async (req, res) => {
    const momoParams = req.body; // MoMo sends POST request

    const result = await paymentService.handleMoMoIPN(momoParams);

    if (result.success) {
        res.send({
            status: 0,
            message: 'success',
        });
    } else {
        res.send({
            status: -1,
            message: result.message,
        });
    }
});

module.exports = {
    createVNPayPayment,
    vnpayReturn,
    vnpayIPN,

    createMoMoPayment,
    momoReturn,
    momoIPN,
};