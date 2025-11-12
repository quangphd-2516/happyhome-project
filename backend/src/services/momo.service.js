// backend/src/services/momo.service.js
const crypto = require('crypto');
const axios = require('axios');
const momoConfig = require('../config/momo.config');

/**
 * Create MoMo payment request
 * @param {Object} paymentData
 * @returns {Promise<Object>} { payUrl, orderId }
 */
const createPaymentRequest = async (paymentData) => {
    const {
        orderId,
        amount,
        orderInfo,
        redirectUrl,
        ipnUrl,
        extraData = '',
    } = paymentData;

    // Prepare request data
    const requestId = `${orderId}-${Date.now()}`;
    const orderIdStr = String(orderId);
    const amountStr = String(Math.round(amount)); // MoMo requires integer
    const orderInfoStr = String(orderInfo || 'Auction deposit payment');

    // Build raw signature
    const rawSignature = `accessKey=${momoConfig.accessKey}&amount=${amountStr}&extraData=${extraData}&ipnUrl=${ipnUrl || momoConfig.notifyUrl}&orderId=${orderIdStr}&orderInfo=${orderInfoStr}&partnerCode=${momoConfig.partnerCode}&redirectUrl=${redirectUrl || momoConfig.returnUrl}&requestId=${requestId}&requestType=${momoConfig.requestType}`;

    console.log('🔐 MoMo Signature Data:');
    console.log('- Raw Signature:', rawSignature);

    // Create signature
    const signature = crypto
        .createHmac('sha256', momoConfig.secretKey)
        .update(rawSignature)
        .digest('hex');

    console.log('- Signature:', signature.substring(0, 30) + '...');

    // Request body
    const requestBody = {
        partnerCode: momoConfig.partnerCode,
        accessKey: momoConfig.accessKey,
        requestId,
        amount: amountStr,
        orderId: orderIdStr,
        orderInfo: orderInfoStr,
        redirectUrl: redirectUrl || momoConfig.returnUrl,
        ipnUrl: ipnUrl || momoConfig.notifyUrl,
        extraData,
        requestType: momoConfig.requestType,
        signature,
        lang: 'en',
    };

    console.log('💳 Creating MoMo payment:');
    console.log('- Order ID:', orderIdStr);
    console.log('- Amount:', amountStr, 'VND');
    console.log('- Request ID:', requestId);
    console.log('- Endpoint:', momoConfig.endpoint);

    try {
        // Send request to MoMo
        const response = await axios.post(momoConfig.endpoint, requestBody, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log('✅ MoMo Response:', response.data);

        if (response.data.resultCode === 0) {
            return {
                success: true,
                payUrl: response.data.payUrl,
                orderId: orderIdStr,
                requestId,
                deeplink: response.data.deeplink, // For mobile app
                qrCodeUrl: response.data.qrCodeUrl, // For QR payment
            };
        } else {
            console.error('❌ MoMo Error:', response.data);
            return {
                success: false,
                message: response.data.message || 'Payment request failed',
                resultCode: response.data.resultCode,
            };
        }
    } catch (error) {
        console.error('❌ MoMo API Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'MoMo payment request failed');
    }
};

/**
 * Verify MoMo IPN/Return signature
 * @param {Object} momoData
 * @returns {Object} { success: boolean, message: string, data: object }
 */
const verifySignature = (momoData) => {
    console.log('🔍 Verifying MoMo signature...');
    console.log('- Order ID:', momoData.orderId);
    console.log('- Result Code:', momoData.resultCode);
    console.log('- Amount:', momoData.amount);

    const {
        partnerCode,
        orderId,
        requestId,
        amount,
        orderInfo,
        orderType,
        transId,
        resultCode,
        message,
        payType,
        responseTime,
        extraData,
        signature,
    } = momoData;

    // Build raw signature for verification
    const rawSignature = `accessKey=${momoConfig.accessKey}&amount=${amount}&extraData=${extraData || ''}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType || ''}&partnerCode=${partnerCode}&payType=${payType || ''}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

    console.log('- Raw Signature:', rawSignature);

    // Create signature
    const calculatedSignature = crypto
        .createHmac('sha256', momoConfig.secretKey)
        .update(rawSignature)
        .digest('hex');

    console.log('- Expected Signature:', calculatedSignature.substring(0, 30) + '...');
    console.log('- Received Signature:', signature.substring(0, 30) + '...');
    console.log('- Signature Match:', signature === calculatedSignature ? '✅' : '❌');

    // Verify signature
    if (signature !== calculatedSignature) {
        console.error('❌ Signature verification failed!');
        return {
            success: false,
            message: 'Invalid signature',
            data: null,
        };
    }

    // Check result code
    if (resultCode === 0 || resultCode === '0') {
        console.log('✅ Payment successful!');
        return {
            success: true,
            message: 'Payment successful',
            data: {
                orderId,
                requestId,
                amount: parseFloat(amount),
                transId,
                payType,
                responseTime,
            },
        };
    }

    // Payment failed
    console.error('❌ Payment failed with code:', resultCode);
    return {
        success: false,
        message: message || getResultMessage(resultCode),
        data: {
            orderId,
            resultCode,
        },
    };
};

/**
 * Get result message by code
 */
function getResultMessage(code) {
    const messages = {
        0: 'Successful',
        9000: 'Transaction confirmed',
        8000: 'Transaction under processing',
        7000: 'Transaction timeout',
        7002: 'Transaction rejected by bank',
        1000: 'Transaction initiated',
        11: 'Access denied',
        12: 'Version not supported',
        13: 'Merchant authentication failed',
        20: 'Bad request',
        21: 'Invalid amount',
        40: 'RequestId not found',
        41: 'OrderId not found',
        42: 'OrderId already exists',
        43: 'Invalid request ID',
        1001: 'Transaction failed',
        1002: 'Transaction failed (Customer)',
        1003: 'Transaction cancelled',
        1004: 'Transaction failed (Insufficient balance)',
        1005: 'Transaction failed (URL expired)',
        1006: 'Transaction failed (Account not found)',
        1007: 'Transaction rejected',
        2001: 'Invalid card/account',
        3001: 'Payment account not linked',
        3002: 'Invalid card information',
        3003: 'Payment account locked',
        3004: 'OTP expired',
        3005: 'Invalid OTP',
        3006: 'Transaction limit exceeded',
        4001: 'Transaction failed (System)',
        4010: 'Invalid merchant',
        4011: 'Invalid access key',
        4100: 'Transaction declined (Risk)',
    };
    return messages[code] || `Unknown error (Code: ${code})`;
}

module.exports = {
    createPaymentRequest,
    verifySignature,
};