import { Customer } from "../models/customer.modal.js";

export const createCustomer = async (customerData) => {
    const newCustomer = await Customer.create(customerData);
    return newCustomer;
};

export const getCustomer = async (id) => {
    const customer = await Customer.findByPk(id);
    return customer;
};

export const getAllCustomers = async () => {
    const customers = await Customer.findAll({
        order: [['createdAt', 'DESC']]
    });
    return customers;
};

export const findByEmail = async (email) => {
    const customer = await Customer.findOne({
        where: { email }
    });
    return customer;
};

export const updateCustomer = async (id, updateData) => {
    const [updated] = await Customer.update(updateData, {
        where: { id }
    });
    if (updated) {
        const updatedCustomer = await Customer.findByPk(id);
        return updatedCustomer;
    }
    return null;
};

export const deleteCustomer = async (id) => {
    const deleted = await Customer.destroy({
        where: { id }
    });
    return deleted;
};



