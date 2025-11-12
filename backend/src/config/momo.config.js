// backend/src/config/momo.config.js

// Debug: Log config values on load
console.log('🔧 MoMo Config Loaded:');
console.log('- Partner Code:', process.env.MOMO_PARTNER_CODE || 'MOMO (default)');
console.log('- Access Key:', process.env.MOMO_ACCESS_KEY ? '✅ SET' : '❌ NOT SET');
console.log('- Secret Key:', process.env.MOMO_SECRET_KEY ? '✅ SET' : '❌ NOT SET');
console.log('- Return URL:', process.env.MOMO_RETURN_URL || 'http://localhost:3000/payments/momo-return');
console.log('- Notify URL:', process.env.MOMO_NOTIFY_URL || 'http://localhost:5000/api/payments/momo-ipn');

module.exports = {
    partnerCode: process.env.MOMO_PARTNER_CODE || 'MOMO',
    accessKey: process.env.MOMO_ACCESS_KEY || 'F8BBA842ECF85',
    secretKey: process.env.MOMO_SECRET_KEY || 'K951B6PE1waDMi640xX08PD3vg6EkVlz',
    endpoint: process.env.MOMO_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api/create',
    returnUrl: process.env.MOMO_RETURN_URL || 'http://localhost:3000/payments/momo-return',
    notifyUrl: process.env.MOMO_NOTIFY_URL || 'http://localhost:5000/api/payments/momo-ipn',
    requestType: 'payWithATM', // payWithATM, captureWallet
};