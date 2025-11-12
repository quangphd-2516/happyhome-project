// backend/src/routes/v1/payment.route.js
const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const paymentValidation = require('../../validations/payment.validation');
const paymentController = require('../../controllers/payment.controller');

const router = express.Router();

// Create VNPay payment (requires auth)
router.post('/vnpay/create', auth(), validate(paymentValidation.createVNPayPayment), paymentController.createVNPayPayment);

// VNPay return (no auth - public callback)
router.get('/vnpay/return', paymentController.vnpayReturn);
// VNPay IPN (no auth - backend notification)
router.get('/vnpay/ipn', paymentController.vnpayIPN);

// ========== MoMo ========== ✅ THÊM MỚI
router.post('/momo/create', auth(), validate(paymentValidation.createMoMoPayment), paymentController.createMoMoPayment);
router.get('/momo/return', paymentController.momoReturn);
router.post('/momo/ipn', paymentController.momoIPN);


module.exports = router;