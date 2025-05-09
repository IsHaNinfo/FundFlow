import { Loan } from "../models/loan.modal.js";
import { User } from "../models/user.modal.js";

export const createLoan = async (loanData) => {
    const newLoan = await Loan.create(loanData);
    return newLoan;
};

export const getLoan = async (id) => {
    const loan = await Loan.findOne({
        where: { id },
        include: [{
            model: User,
            as: 'user',
            attributes: ['firstName', 'lastName', 'email', 'phoneNumber']
        }]
    });
    return loan;
};

export const getAllLoans = async () => {
    const loans = await Loan.findAll({
        include: [{
            model: User,
            as: 'user',
            attributes: ['firstName', 'lastName', 'email', 'phoneNumber']
        }]
    });
    return loans;
};

export const updateLoan = async (id, updateData) => {
    const [updated] = await Loan.update(updateData, {
        where: { id }
    });
    if (updated) {
        const updatedLoan = await Loan.findOne({
            where: { id },
            include: [{
                model: User,
                as: 'user',
                attributes: ['firstName', 'lastName', 'email', 'phoneNumber']
            }]
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

export const getLoansByUserId = async (userId) => {
    try {
        const loans = await Loan.findAll({
            where: { userId },
            include: [{
                model: User,
                as: 'user',
                attributes: ['firstName', 'lastName', 'email', 'phoneNumber']
            }]
        });
        return loans;
    } catch (error) {
        console.error('Error in getLoansByUserId:', error);
        throw error;
    }
};
