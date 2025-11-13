// backend/src/routes/v1/auction.route.js
const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const auctionValidation = require('../../validations/auction.validation');
const auctionController = require('../../controllers/auction.controller');

const router = express.Router();

// ========== Public Routes (No auth) - ĐẶT TRƯỚC ==========
router.get('/', validate(auctionValidation.getAllAuctions), auctionController.getAllAuctions);
router.get('/upcoming', validate(auctionValidation.getPaginatedAuctions), auctionController.getUpcomingAuctions);
router.get('/ongoing', validate(auctionValidation.getPaginatedAuctions), auctionController.getOngoingAuctions);
router.get('/completed', validate(auctionValidation.getPaginatedAuctions), auctionController.getCompletedAuctions);

// ========== Protected Routes (Auth required) - ĐẶT SAU ==========
router.get('/my-auctions', auth(), validate(auctionValidation.getPaginatedAuctions), auctionController.getMyAuctions);

// ========== Public auction detail routes - ĐẶT SAU my-auctions ==========
router.get('/:auctionId', validate(auctionValidation.getAuctionById), auctionController.getAuctionById);
router.get('/:auctionId/statistics', validate(auctionValidation.getAuctionById), auctionController.getAuctionStatistics);
router.get('/:auctionId/bids', validate(auctionValidation.getBidHistory), auctionController.getBidHistory);
router.get('/:auctionId/participants', validate(auctionValidation.getAuctionById), auctionController.getParticipants);
router.get('/:auctionId/winner', validate(auctionValidation.getAuctionById), auctionController.getWinner);

// ========== Protected action routes - CẦN AUTH ==========
router.get('/:auctionId/deposit-status', auth(), validate(auctionValidation.getAuctionById), auctionController.checkDepositStatus);
router.post('/:auctionId/deposit', auth(), validate(auctionValidation.payDeposit), auctionController.payDeposit);
router.post('/:auctionId/register', auth(), validate(auctionValidation.getAuctionById), auctionController.registerAuction);
router.post('/:auctionId/bid', auth(), validate(auctionValidation.placeBid), auctionController.placeBid);

module.exports = router;