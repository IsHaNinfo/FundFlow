import jwt from 'jsonwebtoken';
import AppError from './AppError.js';
import ApiResponse from './ApiResponse.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '24h';

export const generateToken = (user) => {
    try {
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        };
        return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    } catch (error) {
        throw new AppError('Error generating token', ApiResponse.HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new AppError('Invalid token', ApiResponse.HTTP_STATUS.UNAUTHORIZED);
    }
}; 