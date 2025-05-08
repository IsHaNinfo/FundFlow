import * as customerService from "../services/customer.service.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createCustomer = async (req, res, next) => {
    try {
        const customer = req.body;
        const newCustomer = await customerService.createCustomer(customer);
        res.status(ApiResponse.HTTP_STATUS.CREATED).json(
            ApiResponse.success(newCustomer, 'Customer created successfully')
        );
    } catch (error) {
        next(error);
    }
};

export const getCustomer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const customer = await customerService.getCustomer(id);
        res.status(ApiResponse.HTTP_STATUS.OK).json(
            ApiResponse.success(customer, 'Customer retrieved successfully')
        );
    } catch (error) {
        next(error);
    }
};

export const getAllCustomers = async (req, res, next) => {
    try {
        const customers = await customerService.getAllCustomers();
        res.status(ApiResponse.HTTP_STATUS.OK).json(
            ApiResponse.success(customers, 'Customers retrieved successfully')
        );
    } catch (error) {
        next(error);
    }
};

export const updateCustomer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedCustomer = await customerService.updateCustomer(id, updateData);
        res.status(ApiResponse.HTTP_STATUS.OK).json(
            ApiResponse.success(updatedCustomer, 'Customer updated successfully')
        );
    } catch (error) {
        next(error);
    }
};

export const deleteCustomer = async (req, res, next) => {
    try {
        const { id } = req.params;
        await customerService.deleteCustomer(id);
        res.status(ApiResponse.HTTP_STATUS.OK).json(
            ApiResponse.success(null, 'Customer deleted successfully')
        );
    } catch (error) {
        next(error);
    }
};
