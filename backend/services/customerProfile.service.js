import * as customerProfileRepo from "../repositories/customerProfile.repo.js";
import * as userRepo from "../repositories/user.repo.js";
import AppError from "../utils/AppError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createCustomerProfile = async (userId, profileData) => {
    try {
        const user = await userRepo.getUserById(userId);
        if (!user) {
            throw new AppError('User not found', ApiResponse.HTTP_STATUS.NOT_FOUND);
        }
        if (user.role !== 'customer') {
            throw new AppError('User is not a customer', ApiResponse.HTTP_STATUS.BAD_REQUEST);
        }

        const existingProfile = await customerProfileRepo.getCustomerProfileByUserId(userId);
        if (existingProfile) {
            throw new AppError('Customer profile already exists', ApiResponse.HTTP_STATUS.BAD_REQUEST);
        }

        const creditScore = Math.floor(Math.random() * (850 - 300 + 1)) + 300;
        return await customerProfileRepo.createCustomerProfile({
            userId,
            ...profileData,
            creditScore

        });
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Error creating customer profile', ApiResponse.HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const getCustomerProfileById = async (id) => {
    try {
        const profile = await customerProfileRepo.getCustomerProfileById(id);
        if (!profile) {
            throw new AppError('Customer profile not found', ApiResponse.HTTP_STATUS.NOT_FOUND);
        }
        return profile;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Error retrieving customer profile', ApiResponse.HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const getCustomerProfileByUserId = async (userId) => {
    try {
        const profile = await customerProfileRepo.getCustomerProfileByUserId(userId);
        if (!profile) {
            throw new AppError('Customer profile not found', ApiResponse.HTTP_STATUS.NOT_FOUND);
        }
        return profile;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Error retrieving customer profile', ApiResponse.HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const updateCustomerProfile = async (id, profileData) => {
    try {
        const profile = await customerProfileRepo.updateCustomerProfile(id, profileData);
        if (!profile) {
            throw new AppError('Customer profile not found', ApiResponse.HTTP_STATUS.NOT_FOUND);
        }
        return profile;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Error updating customer profile', ApiResponse.HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const deleteCustomerProfile = async (id) => {
    try {
        const result = await customerProfileRepo.deleteCustomerProfile(id);
        if (!result) {
            throw new AppError('Customer profile not found', ApiResponse.HTTP_STATUS.NOT_FOUND);
        }
        return { message: 'Customer profile deleted successfully' };
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Error deleting customer profile', ApiResponse.HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const getAllCustomerProfiles = async () => {
    try {
        return await customerProfileRepo.getAllCustomerProfiles();
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Error retrieving customer profiles', ApiResponse.HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
}; 