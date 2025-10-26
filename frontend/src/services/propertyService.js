// src/services/propertyService.js
import api from './api';

export const propertyService = {
    // Get all properties
    getAll: async (params) => {
        const response = await api.get('/properties', { params });
        return response.data;
    },



    // Create property
    create: async (data) => {
        const response = await api.post('/properties', data);
        return response.data;
    },

    // Update property
    update: async (id, data) => {
        const response = await api.put(`/properties/${id}`, data);
        return response.data;
    },

    // Delete property
    delete: async (id) => {
        const response = await api.delete(`/properties/${id}`);
        return response.data;
    },

    // Get my properties
    getMyProperties: async () => {
        const response = await api.get('/properties/my-properties');
        return response.data;
    },

    // Get property by ID
    getById: async (id) => {
        const response = await api.get(`/properties/${id}`);
        return response.data;
    },

    // Get favorites
    getFavorites: async () => {
        const response = await api.get('/properties/favorites');
        return response.data;
    },

    // Add to favorites
    addToFavorites: async (propertyId) => {
        const response = await api.post('/properties/${propertyId}/favorite');
        return response.data;
    },
    // Remove from favorites
    removeFromFavorites: async (propertyId) => {
        const response = await api.delete('/properties/${propertyId}/favorite');
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
};