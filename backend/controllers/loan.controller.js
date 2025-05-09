import * as loanService from "../services/loan.service.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createLoan = async (req, res, next) => {
    try {
        const loanData = {
            ...req.body,
            userId: req.user.id // Get userId from authenticated user
        };
        const newLoan = await loanService.createLoan(loanData);
        res.status(ApiResponse.HTTP_STATUS.CREATED).json(
            ApiResponse.success(newLoan, 'Loan created successfully')
        );
    } catch (error) {
        next(error);
    }
};

export const getLoan = async (req, res, next) => {
    try {
        const { id } = req.params;
        const loan = await loanService.getLoan(id);
        res.status(ApiResponse.HTTP_STATUS.OK).json(
            ApiResponse.success(loan, 'Loan retrieved successfully')
        );
    } catch (error) {
        next(error);
    }
};

export const getAllLoans = async (req, res, next) => {
    try {
        const loans = await loanService.getAllLoans();
        res.status(ApiResponse.HTTP_STATUS.OK).json(
            ApiResponse.success(loans, 'Loans retrieved successfully')
        );
    } catch (error) {
        next(error);
    }
};

export const updateLoan = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedLoan = await loanService.updateLoanDetails(id, updateData);
        res.status(ApiResponse.HTTP_STATUS.OK).json(
            ApiResponse.success(updatedLoan, 'Loan updated successfully')
        );
    } catch (error) {
        next(error);
    }
};

export const deleteLoan = async (req, res, next) => {
    try {
        const { id } = req.params;
        await loanService.deleteLoan(id);
        res.status(ApiResponse.HTTP_STATUS.OK).json(
            ApiResponse.success(null, 'Loan deleted successfully')
        );
    } catch (error) {
        next(error);
    }
};

export const getLoansByUserId = async (req, res, next) => {
    try {
        const userId = req.user.id; // Get userId from authenticated user
        const loans = await loanService.getLoansByUserId(userId);
        res.status(ApiResponse.HTTP_STATUS.OK).json(
            ApiResponse.success(loans, 'User loans retrieved successfully')
        );
    } catch (error) {
        next(error);
    }
};

export const updateLoanStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const adminId = req.user.id; // Assuming user info is attached by auth middleware

        // Validate status in request body
        if (!status) {
            return res.status(ApiResponse.HTTP_STATUS.BAD_REQUEST).json(
                new ApiResponse(
                    ApiResponse.HTTP_STATUS.BAD_REQUEST,
                    null,
                    'Status is required'
                )
            );
        }

        const updatedLoan = await loanService.updateLoanStatus(id, status, adminId);
        console.log("updatedLoan", updatedLoan);
        return res.status(ApiResponse.HTTP_STATUS.CREATED).json(

            {
                status: ApiResponse.HTTP_STATUS.OK,
                data: updatedLoan,
                message: "Loan status updated successfully"
            }
        );

    } catch (error) {
        next(error);
    }
};
