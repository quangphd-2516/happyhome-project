// src/services/kycService.js
import api from './api';

export const kycService = {
    // Submit KYC
    submitKYC: async (data) => {
        const response = await api.post('/kyc/submit', data);
        return response.data;
    },

    // Get KYC status
    getKYCStatus: async () => {
        const response = await api.get('/kyc/status');
        return response.data;
    },

    // Upload KYC images
    uploadKYCImage: async (file, type) => {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('type', type); // 'idCardFront', 'idCardBack', 'selfieWithId'
        const response = await api.post('/kyc/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
};