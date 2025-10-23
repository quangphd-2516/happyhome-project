// src/services/auctionService.js
import api from './api';

export const auctionService = {
    // Get all auctions
    getAll: async (params) => {
        const response = await api.get('/auctions', { params });
        return response.data;
    },

    // Get auction by ID
    getById: async (id) => {
        const response = await api.get(`/auctions/${id}`);
        return response.data;
    },

    // Place bid
    placeBid: async (auctionId, amount) => {
        const response = await api.post(`/auctions/${auctionId}/bids`, { amount });
        return response.data;
    },

    // Pay deposit
    payDeposit: async (auctionId) => {
        const response = await api.post(`/auctions/${auctionId}/deposit`);
        return response.data;
    },

    // Get my auctions
    getMyAuctions: async () => {
        const response = await api.get('/auctions/my-auctions');
        return response.data;
    },

    // Get auction history
    getHistory: async () => {
        const response = await api.get('/auctions/history');
        return response.data;
    },

    // Get bid history
    getBidHistory: async (auctionId) => {
        const response = await api.get(`/auctions/${auctionId}/bids`);
        return response.data;
    },
};