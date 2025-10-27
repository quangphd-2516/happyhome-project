// backend/src/services/property.service.js
const { StatusCodes } = require('http-status-codes');
const prisma = require('../client');
const ApiError = require('../utils/ApiError');

/**
 * Build dynamic where clause for property filtering
 */
const buildWhereClause = (filters) => {
    const where = {
        status: filters.status || 'PUBLISHED',
    };

    if (filters.type) {
        where.type = filters.type;
    }

    if (filters.city) {
        where.city = filters.city;
    }

    if (filters.minPrice || filters.maxPrice) {
        where.price = {};
        if (filters.minPrice) where.price.gte = parseFloat(filters.minPrice);
        if (filters.maxPrice) where.price.lte = parseFloat(filters.maxPrice);
    }

    if (filters.minArea || filters.maxArea) {
        where.area = {};
        if (filters.minArea) where.area.gte = parseFloat(filters.minArea);
        if (filters.maxArea) where.area.lte = parseFloat(filters.maxArea);
    }

    if (filters.bedrooms) {
        where.bedrooms = { gte: parseInt(filters.bedrooms) };
    }

    if (filters.bathrooms) {
        where.bathrooms = { gte: parseInt(filters.bathrooms) };
    }

    if (filters.search) {
        where.OR = [
            { title: { contains: filters.search, mode: 'insensitive' } },
            { description: { contains: filters.search, mode: 'insensitive' } },
            { address: { contains: filters.search, mode: 'insensitive' } },
        ];
    }

    return where;
};

/**
 * Build orderBy clause based on sortBy parameter
 */
const buildOrderBy = (sortBy) => {
    const orderByMap = {
        newest: { createdAt: 'desc' },
        'price-low': { price: 'asc' },
        'price-high': { price: 'desc' },
        area: { area: 'desc' },
        popular: { views: 'desc' },
    };

    return orderByMap[sortBy] || orderByMap.newest;
};

/**
 * Get all properties with filters and pagination
 * @param {Object} filters - Filter parameters
 * @returns {Promise<Object>}
 */
const getAllProperties = async (filters) => {
    const {
        page = 1,
        limit = 10,
        sortBy = 'newest',
        ...filterParams
    } = filters;

    const where = buildWhereClause(filterParams);
    const orderBy = buildOrderBy(sortBy);

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [properties, total] = await Promise.all([
        prisma.property.findMany({
            where,
            orderBy,
            skip,
            take,
            select: {
                id: true,
                title: true,
                description: true,
                type: true,
                status: true,
                address: true,
                city: true,
                district: true,
                price: true,
                area: true,
                bedrooms: true,
                bathrooms: true,
                floors: true,
                direction: true,
                hasLegalDoc: true,
                isFurnished: true,
                thumbnail: true,
                images: true,
                isPremium: true,
                views: true,
                createdAt: true,
                updatedAt: true,
                owner: {
                    select: {
                        id: true,
                        fullName: true,
                        avatar: true,
                        email: true,
                        phone: true,
                    },
                },
                _count: {
                    select: {
                        favorites: true,
                        reviews: true,
                    },
                },
            },
        }),
        prisma.property.count({ where }),
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    return {
        properties,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages,
            hasNextPage: parseInt(page) < totalPages,
            hasPrevPage: parseInt(page) > 1,
        },
    };
};

/**
 * Get property by ID
 * @param {string} id - Property ID
 * @param {string} [userId] - Current user ID (optional, for favorite check)
 * @returns {Promise<Object>}
 */
const getPropertyById = async (id, userId = null) => {
    const property = await prisma.property.findUnique({
        where: { id },
        include: {
            owner: {
                select: {
                    id: true,
                    fullName: true,
                    avatar: true,
                    email: true,
                    phone: true,
                    role: true,
                },
            },
            auctions: {
                where: {
                    status: {
                        in: ['UPCOMING', 'ONGOING'],
                    },
                },
                orderBy: {
                    startTime: 'asc',
                },
                take: 1,
            },
            reviews: {
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            avatar: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            },
            _count: {
                select: {
                    favorites: true,
                    reviews: true,
                },
            },
        },
    });

    if (!property) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Property not found');
    }

    // Increment views
    await prisma.property.update({
        where: { id },
        data: {
            views: {
                increment: 1,
            },
        },
    });

    // Calculate average rating
    const avgRating = property.reviews.length > 0
        ? property.reviews.reduce((sum, r) => sum + r.rating, 0) / property.reviews.length
        : 0;

    // Check if favorited by current user
    let isFavorited = false;
    if (userId) {
        const favorite = await prisma.favorite.findUnique({
            where: {
                userId_propertyId: {
                    userId,
                    propertyId: id,
                },
            },
        });
        isFavorited = !!favorite;
    }

    return {
        ...property,
        avgRating,
        isFavorited,
    };
};

/**
 * Create new property
 * @param {string} userId - Owner ID
 * @param {Object} propertyData - Property data
 * @returns {Promise<Object>}
 */
const createProperty = async (userId, propertyData) => {
    // Validate required fields
    const requiredFields = ['title', 'description', 'type', 'address', 'city', 'district', 'ward', 'price', 'area'];
    for (const field of requiredFields) {
        if (!propertyData[field]) {
            throw new ApiError(StatusCodes.BAD_REQUEST, `${field} is required`);
        }
    }

    const property = await prisma.property.create({
        data: {
            ...propertyData,
            ownerId: userId,
            price: parseFloat(propertyData.price),
            area: parseFloat(propertyData.area),
            bedrooms: propertyData.bedrooms ? parseInt(propertyData.bedrooms) : null,
            bathrooms: propertyData.bathrooms ? parseInt(propertyData.bathrooms) : null,
            floors: propertyData.floors ? parseInt(propertyData.floors) : null,
            latitude: parseFloat(propertyData.latitude || 0),
            longitude: parseFloat(propertyData.longitude || 0),
            status: 'DRAFT',
        },
        include: {
            owner: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                },
            },
        },
    });

    return property;
};

/**
 * Update property by ID
 * @param {string} propertyId - Property ID
 * @param {string} userId - User ID
 * @param {string} userRole - User role
 * @param {Object} updateData - Update data
 * @returns {Promise<Object>}
 */
const updatePropertyById = async (propertyId, userId, userRole, updateData) => {
    const property = await prisma.property.findUnique({
        where: { id: propertyId },
    });

    if (!property) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Property not found');
    }

    if (property.ownerId !== userId && userRole !== 'ADMIN') {
        throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to update this property');
    }

    // Nếu có object location trong updateData thì bóc tách ra
    const locationData = updateData.location || {};

    const updatedProperty = await prisma.property.update({
        where: { id: propertyId },
        data: {
            ...updateData,
            // Gán location ra các trường riêng
            address: locationData.address || updateData.address,
            city: locationData.city || updateData.city,
            district: locationData.district || updateData.district,
            ward: locationData.ward || updateData.ward,
            latitude: locationData.latitude || updateData.latitude,
            longitude: locationData.longitude || updateData.longitude,

            // Convert các giá trị số nếu có
            price: updateData.price ? parseFloat(updateData.price) : undefined,
            area: updateData.area ? parseFloat(updateData.area) : undefined,

            // Loại bỏ field location (vì Prisma không hiểu)
            location: undefined,
        },
    });

    return updatedProperty;
};

/**
 * Delete property by ID
 * @param {string} propertyId - Property ID
 * @param {string} userId - User ID
 * @param {string} userRole - User role
 * @returns {Promise<Object>}
 */
const deletePropertyById = async (propertyId, userId, userRole) => {
    const property = await prisma.property.findUnique({
        where: { id: propertyId },
    });

    if (!property) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Property not found');
    }

    if (property.ownerId !== userId && userRole !== 'ADMIN') {
        throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to delete this property');
    }

    await prisma.property.delete({
        where: { id: propertyId },
    });

    return property;
};

/**
 * Get user's properties
 * @param {string} userId - User ID
 * @returns {Promise<Array>}
 */
const getUserProperties = async (userId) => {
    const properties = await prisma.property.findMany({
        where: {
            ownerId: userId,
        },
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            _count: {
                select: {
                    favorites: true,
                    reviews: true,
                    auctions: true,
                },
            },
        },
    });

    return properties;
};

/**
 * Search properties
 * @param {string} query - Search query
 * @returns {Promise<Array>}
 */
const searchProperties = async (query) => {
    if (!query || query.trim() === '') {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Search query is required');
    }

    const properties = await prisma.property.findMany({
        where: {
            status: 'PUBLISHED',
            OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
                { address: { contains: query, mode: 'insensitive' } },
                { city: { contains: query, mode: 'insensitive' } },
                { district: { contains: query, mode: 'insensitive' } },
            ],
        },
        take: 20,
        select: {
            id: true,
            title: true,
            address: true,
            city: true,
            price: true,
            area: true,
            thumbnail: true,
            type: true,
        },
    });

    return properties;
};

/**
 * Get nearby properties
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radius - Radius in km (default: 5)
 * @returns {Promise<Array>}
 */
const getNearbyProperties = async (lat, lng, radius = 5) => {
    if (!lat || !lng) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Latitude and longitude are required');
    }

    const radiusInDegrees = parseFloat(radius) / 111;

    const properties = await prisma.property.findMany({
        where: {
            status: 'PUBLISHED',
            latitude: {
                gte: parseFloat(lat) - radiusInDegrees,
                lte: parseFloat(lat) + radiusInDegrees,
            },
            longitude: {
                gte: parseFloat(lng) - radiusInDegrees,
                lte: parseFloat(lng) + radiusInDegrees,
            },
        },
        take: 20,
    });

    return properties;
};

/**
 * Get user's favorite properties
 * @param {string} userId - User ID
 * @returns {Promise<Array>}
 */
const getFavoriteProperties = async (userId) => {
    const favorites = await prisma.favorite.findMany({
        where: {
            userId,
        },
        include: {
            property: {
                include: {
                    owner: {
                        select: {
                            id: true,
                            fullName: true,
                            avatar: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return favorites.map(fav => fav.property);
};

/**
 * Add property to favorites
 * @param {string} userId - User ID
 * @param {string} propertyId - Property ID
 * @returns {Promise<Object>}
 */
const addToFavorites = async (userId, propertyId) => {
    const property = await prisma.property.findUnique({
        where: { id: propertyId },
    });

    if (!property) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Property not found');
    }

    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
        where: {
            userId_propertyId: {
                userId,
                propertyId,
            },
        },
    });

    if (existing) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Property already in favorites');
    }

    const favorite = await prisma.favorite.create({
        data: {
            userId,
            propertyId,
        },
    });

    return favorite;
};

/**
 * Remove property from favorites
 * @param {string} userId - User ID
 * @param {string} propertyId - Property ID
 * @returns {Promise<Object>}
 */
const removeFromFavorites = async (userId, propertyId) => {
    const favorite = await prisma.favorite.findUnique({
        where: {
            userId_propertyId: {
                userId,
                propertyId,
            },
        },
    });

    if (!favorite) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Favorite not found');
    }

    await prisma.favorite.delete({
        where: {
            userId_propertyId: {
                userId,
                propertyId,
            },
        },
    });

    return favorite;
};

module.exports = {
    getAllProperties,
    getPropertyById,
    createProperty,
    updatePropertyById,
    deletePropertyById,
    getUserProperties,
    searchProperties,
    getNearbyProperties,
    getFavoriteProperties,
    addToFavorites,
    removeFromFavorites,
};