import * as loanService from "../services/loan.service.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createLoan = async (req, res, next) => {
    try {
        const loanData = req.body;
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
        const updatedLoan = await loanService.updateLoan(id, updateData);
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

export const getLoansByCustomerId = async (req, res, next) => {
    try {
        const { customerId } = req.params;
        const loans = await loanService.getLoansByCustomerId(customerId);
        res.status(ApiResponse.HTTP_STATUS.OK).json(
            ApiResponse.success(loans, 'Customer loans retrieved successfully')
        );
    } catch (error) {
        next(error);
    }
};
