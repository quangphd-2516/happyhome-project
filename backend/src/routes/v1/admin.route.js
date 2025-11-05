// backend/src/routes/v1/admin.route.js
const express = require('express');
const auth = require('../../middlewares/auth');
const adminController = require('../../controllers/admin.controller');
const validate = require('../../middlewares/validate');
const adminValidation = require('../../validations/admin.validation');
const router = express.Router();

// Apply auth middleware with admin/moderator permission to all routes
router.use(auth('ADMIN'));

// ==================== KYC Management Routes ====================
router.get('/kyc/stats', adminController.getKYCStats);
router.get('/kyc', adminController.getKYCList);
router.get('/kyc/pending', adminController.getPendingKYC);
router.get('/kyc/:kycId', adminController.getKYCById);
router.put('/kyc/:kycId/approve', adminController.approveKYC);
router.put('/kyc/:kycId/reject', adminController.rejectKYC);
router.post('/kyc/bulk-approve', adminController.bulkApproveKYC);
router.post('/kyc/bulk-reject', adminController.bulkRejectKYC);

// ==================== User Management Routes ====================
router.get('/users', adminController.getAllUsers);
router.get('/users/:userId', adminController.getUserById);
router.put('/users/:userId/block', adminController.blockUser);
router.put('/users/:userId/unblock', adminController.unblockUser);


// ========== Auction Management Routes ==========
router.get('/auctions', validate(adminValidation.getAllAuctions), adminController.getAllAuctions);
router.get('/auctions/stats', adminController.getAuctionStatistics);
router.get('/auctions/:auctionId', validate(adminValidation.getAuctionById), adminController.getAuctionById);
router.post('/auctions', validate(adminValidation.createAuction), adminController.createAuction);
router.put('/auctions/:auctionId', validate(adminValidation.updateAuction), adminController.updateAuction);
router.put('/auctions/:auctionId/cancel', validate(adminValidation.cancelAuction), adminController.cancelAuction);
router.get('/auctions/:auctionId/results', validate(adminValidation.getAuctionById), adminController.getAuctionResults);

// ========== Property Management Routes ==========
router.get('/properties', validate(adminValidation.getAllProperties), adminController.getAllProperties);

module.exports = router;