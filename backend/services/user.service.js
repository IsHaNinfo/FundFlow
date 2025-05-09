import * as userRepo from "../repositories/user.repo.js";
import AppError from "../utils/AppError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { generateToken } from "../utils/jwt.utils.js";
import bcrypt from "bcrypt";

export const createUser = async (userData) => {
    try {
        console.log(userData);
        // Validate required fields
        const requiredFields = ['firstName', 'lastName', 'email', 'nic', 'phoneNumber', 'role', 'password'];
        for (const field of requiredFields) {
            if (!userData[field]) {
                throw new AppError(`${field} is required`, ApiResponse.HTTP_STATUS.BAD_REQUEST);
            }
        }

        // Check if email already exists
        const existingUser = await userRepo.getUserByEmail(userData.email);
        if (existingUser) {
            throw new AppError('Email already exists', ApiResponse.HTTP_STATUS.CONFLICT);
        }

        return await userRepo.createUser(userData);
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(
            'Error creating user',
            ApiResponse.HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

export const getAllUsers = async () => {
    try {
        return await userRepo.getAllUsers();
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(
            'Error retrieving users',
            ApiResponse.HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

export const getUserById = async (id) => {
    try {
        const user = await userRepo.getUserById(id);
        if (!user) {
            throw new AppError('User not found', ApiResponse.HTTP_STATUS.NOT_FOUND);
        }
        return user;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(
            'Error retrieving user',
            ApiResponse.HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

export const updateUser = async (id, userData) => {
    try {
        const user = await userRepo.updateUser(id, userData);
        if (!user) {
            throw new AppError('User not found', ApiResponse.HTTP_STATUS.NOT_FOUND);
        }
        return user;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(
            'Error updating user',
            ApiResponse.HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

export const deleteUser = async (id) => {
    try {
        const user = await userRepo.getUserById(id);
        if (!user) {
            throw new AppError('User not found', ApiResponse.HTTP_STATUS.NOT_FOUND);
        }
        await userRepo.deleteUser(id);
        return true;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(
            'Error deleting user',
            ApiResponse.HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

export const getUsersByRole = async (role) => {
    try {
        const users = await userRepo.getUsersByRole(role);
        if (!users || users.length === 0) {
            throw new AppError('No users found with this role', ApiResponse.HTTP_STATUS.NOT_FOUND);
        }
        return users;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(
            'Error retrieving users by role',
            ApiResponse.HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

export const register = async (userData) => {
    try {
        // Validate required fields
        const requiredFields = ['firstName', 'lastName', 'email', 'nic', 'phoneNumber', 'role', 'password'];
        for (const field of requiredFields) {
            if (!userData[field]) {
                throw new AppError(`${field} is required`, ApiResponse.HTTP_STATUS.BAD_REQUEST);
            }
        }

        // Check if email already exists
        const existingUserByEmail = await userRepo.getUserByEmail(userData.email);
        if (existingUserByEmail) {
            throw new AppError('Email already exists', ApiResponse.HTTP_STATUS.CONFLICT);
        }

        // Check if NIC already exists
        const existingUserByNIC = await userRepo.getUserByNIC(userData.nic);
        if (existingUserByNIC) {
            throw new AppError('NIC already exists', ApiResponse.HTTP_STATUS.CONFLICT);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        // Create user with hashed password
        const user = await userRepo.createUser({
            userData: {
                ...userData,
                password: hashedPassword
            }
        });

        // Generate token
        const token = generateToken(user);

        return { user, token };
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Error registering user', ApiResponse.HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const login = async (email, password) => {
    try {
        // Find user by email
        const user = await userRepo.getUserByEmail(email);
        if (!user) {
            throw new AppError('Invalid credentials', ApiResponse.HTTP_STATUS.UNAUTHORIZED);
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new AppError('Invalid credentials', ApiResponse.HTTP_STATUS.UNAUTHORIZED);
        }

        // Generate token
        const token = generateToken(user);

        return { user, token };
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Error logging in', ApiResponse.HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
}; 