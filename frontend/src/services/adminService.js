// frontend/src/services/adminService.js
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

    // ========== KYC Management (UPDATED & ENHANCED) ==========

    // Get KYC statistics for dashboard
    getKYCStats: async () => {
        const response = await api.get('/admin/kyc/stats');
        return response.data;
    },

    // Get all KYC submissions with filters
    getKYCList: async (params) => {
        const response = await api.get('/admin/kyc', { params });
        return response.data;
    },

    // Get pending KYC only
    getPendingKYC: async (params) => {
        const response = await api.get('/admin/kyc/pending', { params });
        return response.data;
    },

    // Get KYC detail by ID
    getKYCById: async (kycId) => {
        const response = await api.get(`/admin/kyc/${kycId}`);
        return response.data;
    },

    // Approve KYC
    approveKYC: async (kycId) => {
        const response = await api.put(`/admin/kyc/${kycId}/approve`);
        return response.data;
    },

    // Reject KYC with reason
    rejectKYC: async (kycId, reason) => {
        const response = await api.put(`/admin/kyc/${kycId}/reject`, { reason });
        return response.data;
    },

    // Bulk approve KYC
    bulkApproveKYC: async (kycIds) => {
        const response = await api.post('/admin/kyc/bulk-approve', { kycIds });
        return response.data;
    },

    // Bulk reject KYC
    bulkRejectKYC: async (kycIds, reason) => {
        const response = await api.post('/admin/kyc/bulk-reject', { kycIds, reason });
        return response.data;
    },

    // Export KYC data
    exportKYCData: async (params) => {
        const response = await api.get('/admin/kyc/export', {
            params,
            responseType: 'blob'
        });
        return response.data;
    },

    // Property Management
    getPendingProperties: async (params) => {
        const response = await api.get('/admin/properties/pending', { params });
        return response.data;
    },

    getAllProperties: async (params) => {
        const response = await api.get('/admin/properties', { params });
        return response.data;
    },

    getPropertyById: async (propertyId) => {
        const response = await api.get(`/admin/properties/${propertyId}`);
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

    deleteProperty: async (propertyId) => {
        const response = await api.delete(`/admin/properties/${propertyId}`);
        return response.data;
    },

    // Auction Management
    getAllAuctions: async (params) => {
        const response = await api.get('/admin/auctions', { params });
        return response.data;
    },

    getAuctionById: async (auctionId) => {
        const response = await api.get(`/admin/auctions/${auctionId}`);
        return response.data;
    },

    createAuction: async (auctionData) => {
        const response = await api.post('/admin/auctions', auctionData);
        return response.data;
    },

    updateAuction: async (auctionId, auctionData) => {
        const response = await api.put(`/admin/auctions/${auctionId}`, auctionData);
        return response.data;
    },

    cancelAuction: async (auctionId, reason) => {
        const response = await api.put(`/admin/auctions/${auctionId}/cancel`, { reason });
        return response.data;
    },

    getAuctionResults: async (auctionId) => {
        const response = await api.get(`/admin/auctions/${auctionId}/results`);
        return response.data;
    },

    // Transaction Management
    getAllTransactions: async (params) => {
        const response = await api.get('/admin/transactions', { params });
        return response.data;
    },

    getTransactionById: async (transactionId) => {
        const response = await api.get(`/admin/transactions/${transactionId}`);
        return response.data;
    },

    // System Configuration
    getSystemConfig: async () => {
        const response = await api.get('/admin/config');
        return response.data;
    },

    updateSystemConfig: async (key, value) => {
        const response = await api.put('/admin/config', { key, value });
        return response.data;
    },
};

// Helper functions for the components
export const getKYCDetail = async (kycId) => {
    return adminService.getKYCById(kycId);
};

export const getKYCList = async (filters) => {
    return adminService.getKYCList(filters);
};

export const getKYCStats = async () => {
    return adminService.getKYCStats();
};

export const approveKYC = async (kycId) => {
    return adminService.approveKYC(kycId);
};

export const rejectKYC = async (kycId, reason) => {
    return adminService.rejectKYC(kycId, reason);
};

export default adminService;