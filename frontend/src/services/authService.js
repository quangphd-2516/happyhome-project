// src/services/authService.js
import api from './api';

export const authService = {
    /**
     * Đăng ký user mới
     * @param {object} userData - { fullName, email, password }
     * @returns {Promise}
     */
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    /**
     * Verify OTP
     * @param {object} data - { email, otp }
     * @returns {Promise}
     */
    verifyOTP: async (data) => {
        const response = await api.post('/auth/verify-otp', data);
        return response.data;
    },

    /**
     * Resend OTP
     * @param {string} email
     * @returns {Promise}
     */
    resendOTP: async (email) => {
        const response = await api.post('/auth/resend-otp', { email });
        return response.data;
    },

    /**
     * Login
     * @param {object} credentials - { email, password }
     * @returns {Promise}
     */
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    /**
     * Logout
     */
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    /**
     * Get current user
     * @returns {Promise}
     */
    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },
    // Đăng ký CŨ (không có OTP)
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    // Đăng ký MỚI (có OTP)
    registerWithOTP: async (userData) => {
        const response = await api.post('/auth/register-otp', userData);
        return response.data;
    },

    verifyOTP: async (data) => {
        const response = await api.post('/auth/verify-otp', data);
        return response.data;
    },

    resendOTP: async (email) => {
        const response = await api.post('/auth/resend-otp', { email });
        return response.data;
    },
};