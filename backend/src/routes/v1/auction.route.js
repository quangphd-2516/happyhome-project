// backend/src/routes/v1/auction.route.js
const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const auctionValidation = require('../../validations/auction.validation');
const auctionController = require('../../controllers/auction.controller');

const router = express.Router();

// ========== Public Routes (No auth required) ==========
router.get('/', validate(auctionValidation.getAllAuctions), auctionController.getAllAuctions);
router.get('/upcoming', validate(auctionValidation.getPaginatedAuctions), auctionController.getUpcomingAuctions);
router.get('/ongoing', validate(auctionValidation.getPaginatedAuctions), auctionController.getOngoingAuctions);
router.get('/completed', validate(auctionValidation.getPaginatedAuctions), auctionController.getCompletedAuctions);
router.get('/:auctionId', validate(auctionValidation.getAuctionById), auctionController.getAuctionById);
router.get('/:auctionId/statistics', validate(auctionValidation.getAuctionById), auctionController.getAuctionStatistics);
router.get('/:auctionId/bids', validate(auctionValidation.getBidHistory), auctionController.getBidHistory);
router.get('/:auctionId/participants', validate(auctionValidation.getAuctionById), auctionController.getParticipants);
router.get('/:auctionId/winner', validate(auctionValidation.getAuctionById), auctionController.getWinner);

// ========== Protected Routes (Auth required) ==========
router.use(auth());
router.get('/my-auctions', validate(auctionValidation.getPaginatedAuctions), auctionController.getMyAuctions);
router.get('/:auctionId/deposit-status', validate(auctionValidation.getAuctionById), auctionController.checkDepositStatus);
router.post('/:auctionId/deposit', validate(auctionValidation.payDeposit), auctionController.payDeposit);
router.post('/:auctionId/register', validate(auctionValidation.getAuctionById), auctionController.registerAuction);
router.post('/:auctionId/bid', validate(auctionValidation.placeBid), auctionController.placeBid);

module.exports = router;