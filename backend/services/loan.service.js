import * as loanRepo from "../repositories/loan.repo.js";
import * as userRepo from "../repositories/user.repo.js";
import AppError from "../utils/AppError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createLoan = async (loanData) => {
    try {
        // Validate required fields
        const requiredFields = ['loanAmount', 'durationMonths', 'purpose', 'monthlyIncome', 'existingLoans', 'userId'];
        const missingFields = requiredFields.filter(field => !loanData[field]);

        if (missingFields.length > 0) {
            throw new AppError(
                `Missing required fields: ${missingFields.join(', ')}`,
                ApiResponse.HTTP_STATUS.BAD_REQUEST
            );
        }

        // Check if user exists and is a customer
        const user = await userRepo.getUserById(loanData.userId);
        if (!user) {
            throw new AppError('User not found', ApiResponse.HTTP_STATUS.NOT_FOUND);
        }
        if (user.role !== 'customer') {
            throw new AppError('Only customers can apply for loans', ApiResponse.HTTP_STATUS.FORBIDDEN);
        }

        // Validate numeric fields
        if (loanData.loanAmount <= 0) {
            throw new AppError(
                'Loan amount must be greater than 0',
                ApiResponse.HTTP_STATUS.BAD_REQUEST
            );
        }

        if (loanData.durationMonths <= 0) {
            throw new AppError(
                'Duration must be greater than 0',
                ApiResponse.HTTP_STATUS.BAD_REQUEST
            );
        }

        if (loanData.monthlyIncome <= 0) {
            throw new AppError(
                'Monthly income must be greater than 0',
                ApiResponse.HTTP_STATUS.BAD_REQUEST
            );
        }

        if (loanData.existingLoans < 0) {
            throw new AppError(
                'Existing loans cannot be negative',
                ApiResponse.HTTP_STATUS.BAD_REQUEST
            );
        }

        const newLoan = await loanRepo.createLoan(loanData);
        return newLoan;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(
            'Error creating loan',
            ApiResponse.HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

export const getLoan = async (id) => {
    try {
        const loan = await loanRepo.getLoan(id);
        if (!loan) {
            throw new AppError('Loan not found', ApiResponse.HTTP_STATUS.NOT_FOUND);
        }
        return loan;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(
            'Error retrieving loan',
            ApiResponse.HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

export const getAllLoans = async () => {
    try {
        const loans = await loanRepo.getAllLoans();
        return loans;
    } catch (error) {
        throw new AppError(
            'Error retrieving loans',
            ApiResponse.HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

export const updateLoan = async (id, updateData) => {
    try {
        const loan = await loanRepo.getLoan(id);
        if (!loan) {
            throw new AppError('Loan not found', ApiResponse.HTTP_STATUS.NOT_FOUND);
        }

        // Define allowed fields for update
        const allowedFields = ['loanAmount', 'durationMonths', 'purpose', 'monthlyIncome', 'existingLoans', 'status'];

        // Filter out any fields that are not allowed
        const filteredUpdateData = Object.keys(updateData)
            .filter(key => allowedFields.includes(key))
            .reduce((obj, key) => {
                obj[key] = updateData[key];
                return obj;
            }, {});

        // If no valid fields to update
        if (Object.keys(filteredUpdateData).length === 0) {
            throw new AppError(
                'No valid fields to update',
                ApiResponse.HTTP_STATUS.BAD_REQUEST
            );
        }

        // Validate numeric fields if they are being updated
        if (filteredUpdateData.loanAmount !== undefined && filteredUpdateData.loanAmount <= 0) {
            throw new AppError(
                'Loan amount must be greater than 0',
                ApiResponse.HTTP_STATUS.BAD_REQUEST
            );
        }

        if (filteredUpdateData.durationMonths !== undefined && filteredUpdateData.durationMonths <= 0) {
            throw new AppError(
                'Duration must be greater than 0',
                ApiResponse.HTTP_STATUS.BAD_REQUEST
            );
        }

        if (filteredUpdateData.monthlyIncome !== undefined && filteredUpdateData.monthlyIncome <= 0) {
            throw new AppError(
                'Monthly income must be greater than 0',
                ApiResponse.HTTP_STATUS.BAD_REQUEST
            );
        }

        if (filteredUpdateData.existingLoans !== undefined && filteredUpdateData.existingLoans < 0) {
            throw new AppError(
                'Existing loans cannot be negative',
                ApiResponse.HTTP_STATUS.BAD_REQUEST
            );
        }

        // Validate status if being updated
        if (filteredUpdateData.status !== undefined &&
            !['pending', 'approved', 'rejected'].includes(filteredUpdateData.status)) {
            throw new AppError(
                'Invalid loan status',
                ApiResponse.HTTP_STATUS.BAD_REQUEST
            );
        }

        const updatedLoan = await loanRepo.updateLoan(id, filteredUpdateData);
        return updatedLoan;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(
            'Error updating loan',
            ApiResponse.HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

export const deleteLoan = async (id) => {
    try {
        const loan = await loanRepo.getLoan(id);
        if (!loan) {
            throw new AppError('Loan not found', ApiResponse.HTTP_STATUS.NOT_FOUND);
        }

        const result = await loanRepo.deleteLoan(id);
        return result;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(
            'Error deleting loan',
            ApiResponse.HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

export const getLoansByUserId = async (userId) => {
    try {
        // Check if user exists and is a customer
        const user = await userRepo.getUserById(userId);
        if (!user) {
            throw new AppError('User not found', ApiResponse.HTTP_STATUS.NOT_FOUND);
        }
        if (user.role !== 'customer') {
            throw new AppError('Only customers can have loans', ApiResponse.HTTP_STATUS.FORBIDDEN);
        }

        const loans = await loanRepo.getLoansByUserId(userId);
        return loans;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(
            'Error retrieving user loans',
            ApiResponse.HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};
