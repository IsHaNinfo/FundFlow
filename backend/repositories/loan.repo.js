import { Loan } from "../models/loan.modal.js";
import { Customer } from "../models/customer.modal.js";

export const createLoan = async (loanData) => {
    const newLoan = await Loan.create(loanData);
    return newLoan;
};

export const getLoan = async (id) => {
    console.log(id);
    const loan = await Loan.findOne({
        where: { id },
    });
    console.log(loan);
    return loan;
};

export const getAllLoans = async () => {
    const loans = await Loan.findAll({});
    return loans;
};

export const updateLoan = async (id, updateData) => {
    const [updated] = await Loan.update(updateData, {
        where: { id }
    });
    if (updated) {
        const updatedLoan = await Loan.findOne({
            where: { id },

        });
        return updatedLoan;
    }
    return null;
};

export const deleteLoan = async (id) => {
    const deleted = await Loan.destroy({
        where: { id }
    });
    return deleted;
};

export const getLoansByCustomerId = async (customerId) => {
    try {
        console.log('Customer ID:', customerId);
        const loans = await Loan.findAll({
            where: { customerId },
            include: [{
                model: Customer,
                as: 'customer',
                attributes: ['firstName', 'lastName', 'email', 'phoneNumber']
            }]
        });
        console.log('Found loans:', loans);
        return loans;
    } catch (error) {
        console.error('Error in getLoansByCustomerId:', error);
        throw error;
    }
};
