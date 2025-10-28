// backend/src/services/kyc.service.js
const { StatusCodes } = require('http-status-codes');
const prisma = require('../client');
const ApiError = require('../utils/ApiError');

/**
 * Submit KYC
 * @param {string} userId
 * @param {Object} kycData
 * @returns {Promise<KYC>}
 */
const submitKYC = async (userId, kycData) => {
    // Check if user already has KYC
    const existingKYC = await prisma.kYC.findUnique({
        where: { userId }
    });

    if (existingKYC) {
        // If KYC exists and is APPROVED, don't allow resubmission
        if (existingKYC.status === 'APPROVED') {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'KYC already approved');
        }

        // If PENDING or REJECTED, allow update
        const updatedKYC = await prisma.kYC.update({
            where: { userId },
            data: {
                ...kycData,
                status: 'PENDING',
                rejectionReason: null,
                verifiedBy: null,
                verifiedAt: null,
            },
        });
        return updatedKYC;
    }

    // Create new KYC
    const kyc = await prisma.kYC.create({
        data: {
            userId,
            ...kycData,
            status: 'PENDING',
        },
    });

    // Update user KYC status
    await prisma.user.update({
        where: { id: userId },
        data: { kycStatus: 'PENDING' },
    });

    return kyc;
};

/**
 * Get KYC by user ID
 * @param {string} userId
 * @returns {Promise<KYC | null>}
 */
const getKYCByUserId = async (userId) => {
    return prisma.kYC.findUnique({
        where: { userId },
        include: {
            user: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                },
            },
        },
    });
};

/**
 * Get KYC by ID
 * @param {string} kycId
 * @returns {Promise<KYC | null>}
 */
const getKYCById = async (kycId) => {
    return prisma.kYC.findUnique({
        where: { id: kycId },
        include: {
            user: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    phone: true,
                },
            },
        },
    });
};

/**
 * Approve KYC
 * @param {string} kycId
 * @param {string} adminId
 * @returns {Promise<KYC>}
 */
const approveKYC = async (kycId, adminId) => {
    const kyc = await getKYCById(kycId);
    if (!kyc) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'KYC not found');
    }

    if (kyc.status === 'APPROVED') {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'KYC already approved');
    }

    const updatedKYC = await prisma.kYC.update({
        where: { id: kycId },
        data: {
            status: 'APPROVED',
            verifiedBy: adminId,
            verifiedAt: new Date(),
            rejectionReason: null,
        },
    });

    // Update user KYC status
    await prisma.user.update({
        where: { id: kyc.userId },
        data: { kycStatus: 'APPROVED' },
    });

    return updatedKYC;
};

/**
 * Reject KYC
 * @param {string} kycId
 * @param {string} adminId
 * @param {string} reason
 * @returns {Promise<KYC>}
 */
const rejectKYC = async (kycId, adminId, reason) => {
    const kyc = await getKYCById(kycId);
    if (!kyc) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'KYC not found');
    }

    const updatedKYC = await prisma.kYC.update({
        where: { id: kycId },
        data: {
            status: 'REJECTED',
            verifiedBy: adminId,
            verifiedAt: new Date(),
            rejectionReason: reason,
        },
    });

    // Update user KYC status
    await prisma.user.update({
        where: { id: kyc.userId },
        data: { kycStatus: 'REJECTED' },
    });

    return updatedKYC;
};

module.exports = {
    submitKYC,
    getKYCByUserId,
    getKYCById,
    approveKYC,
    rejectKYC,
};