// backend/src/services/auctionScheduler.js
const cron = require('node-cron');
const prisma = require('../client');
const { emitAuctionStarted, emitAuctionEnded } = require('./websocket.service');

/**
 * Check and start upcoming auctions
 */
const checkUpcomingAuctions = async () => {
    try {
        const now = new Date();

        const auctionsToStart = await prisma.auction.findMany({
            where: {
                status: 'UPCOMING',
                startTime: {
                    lte: now,
                },
            },
        });

        for (const auction of auctionsToStart) {
            await prisma.auction.update({
                where: { id: auction.id },
                data: { status: 'ONGOING' },
            });

            // Emit socket event
            emitAuctionStarted(auction.id);

            console.log(`Auction ${auction.id} started`);
        }
    } catch (error) {
        console.error('Check upcoming auctions error:', error);
    }
};

/**
 * Check and end ongoing auctions
 */
const checkOngoingAuctions = async () => {
    try {
        const now = new Date();

        const auctionsToEnd = await prisma.auction.findMany({
            where: {
                status: 'ONGOING',
                endTime: {
                    lte: now,
                },
            },
            include: {
                bids: {
                    orderBy: { amount: 'desc' },
                    take: 1,
                },
            },
        });

        for (const auction of auctionsToEnd) {
            const winningBid = auction.bids[0];
            const winnerId = winningBid?.userId || null;

            // Update auction status
            await prisma.auction.update({
                where: { id: auction.id },
                data: {
                    status: 'COMPLETED',
                    winnerId,
                },
            });

            // Emit socket event
            await emitAuctionEnded(auction.id, winnerId);

            // Process winner and refunds
            if (winnerId) {
                await processWinner(auction.id, winnerId, winningBid.amount);
            }

            await processLosers(auction.id, winnerId);

            console.log(`Auction ${auction.id} ended. Winner: ${winnerId || 'None'}`);
        }
    } catch (error) {
        console.error('Check ongoing auctions error:', error);
    }
};

/**
 * Process winner payment
 */
const processWinner = async (auctionId, winnerId, winningAmount) => {
    try {
        const auction = await prisma.auction.findUnique({
            where: { id: auctionId },
            include: {
                property: true,
            },
        });

        // Create notification for winner
        await prisma.notification.create({
            data: {
                userId: winnerId,
                title: 'Congratulations! You won the auction!',
                message: `You won the auction for ${auction.title}. Please complete payment within 24 hours.`,
                type: 'AUCTION',
                link: `/auctions/${auctionId}`,
            },
        });

        // Winner's deposit will be deducted from final payment
        // Remaining amount = winningAmount - depositAmount
        const remainingAmount = parseFloat(winningAmount) - parseFloat(auction.depositAmount);

        // TODO: Create payment request for remaining amount
        console.log(`Winner ${winnerId} needs to pay ${remainingAmount} more`);
    } catch (error) {
        console.error('Process winner error:', error);
    }
};

/**
 * Process losers refund
 */
const processLosers = async (auctionId, winnerId) => {
    try {
        const auction = await prisma.auction.findUnique({
            where: { id: auctionId },
        });

        // Get all participants except winner
        const participants = await prisma.auctionParticipant.findMany({
            where: {
                auctionId,
                userId: { not: winnerId },
                depositPaid: true,
                isRefunded: false,
            },
            include: {
                user: {
                    include: {
                        wallet: true,
                    },
                },
            },
        });

        // Refund deposits
        for (const participant of participants) {
            // Refund to wallet
            await prisma.wallet.update({
                where: { userId: participant.userId },
                data: {
                    balance: {
                        increment: auction.depositAmount,
                    },
                },
            });

            // Create refund transaction
            await prisma.transaction.create({
                data: {
                    walletId: participant.user.wallet.id,
                    type: 'AUCTION_REFUND',
                    amount: auction.depositAmount,
                    status: 'COMPLETED',
                    description: `Deposit refund for auction: ${auction.title}`,
                    metadata: { auctionId },
                },
            });

            // Mark as refunded
            await prisma.auctionParticipant.update({
                where: { id: participant.id },
                data: { isRefunded: true },
            });

            // Send notification
            await prisma.notification.create({
                data: {
                    userId: participant.userId,
                    title: 'Deposit Refunded',
                    message: `Your deposit for ${auction.title} has been refunded.`,
                    type: 'PAYMENT',
                    link: `/wallet`,
                },
            });

            console.log(`Refunded deposit to user ${participant.userId}`);
        }
    } catch (error) {
        console.error('Process losers error:', error);
    }
};

/**
 * Initialize auction scheduler
 */
const initializeAuctionScheduler = () => {
    // Run every minute
    cron.schedule('* * * * *', async () => {
        await checkUpcomingAuctions();
        await checkOngoingAuctions();
    });

    console.log('Auction scheduler initialized');
};

module.exports = {
    initializeAuctionScheduler,
    checkUpcomingAuctions,
    checkOngoingAuctions,
};