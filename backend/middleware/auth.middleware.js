import { verifyToken } from '../utils/jwt.utils.js';
import AppError from '../utils/AppError.js';
import ApiResponse from '../utils/ApiResponse.js';

export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('No token provided', ApiResponse.HTTP_STATUS.UNAUTHORIZED);
        }
        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        next(error);
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new AppError('Not authorized to access this route', ApiResponse.HTTP_STATUS.FORBIDDEN);
        }
        next();
    };
}; 