// src/services/auctionService.js
import api from './api';

export const auctionService = {
    // Get all auctions with filters
    getAll: async (params) => {
        const response = await api.get('/auctions', { params });
        return response.data;
    },

    // Get auction by ID
    getById: async (id) => {
        const response = await api.get(`/auctions/${id}`);
        return response.data;
    },

    // Get my participated auctions
    getMyAuctions: async () => {
        const response = await api.get('/auctions/my-auctions');
        return response.data;
    },

    // Get upcoming auctions
    getUpcoming: async () => {
        const response = await api.get('/auctions/upcoming');
        return response.data;
    },

    // Get ongoing auctions
    getOngoing: async () => {
        const response = await api.get('/auctions/ongoing');
        return response.data;
    },

    // Get completed auctions
    getCompleted: async () => {
        const response = await api.get('/auctions/completed');
        return response.data;
    },

    // Place a bid
    placeBid: async (auctionId, amount, isAutoBid = false, maxAmount = null) => {
        const response = await api.post(`/auctions/${auctionId}/bid`, {
            amount,
            isAutoBid,
            maxAmount
        });
        return response.data;
    },

    // Get bid history for an auction
    getBidHistory: async (auctionId, page = 1, limit = 50) => {
        const response = await api.get(`/auctions/${auctionId}/bids`, {
            params: { page, limit }
        });
        return response.data;
    },

    // Check if user has deposited for auction
    checkDeposit: async (auctionId) => {
        const response = await api.get(`/auctions/${auctionId}/deposit-status`);
        return response.data;
    },

    // Pay deposit for auction
    payDeposit: async (auctionId, paymentMethod) => {
        const response = await api.post(`/auctions/${auctionId}/deposit`, {
            paymentMethod
        });
        return response.data;
    },

    // Get auction participants
    getParticipants: async (auctionId) => {
        const response = await api.get(`/auctions/${auctionId}/participants`);
        return response.data;
    },

    // Register for auction (join as participant)
    registerAuction: async (auctionId) => {
        const response = await api.post(`/auctions/${auctionId}/register`);
        return response.data;
    },

    // Get auction statistics
    getStatistics: async (auctionId) => {
        const response = await api.get(`/auctions/${auctionId}/statistics`);
        return response.data;
    },

    // Create auction (for property owners)
    createAuction: async (data) => {
        const response = await api.post('/auctions', data);
        return response.data;
    },

    // Update auction
    updateAuction: async (auctionId, data) => {
        const response = await api.put(`/auctions/${auctionId}`, data);
        return response.data;
    },

    // Cancel auction
    cancelAuction: async (auctionId, reason) => {
        const response = await api.post(`/auctions/${auctionId}/cancel`, { reason });
        return response.data;
    },

    // Get winner information
    getWinner: async (auctionId) => {
        const response = await api.get(`/auctions/${auctionId}/winner`);
        return response.data;
    },
};