// backend/src/services/payment.service.js
const { StatusCodes } = require('http-status-codes');
const prisma = require('../client');
const ApiError = require('../utils/ApiError');
const vnpayService = require('./vnpay.service');
const momoService = require('./momo.service');

/**
 * Create VNPay payment URL for auction deposit
 */
const createVNPayPayment = async (paymentData) => {
    const { userId, auctionId, amount, orderId, orderInfo, ipAddr } = paymentData;

    console.log('💳 Creating VNPay payment:');
    console.log('- User ID:', userId);
    console.log('- Auction ID:', auctionId);
    console.log('- Amount (input):', amount, 'VND');

    // Verify auction exists
    const auction = await prisma.auction.findUnique({
        where: { id: auctionId },
    });

    if (!auction) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Auction not found');
    }

    // Check if user already paid deposit
    const existingParticipant = await prisma.auctionParticipant.findUnique({
        where: {
            auctionId_userId: {
                auctionId,
                userId,
            },
        },
    });

    if (existingParticipant?.depositPaid) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Deposit already paid');
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

    // ✅ CRITICAL: Amount must NOT be multiplied here
    // vnpayService.createPaymentUrl will multiply by 100
    const depositAmount = parseFloat(amount);

    console.log('💰 Deposit amount:', depositAmount, 'VND (will be sent to VNPay as-is)');

    // Create transaction record
    const transaction = await prisma.transaction.create({
        data: {
            walletId: wallet.id,
            type: 'AUCTION_DEPOSIT',
            amount: depositAmount, // ✅ Store original amount
            status: 'PENDING',
            paymentMethod: 'VNPAY',
            paymentRef: orderId,
            description: orderInfo || `Deposit for auction: ${auction.title}`,
            metadata: {
                auctionId,
                userId,
            },
        },
    });

    console.log('📝 Transaction created:', transaction.id);

    // ✅ Generate VNPay payment URL with ORIGINAL amount
    const paymentUrl = vnpayService.createPaymentUrl({
        amount: depositAmount, // ✅ Original amount (not multiplied)
        orderId: transaction.id, // Use transaction ID
        orderInfo: orderInfo || `Deposit for auction ${auctionId}`,
        ipAddr,
    });

    console.log('✅ Payment URL created successfully');

    return paymentUrl;
};

/**
 * Handle VNPay return (from user redirect)
 */
const handleVNPayReturn = async (vnp_Params) => {
    console.log('🔄 Handling VNPay return...');

    // Verify signature
    const verifyResult = vnpayService.verifyReturnUrl(vnp_Params);

    if (!verifyResult.success) {
        console.error('❌ Signature verification failed:', verifyResult.message);
        return verifyResult;
    }

    console.log('✅ Signature verified');

    // Get transaction by ID (orderId is transaction.id)
    const transactionId = verifyResult.data.orderId;
    const transaction = await prisma.transaction.findUnique({
        where: { id: transactionId },
        include: {
            wallet: {
                include: {
                    user: true,
                },
            },
        },
    });

    if (!transaction) {
        console.error('❌ Transaction not found:', transactionId);
        return {
            success: false,
            message: 'Transaction not found',
        };
    }

    console.log('📝 Transaction found:', transaction.id);
    console.log('- Status:', transaction.status);
    console.log('- Amount:', transaction.amount, 'VND');

    // Check if already processed
    if (transaction.status === 'COMPLETED') {
        console.log('⚠️ Transaction already processed');
        return {
            success: true,
            message: 'Payment already processed',
            data: {
                transactionId: transaction.id,
                auctionId: transaction.metadata.auctionId,
            },
        };
    }

    // Update transaction
    await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
            status: 'COMPLETED',
            paymentRef: verifyResult.data.transactionNo,
            metadata: {
                ...transaction.metadata,
                bankCode: verifyResult.data.bankCode,
                bankTranNo: verifyResult.data.bankTranNo,
                cardType: verifyResult.data.cardType,
                payDate: verifyResult.data.payDate,
            },
        },
    });

    console.log('✅ Transaction updated to COMPLETED');

    // Create or update auction participant
    const auctionId = transaction.metadata.auctionId;
    const userId = transaction.metadata.userId;

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

    console.log('✅ Auction participant created/updated');

    // Send notification to user
    await prisma.notification.create({
        data: {
            userId,
            title: 'Deposit Payment Successful',
            message: `Your deposit payment for auction has been confirmed. You can now participate in the auction.`,
            type: 'PAYMENT',
            link: `/auctions/${auctionId}`,
        },
    });

    console.log('✅ Notification sent');

    return {
        success: true,
        message: 'Payment successful',
        data: {
            transactionId: transaction.id,
            auctionId,
            amount: transaction.amount,
        },
    };
};

/**
 * Handle VNPay IPN (backend notification)
 */
const handleVNPayIPN = async (vnp_Params) => {
    // Same logic as handleVNPayReturn but for backend notification
    return handleVNPayReturn(vnp_Params);
};
/**
 * Create MoMo payment URL for auction deposit
 */
const createMoMoPayment = async (paymentData) => {
    const { userId, auctionId, amount, orderId, orderInfo, ipAddr } = paymentData;

    console.log('💳 Creating MoMo payment:');
    console.log('- User ID:', userId);
    console.log('- Auction ID:', auctionId);
    console.log('- Amount (input):', amount, 'VND');

    // Verify auction exists
    const auction = await prisma.auction.findUnique({
        where: { id: auctionId },
    });

    if (!auction) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Auction not found');
    }

    // Check if user already paid deposit
    const existingParticipant = await prisma.auctionParticipant.findUnique({
        where: {
            auctionId_userId: {
                auctionId,
                userId,
            },
        },
    });

    if (existingParticipant?.depositPaid) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Deposit already paid');
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

    const depositAmount = parseFloat(amount);

    console.log('💰 Deposit amount:', depositAmount, 'VND');

    // Create transaction record
    const transaction = await prisma.transaction.create({
        data: {
            walletId: wallet.id,
            type: 'AUCTION_DEPOSIT',
            amount: depositAmount,
            status: 'PENDING',
            paymentMethod: 'MOMO',
            paymentRef: orderId,
            description: orderInfo || `Deposit for auction: ${auction.title}`,
            metadata: {
                auctionId,
                userId,
            },
        },
    });

    console.log('📝 Transaction created:', transaction.id);

    // Generate MoMo payment URL
    const paymentResult = await momoService.createPaymentRequest({
        orderId: transaction.id,
        amount: depositAmount,
        orderInfo: orderInfo || `Deposit for auction ${auctionId}`,
    });

    if (!paymentResult.success) {
        throw new ApiError(StatusCodes.BAD_REQUEST, paymentResult.message);
    }

    console.log('✅ Payment URL created successfully');

    return {
        payUrl: paymentResult.payUrl,
        orderId: transaction.id,
        deeplink: paymentResult.deeplink,
        qrCodeUrl: paymentResult.qrCodeUrl,
    };
};

/**
 * Handle MoMo return (from user redirect)
 */
const handleMoMoReturn = async (momoParams) => {
    console.log('🔄 Handling MoMo return...');

    // Verify signature
    const verifyResult = momoService.verifySignature(momoParams);

    if (!verifyResult.success) {
        console.error('❌ Signature verification failed:', verifyResult.message);
        return verifyResult;
    }

    console.log('✅ Signature verified');

    // Get transaction by ID (orderId is transaction.id)
    const transactionId = verifyResult.data.orderId;
    const transaction = await prisma.transaction.findUnique({
        where: { id: transactionId },
        include: {
            wallet: {
                include: {
                    user: true,
                },
            },
        },
    });

    if (!transaction) {
        console.error('❌ Transaction not found:', transactionId);
        return {
            success: false,
            message: 'Transaction not found',
        };
    }

    console.log('📝 Transaction found:', transaction.id);
    console.log('- Status:', transaction.status);
    console.log('- Amount:', transaction.amount, 'VND');

    // Check if already processed
    if (transaction.status === 'COMPLETED') {
        console.log('⚠️ Transaction already processed');
        return {
            success: true,
            message: 'Payment already processed',
            data: {
                transactionId: transaction.id,
                auctionId: transaction.metadata.auctionId,
            },
        };
    }

    // Update transaction
    await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
            status: 'COMPLETED',
            paymentRef: verifyResult.data.transId,
            metadata: {
                ...transaction.metadata,
                transId: verifyResult.data.transId,
                payType: verifyResult.data.payType,
                responseTime: verifyResult.data.responseTime,
            },
        },
    });

    console.log('✅ Transaction updated to COMPLETED');

    // Create or update auction participant
    const auctionId = transaction.metadata.auctionId;
    const userId = transaction.metadata.userId;

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

    console.log('✅ Auction participant created/updated');

    // Send notification to user
    await prisma.notification.create({
        data: {
            userId,
            title: 'Deposit Payment Successful',
            message: `Your MoMo deposit payment for auction has been confirmed. You can now participate in the auction.`,
            type: 'PAYMENT',
            link: `/auctions/${auctionId}`,
        },
    });

    console.log('✅ Notification sent');

    return {
        success: true,
        message: 'Payment successful',
        data: {
            transactionId: transaction.id,
            auctionId,
            amount: transaction.amount,
        },
    };
};

/**
 * Handle MoMo IPN (backend notification)
 */
const handleMoMoIPN = async (momoParams) => {
    // Same logic as handleMoMoReturn but for backend notification
    return handleMoMoReturn(momoParams);
};

module.exports = {
    createVNPayPayment,
    handleVNPayReturn,
    handleVNPayIPN,
    createMoMoPayment,
    handleMoMoReturn,
    handleMoMoIPN,
};