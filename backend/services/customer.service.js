import * as customerRepo from "../repositories/customer.repo.js";
import AppError from "../utils/AppError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createCustomer = async (customerData) => {
    try {
        // Validate required fields
        const requiredFields = ['firstName', 'lastName', 'email', 'nic', 'phoneNumber', 'monthlyIncome'];
        const missingFields = requiredFields.filter(field => !customerData[field]);

        if (missingFields.length > 0) {
            throw new AppError(
                `Missing required fields: ${missingFields.join(', ')}`,
                ApiResponse.HTTP_STATUS.BAD_REQUEST
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(customerData.email)) {
            throw new AppError(
                'Invalid email format',
                ApiResponse.HTTP_STATUS.BAD_REQUEST
            );
        }

        // Check if customer with same email already exists
        const existingCustomer = await customerRepo.findByEmail(customerData.email);
        if (existingCustomer) {
            throw new AppError(
                'Customer with this email already exists',
                ApiResponse.HTTP_STATUS.CONFLICT
            );
        }

        // Create new customer
        const newCustomer = await customerRepo.createCustomer(customerData);
        return newCustomer;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(
            'Error creating customer',
            ApiResponse.HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

export const getCustomer = async (id) => {
    try {
        const customer = await customerRepo.getCustomer(id);
        if (!customer) {
            throw new AppError('Customer not found', ApiResponse.HTTP_STATUS.NOT_FOUND);
        }
        return customer;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(
            'Error retrieving customer',
            ApiResponse.HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

export const getAllCustomers = async () => {
    try {
        const customers = await customerRepo.getAllCustomers();
        return customers;
    } catch (error) {
        throw new AppError(
            'Error retrieving customers',
            ApiResponse.HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

export const updateCustomer = async (id, updateData) => {
    try {
        const customer = await customerRepo.getCustomer(id);
        if (!customer) {
            throw new AppError('Customer not found', ApiResponse.HTTP_STATUS.NOT_FOUND);
        }

        // Define allowed fields for update
        const allowedFields = ['firstName', 'lastName', 'email', 'nic', 'phoneNumber', 'monthlyIncome'];

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

        // Check if email is being updated and if it already exists
        if (filteredUpdateData.email && filteredUpdateData.email !== customer.email) {
            const existingCustomer = await customerRepo.findByEmail(filteredUpdateData.email);
            if (existingCustomer) {
                throw new AppError('Email already in use', ApiResponse.HTTP_STATUS.CONFLICT);
            }
        }

        // Validate email format if email is being updated
        if (filteredUpdateData.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(filteredUpdateData.email)) {
                throw new AppError(
                    'Invalid email format',
                    ApiResponse.HTTP_STATUS.BAD_REQUEST
                );
            }
        }

        // Validate monthlyIncome if it's being updated
        if (filteredUpdateData.monthlyIncome !== undefined) {
            if (filteredUpdateData.monthlyIncome < 0) {
                throw new AppError(
                    'Monthly income cannot be negative',
                    ApiResponse.HTTP_STATUS.BAD_REQUEST
                );
            }
        }

        const updatedCustomer = await customerRepo.updateCustomer(id, filteredUpdateData);
        return updatedCustomer;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(
            'Error updating customer',
            ApiResponse.HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

export const deleteCustomer = async (id) => {
    try {
        const customer = await customerRepo.getCustomer(id);
        if (!customer) {
            throw new AppError('Customer not found', ApiResponse.HTTP_STATUS.NOT_FOUND);
        }
        await customerRepo.deleteCustomer(id);
        return true;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(
            'Error deleting customer',
            ApiResponse.HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

