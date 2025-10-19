// src/utils/validators.js

/**
 * Kiểm tra định dạng email
 * @param {string} email 
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Kiểm tra password:
 * - Tối thiểu 8 ký tự
 * - Có ít nhất 1 chữ cái
 * - Có ít nhất 1 số
 * @param {string} password 
 * @returns {object} { isValid: boolean, message: string }
 */
export const validatePassword = (password) => {
    // Kiểm tra độ dài
    if (password.length < 8) {
        return {
            isValid: false,
            message: 'Password must be at least 8 characters long'
        };
    }

    // Kiểm tra có chữ cái
    const hasLetter = /[a-zA-Z]/.test(password);
    if (!hasLetter) {
        return {
            isValid: false,
            message: 'Password must contain at least one letter'
        };
    }

    // Kiểm tra có số
    const hasNumber = /\d/.test(password);
    if (!hasNumber) {
        return {
            isValid: false,
            message: 'Password must contain at least one number'
        };
    }

    return {
        isValid: true,
        message: 'Password is valid'
    };
};

/**
 * Kiểm tra password match
 * @param {string} password 
 * @param {string} retypePassword 
 * @returns {boolean}
 */
export const passwordsMatch = (password, retypePassword) => {
    return password === retypePassword;
};