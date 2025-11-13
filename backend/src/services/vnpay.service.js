// backend/src/services/vnpay.service.js
const crypto = require('crypto');
const querystring = require('qs');
const vnpayConfig = require('../config/vnpay.config');

/**
 * Create VNPay payment URL
 * @param {Object} paymentData
 * @returns {string} Payment URL
 */
const createPaymentUrl = (paymentData) => {
    const {
        amount,
        orderId,
        orderInfo,
        orderType = 'billpayment',
        ipAddr,
        locale = 'vn',
        bankCode = '',
    } = paymentData;

    const date = new Date();
    const createDate = formatDate(date);
    const expireDate = formatDate(new Date(date.getTime() + 15 * 60 * 1000)); // 15 minutes

    // VNPAY requires orderId to be alphanumeric, max 100 chars
    // Convert UUID to shorter format (remove dashes)
    const vnp_TxnRef = String(orderId).replace(/-/g, '').substring(0, 100);

    // VNPAY requires orderInfo to be max 255 chars
    const vnp_OrderInfo = String(orderInfo || '').substring(0, 255);

    // ✅ CRITICAL FIX: Amount must be in VND (not multiplied yet)
    // VNPay will multiply by 100 internally
    const originalAmount = Math.abs(parseFloat(amount));

    // ✅ Multiply by 100 for VNPay (10 VND = 1000)
    const vnp_Amount = Math.round(originalAmount * 100);

    // ✅ Validate amount
    if (vnp_Amount <= 0 || vnp_Amount > 9999999999900) {
        throw new Error(`Invalid amount: ${originalAmount} VND (after *100: ${vnp_Amount})`);
    }

    let vnp_Params = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: vnpayConfig.vnp_TmnCode,
        vnp_Locale: locale,
        vnp_CurrCode: 'VND',
        vnp_TxnRef: vnp_TxnRef,
        vnp_OrderInfo: vnp_OrderInfo,
        vnp_OrderType: orderType,
        vnp_Amount: vnp_Amount,
        vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: createDate,
        vnp_ExpireDate: expireDate,
    };

    if (bankCode) {
        vnp_Params.vnp_BankCode = bankCode;
    }

    // Sort params alphabetically
    vnp_Params = sortObject(vnp_Params);

    // ✅ Create signature (no encoding)
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', vnpayConfig.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnp_Params.vnp_SecureHash = signed;

    // ✅ Create payment URL (with encoding)
    const paymentUrl = vnpayConfig.vnp_Url + '?' + querystring.stringify(vnp_Params, { encode: true });

    // Debug logging
    console.log('🔐 VNPay Payment URL Created:');
    console.log('- Original Amount:', originalAmount, 'VND');
    console.log('- VNPay Amount (x100):', vnp_Amount);
    console.log('- Order ID:', vnp_TxnRef);
    console.log('- Return URL:', vnp_Params.vnp_ReturnUrl);
    console.log('- Signature:', signed.substring(0, 30) + '...');
    // DÁN ĐOẠN NÀY VÀO NGAY TRƯỚC DÒNG 'return paymentUrl;'
    console.log('🔍 VNPay Payment URL Debug (Bản đầy đủ):');
    console.log('- TMN Code:', vnp_Params.vnp_TmnCode);
    console.log('- Hash Secret (first 10 chars):', vnpayConfig.vnp_HashSecret?.substring(0, 10) + '...');
    console.log('- Return URL:', vnp_Params.vnp_ReturnUrl); // <-- Cực kỳ quan trọng
    console.log('- IP Address:', vnp_Params.vnp_IpAddr); // <-- Cực kỳ quan trọng
    console.log('- Create Date:', vnp_Params.vnp_CreateDate);
    console.log('- Expire Date:', vnp_Params.vnp_ExpireDate);
    console.log('- Signature Data (for verification):', signData); // <-- QUAN TRỌNG NHẤT
    console.log('- Signature:', signed.substring(0, 20) + '...');
    console.log('- Full Payment URL (first 300 chars):', paymentUrl.substring(0, 300) + '...');
    return paymentUrl;
};

/**
 * Verify VNPay return data
 * @param {Object} vnp_Params
 * @returns {Object} { success: boolean, message: string, data: object }
 */
const verifyReturnUrl = (vnp_Params) => {
    console.log('🔍 Verifying VNPay Return:');
    console.log('- Transaction Ref:', vnp_Params.vnp_TxnRef);
    console.log('- Response Code:', vnp_Params.vnp_ResponseCode);
    console.log('- Amount:', vnp_Params.vnp_Amount);

    const secureHash = vnp_Params.vnp_SecureHash;

    // Remove hash params
    delete vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHashType;

    // Sort params
    vnp_Params = sortObject(vnp_Params);

    // ✅ Create signature (no encoding)
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', vnpayConfig.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    console.log('- Expected Signature:', signed.substring(0, 30) + '...');
    console.log('- Received Signature:', secureHash.substring(0, 30) + '...');
    console.log('- Signature Match:', secureHash === signed ? '✅' : '❌');

    // Verify signature
    if (secureHash !== signed) {
        console.error('❌ Signature verification failed!');
        console.error('- Sign Data:', signData);
        return {
            success: false,
            message: 'Invalid signature',
            data: null,
        };
    }

    // Check response code
    const responseCode = vnp_Params.vnp_ResponseCode;

    if (responseCode === '00') {
        console.log('✅ Payment successful!');
        return {
            success: true,
            message: 'Payment successful',
            data: {
                orderId: vnp_Params.vnp_TxnRef,
                amount: vnp_Params.vnp_Amount / 100, // ✅ Divide by 100
                bankCode: vnp_Params.vnp_BankCode,
                bankTranNo: vnp_Params.vnp_BankTranNo,
                cardType: vnp_Params.vnp_CardType,
                payDate: vnp_Params.vnp_PayDate,
                transactionNo: vnp_Params.vnp_TransactionNo,
            },
        };
    }

    // Payment failed
    console.error('❌ Payment failed with code:', responseCode);
    return {
        success: false,
        message: getResponseMessage(responseCode),
        data: {
            orderId: vnp_Params.vnp_TxnRef,
            responseCode,
        },
    };
};

/**
 * Sort object by key
 */
function sortObject(obj) {
    const sorted = {};
    const keys = Object.keys(obj).sort();
    keys.forEach((key) => {
        sorted[key] = obj[key];
    });
    return sorted;
}

/**
 * Format date to YYYYMMDDHHmmss
 */
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

/**
 * Get response message by code
 */
function getResponseMessage(code) {
    const messages = {
        '00': 'Giao dịch thành công',
        '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ',
        '09': 'Giao dịch không thành công do: Thẻ/Tài khoản chưa đăng ký dịch vụ',
        '10': 'Giao dịch không thành công do: Xác thực thông tin thẻ/tài khoản không đúng',
        '11': 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán',
        '12': 'Giao dịch không thành công do: Thẻ/Tài khoản bị khóa',
        '13': 'Giao dịch không thành công do Quý khách nhập sai mật khẩu quá số lần quy định',
        '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
        '51': 'Giao dịch không thành công do: Tài khoản không đủ số dư',
        '65': 'Giao dịch không thành công do: Tài khoản vượt quá hạn mức giao dịch',
        '70': 'Thông tin merchant không hợp lệ. Kiểm tra TMN Code, Hash Secret',
        '72': 'Không tìm thấy website. Kiểm tra Return URL',
        '75': 'Ngân hàng thanh toán đang bảo trì',
        '79': 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định',
        '99': 'Lỗi không xác định',
    };
    return messages[code] || `Lỗi không xác định (Code: ${code})`;
}

module.exports = {
    createPaymentUrl,
    verifyReturnUrl,
};