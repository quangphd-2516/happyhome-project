// src/services/propertyService.js
import api from './api';

export const propertyService = {
    // Get all properties with filters
    getAll: async (params) => {
        const response = await api.get('/properties', { params });
        return response.data;
    },

    // Get property by ID
    getById: async (id) => {
        const response = await api.get(`/properties/${id}`);
        return response.data;
    },

    // Search properties
    search: async (query) => {
        const response = await api.get('/properties/search', { params: { q: query } });
        return response.data;
    },

    // Get nearby properties
    getNearby: async (lat, lng, radius = 5) => {
        const response = await api.get('/properties/nearby', {
            params: { lat, lng, radius }
        });
        return response.data;
    },

    // Add to favorites
    addToFavorites: async (propertyId) => {
        const response = await api.post(`/properties/${propertyId}/favorite`);
        return response.data;
    },

    // Remove from favorites
    removeFromFavorites: async (propertyId) => {
        const response = await api.delete(`/properties/${propertyId}/favorite`);
        return response.data;
    },

    // Add review
    addReview: async (propertyId, data) => {
        const response = await api.post(`/properties/${propertyId}/reviews`, data);
        return response.data;
    },
};