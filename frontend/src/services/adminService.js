// src/services/adminService.js
import api from './api';

export const adminService = {
    // Dashboard Statistics
    getDashboardStats: async () => {
        const response = await api.get('/admin/dashboard/stats');
        return response.data;
    },

    // Revenue Chart Data
    getRevenueData: async (period = '7days') => {
        const response = await api.get('/admin/dashboard/revenue', {
            params: { period }
        });
        return response.data;
    },

    // User Growth Chart Data
    getUserGrowthData: async (period = '7days') => {
        const response = await api.get('/admin/dashboard/user-growth', {
            params: { period }
        });
        return response.data;
    },

    // Recent Activities
    getRecentActivities: async (limit = 10) => {
        const response = await api.get('/admin/dashboard/activities', {
            params: { limit }
        });
        return response.data;
    },

    // User Management
    getAllUsers: async (params) => {
        const response = await api.get('/admin/users', { params });
        return response.data;
    },

    getUserById: async (userId) => {
        const response = await api.get(`/admin/users/${userId}`);
        return response.data;
    },

    blockUser: async (userId) => {
        const response = await api.put(`/admin/users/${userId}/block`);
        return response.data;
    },

    unblockUser: async (userId) => {
        const response = await api.put(`/admin/users/${userId}/unblock`);
        return response.data;
    },

    // KYC Management
    getPendingKYC: async (params) => {
        const response = await api.get('/admin/kyc/pending', { params });
        return response.data;
    },

    getKYCById: async (kycId) => {
        const response = await api.get(`/admin/kyc/${kycId}`);
        return response.data;
    },

    approveKYC: async (kycId) => {
        const response = await api.put(`/admin/kyc/${kycId}/approve`);
        return response.data;
    },

    rejectKYC: async (kycId, reason) => {
        const response = await api.put(`/admin/kyc/${kycId}/reject`, { reason });
        return response.data;
    },

    // Property Management
    getPendingProperties: async (params) => {
        const response = await api.get('/admin/properties/pending', { params });
        return response.data;
    },

    approveProperty: async (propertyId) => {
        const response = await api.put(`/admin/properties/${propertyId}/approve`);
        return response.data;
    },

    rejectProperty: async (propertyId, reason) => {
        const response = await api.put(`/admin/properties/${propertyId}/reject`, { reason });
        return response.data;
    },

    // Auction Management
    getAllAuctions: async (params) => {
        const response = await api.get('/admin/auctions', { params });
        return response.data;
    },

    getAuctionResults: async (auctionId) => {
        const response = await api.get(`/admin/auctions/${auctionId}/results`);
        return response.data;
    },
};