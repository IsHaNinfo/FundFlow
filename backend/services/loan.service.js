import AppError from "../utils/AppError.js";
import ApiResponse from "../utils/ApiResponse.js";
import * as userRepo from "../repositories/user.repo.js";
import * as loanRepo from "../repositories/loan.repo.js";
import * as customerProfileRepo from "../repositories/customerProfile.repo.js";
import * as loanLogger from "../loggers/loan.logger.js"; // optional: for MongoDB logging

export const createLoan = async (loanData) => {
    try {
        // Step 1: Validate required fields
        const requiredFields = ['loanAmount', 'durationMonths', 'purpose', 'monthlyIncome', 'existingLoans', 'userId'];
        const missingFields = requiredFields.filter(field => !loanData[field]);

        if (missingFields.length > 0) {
            throw new AppError(
                `Missing required fields: ${missingFields.join(', ')}`,
                ApiResponse.HTTP_STATUS.BAD_REQUEST
            );
        }

        // Step 2: Validate user
        const user = await userRepo.getUserById(loanData.userId);
        if (!user) {
            throw new AppError('User not found', ApiResponse.HTTP_STATUS.NOT_FOUND);
        }
        if (user.role !== 'customer') {
            throw new AppError('Only customers can apply for loans', ApiResponse.HTTP_STATUS.FORBIDDEN);
        }

        // Step 3: Validate numeric fields
        if (loanData.loanAmount <= 0) {
            throw new AppError('Loan amount must be greater than 0', ApiResponse.HTTP_STATUS.BAD_REQUEST);
        }
        if (loanData.durationMonths <= 0) {
            throw new AppError('Duration must be greater than 0', ApiResponse.HTTP_STATUS.BAD_REQUEST);
        }
        if (loanData.monthlyIncome <= 0) {
            throw new AppError('Monthly income must be greater than 0', ApiResponse.HTTP_STATUS.BAD_REQUEST);
        }
        if (loanData.existingLoans < 0) {
            throw new AppError('Existing loans cannot be negative', ApiResponse.HTTP_STATUS.BAD_REQUEST);
        }

        // Step 4: Calculate EMI
        const { loanAmount, durationMonths, monthlyIncome, existingLoans, userId } = loanData;
        const interestRate = 0.14; // 14% annual interest
        const monthlyInterest = interestRate / 12;

        const emi = (loanAmount * monthlyInterest * Math.pow(1 + monthlyInterest, durationMonths)) /
            (Math.pow(1 + monthlyInterest, durationMonths) - 1);

        // Step 5: Credit scoring logic
        let score = 100;

        if (emi > 0.4 * monthlyIncome) {
            score -= 30;
        }

        if (existingLoans > 2) {
            score -= 20;
        }

        if (loanAmount > 500000) {
            score -= 20;
        } else if (loanAmount > 200000) {
            score -= 10;
        }

        const profile = await customerProfileRepo.getCustomerProfileByUserId(userId);
        if (profile && profile.creditScore >= 750) {
            score += 10;
        } else if (profile && profile.creditScore < 500) {
            score -= 10;
        }

        score = Math.max(0, Math.min(100, score)); // clamp to [0, 100]

        // Step 6: Determine status and recommendation
        let status = score >= 70 ? 'approved' : 'rejected';
        let recommandations = status === 'approved'
            ? `Eligible for ${durationMonths}-month loan at 14% interest`
            : 'Application rejected due to risk factors. Try reducing loan amount or number of active loans.';

        // Step 7: Create the loan
        const newLoan = await loanRepo.createLoan({
            ...loanData,
            emi,
            score,
            status,
            recommandations
        });
        // Step 8: Log to MongoDB (optional)
        await loanLogger.logLoanRequest({
            timestamp: new Date(),
            loanId: newLoan.id,
            userId: newLoan.userId,
            action: 'Loan Created',
            newData: newLoan.toJSON(),
            performedBy: 'system'
        });

        return newLoan;

    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        console.error("Error in createLoan:", error);
        throw new AppError('Error creating loan', ApiResponse.HTTP_STATUS.INTERNAL_SERVER_ERROR);
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

export const updateLoanStatus = async (loanId, newStatus, adminId) => {
    try {
        // Step 1: Validate loan exists
        const loan = await loanRepo.getLoan(loanId);
        if (!loan) {
            throw new AppError('Loan not found', ApiResponse.HTTP_STATUS.NOT_FOUND);
        }

        // Step 2: Validate status
        if (!['pending', 'approved', 'rejected'].includes(newStatus)) {
            throw new AppError('Invalid loan status', ApiResponse.HTTP_STATUS.BAD_REQUEST);
        }

        // Step 3: Get admin user
        const admin = await userRepo.getUserById(adminId);
        if (!admin || admin.role !== 'admin') {
            throw new AppError('Only admins can update loan status', ApiResponse.HTTP_STATUS.FORBIDDEN);
        }

        // Step 4: Store old data for logging
        const oldData = loan.toJSON();

        // Step 5: Update loan status
        const updatedLoan = await loanRepo.updateLoan(loanId, {
            status: newStatus,
            recommandations: newStatus === 'approved'
                ? `Loan approved by admin ${admin.email}`
                : newStatus === 'rejected'
                    ? `Loan rejected by admin ${admin.email}`
                    : `Loan status updated to ${newStatus} by admin ${admin.email}`
        });

        // Step 6: Log the status change
        await loanLogger.logLoanRequest({
            timestamp: new Date(),
            loanId: loanId,
            userId: loan.userId,
            action: 'Status Changed',
            oldData: oldData,
            newData: updatedLoan.toJSON(),
            performedBy: admin.email
        });

        return updatedLoan;

    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        console.error("Error in updateLoanStatus:", error);
        throw new AppError('Error updating loan status', ApiResponse.HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const updateLoanDetails = async (loanId, updateData, userId) => {
    try {
        // Step 1: Validate loan exists
        const loan = await loanRepo.getLoan(loanId);
        if (!loan) {
            throw new AppError('Loan not found', ApiResponse.HTTP_STATUS.NOT_FOUND);
        }

        // Step 2: Validate user permissions
        const user = await userRepo.getUserById(userId);
        if (!user) {
            throw new AppError('User not found', ApiResponse.HTTP_STATUS.NOT_FOUND);
        }

        // Only allow updates if user is admin or the loan belongs to the user
        if (user.role !== 'admin' && loan.userId !== userId) {
            throw new AppError('Not authorized to update this loan', ApiResponse.HTTP_STATUS.FORBIDDEN);
        }

        // Step 3: Define allowed fields for update
        const allowedFields = ['loanAmount', 'durationMonths', 'purpose', 'monthlyIncome', 'existingLoans'];
        const filteredUpdateData = Object.keys(updateData)
            .filter(key => allowedFields.includes(key))
            .reduce((obj, key) => {
                obj[key] = updateData[key];
                return obj;
            }, {});

        if (Object.keys(filteredUpdateData).length === 0) {
            throw new AppError('No valid fields to update', ApiResponse.HTTP_STATUS.BAD_REQUEST);
        }

        // Step 4: Validate numeric fields
        if (filteredUpdateData.loanAmount !== undefined && filteredUpdateData.loanAmount <= 0) {
            throw new AppError('Loan amount must be greater than 0', ApiResponse.HTTP_STATUS.BAD_REQUEST);
        }
        if (filteredUpdateData.durationMonths !== undefined && filteredUpdateData.durationMonths <= 0) {
            throw new AppError('Duration must be greater than 0', ApiResponse.HTTP_STATUS.BAD_REQUEST);
        }
        if (filteredUpdateData.monthlyIncome !== undefined && filteredUpdateData.monthlyIncome <= 0) {
            throw new AppError('Monthly income must be greater than 0', ApiResponse.HTTP_STATUS.BAD_REQUEST);
        }
        if (filteredUpdateData.existingLoans !== undefined && filteredUpdateData.existingLoans < 0) {
            throw new AppError('Existing loans cannot be negative', ApiResponse.HTTP_STATUS.BAD_REQUEST);
        }

        // Step 5: Recalculate EMI and score if loan amount or duration changes
        if (filteredUpdateData.loanAmount || filteredUpdateData.durationMonths) {
            const interestRate = 0.14; // 14% annual interest
            const monthlyInterest = interestRate / 12;
            const loanAmount = filteredUpdateData.loanAmount || loan.loanAmount;
            const durationMonths = filteredUpdateData.durationMonths || loan.durationMonths;

            const emi = (loanAmount * monthlyInterest * Math.pow(1 + monthlyInterest, durationMonths)) /
                (Math.pow(1 + monthlyInterest, durationMonths) - 1);

            filteredUpdateData.emi = emi;

            // Recalculate score
            let score = 100;
            const monthlyIncome = filteredUpdateData.monthlyIncome || loan.monthlyIncome;
            const existingLoans = filteredUpdateData.existingLoans || loan.existingLoans;

            if (emi > 0.4 * monthlyIncome) {
                score -= 30;
            }
            if (existingLoans > 2) {
                score -= 20;
            }
            if (loanAmount > 500000) {
                score -= 20;
            } else if (loanAmount > 200000) {
                score -= 10;
            }

            score = Math.max(0, Math.min(100, score));
            filteredUpdateData.score = score;
        }

        // Step 6: Store old data for logging
        const oldData = loan.toJSON();

        // Step 7: Update the loan
        const updatedLoan = await loanRepo.updateLoan(loanId, filteredUpdateData);

        // Step 8: Log the update
        await loanLogger.logLoanRequest({
            timestamp: new Date(),
            loanId: loanId,
            userId: loan.userId,
            action: 'Loan Updated',
            oldData: oldData,
            newData: updatedLoan.toJSON(),
            performedBy: user.email
        });

        return updatedLoan;

    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        console.error("Error in updateLoanDetails:", error);
        throw new AppError('Error updating loan details', ApiResponse.HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};
