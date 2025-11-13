// backend/src/config/vnpay.config.js
// ⚠️ TEMPORARY: Force ngrok URL for testing (override any .env value)
// TODO: Remove this hardcode and use .env file: VNPAY_RETURN_URL=https://tempie-overheady-supermarginally.ngrok-free.dev/payments/vnpay-return
const returnUrl = 'https://tempie-overheady-supermarginally.ngrok-free.dev/payments/vnpay-return';

// Debug: Log config values on load
console.log('🔧 VNPay Config Loaded:');
console.log('- TMN Code:', process.env.VNPAY_TMN_CODE || 'DEMO (default)');
console.log('- Hash Secret:', process.env.VNPAY_HASH_SECRET ? '✅ SET' : '❌ NOT SET');
console.log('- Return URL:', returnUrl);
console.log('- Return URL Type: FRONTEND (User redirect)');
console.log('⚠️  Frontend will receive params and call backend to verify');

module.exports = {
    vnp_TmnCode: process.env.VNPAY_TMN_CODE || 'DEMO',
    vnp_HashSecret: process.env.VNPAY_HASH_SECRET || 'QWERTYUIOPASDFGHJKLZXCVBNM123456',
    vnp_Url: process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    vnp_ReturnUrl: returnUrl, // ✅ Frontend URL (not API endpoint)
    vnp_ApiUrl: 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction',
};