import * as adminRepo from '../repositories/admin.repo.js';
import AppError from "../utils/AppError.js";
import jwt from 'jsonwebtoken';
import ApiResponse from "../utils/ApiResponse.js";

export const initializeAdmin = async () => {
    try {
        const admin = await adminRepo.createAdmin();
        return admin;
    } catch (error) {
        throw new AppError(error.message, 500);
    }
};

export const loginAdmin = async (email, password) => {
    try {
        const admin = await adminRepo.verifyAdmin(email, password);

        if (!admin) {
            throw new AppError('Invalid credentials', 401);
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: admin.id, email: admin.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return {
            admin: {
                id: admin.id,
                email: admin.email
            },
            token
        };
    } catch (error) {
        throw new AppError(error.message, error.statusCode || 500);
    }
};

export const verifyAdmin = async (email, password) => {
    try {
        if (!email || !password) {
            throw new AppError(
                'Email and password are required',
                ApiResponse.HTTP_STATUS.BAD_REQUEST
            );
        }

        const admin = await adminRepo.verifyAdmin(email, password);
        if (!admin) {
            throw new AppError(
                'Invalid credentials',
                ApiResponse.HTTP_STATUS.UNAUTHORIZED
            );
        }

        return admin;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(
            'Error verifying admin',
            ApiResponse.HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

export const getAdminByEmail = async (email) => {
    try {
        if (!email) {
            throw new AppError(
                'Email is required',
                ApiResponse.HTTP_STATUS.BAD_REQUEST
            );
        }

        const admin = await adminRepo.getAdminByEmail(email);
        if (!admin) {
            throw new AppError(
                'Admin not found',
                ApiResponse.HTTP_STATUS.NOT_FOUND
            );
        }

        return admin;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(
            'Error retrieving admin',
            ApiResponse.HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};
