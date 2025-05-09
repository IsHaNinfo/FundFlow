import { User } from "../models/user.modal.js";

export const createUser = async ({ userData }) => {
    console.log("Repository - Received userData:", JSON.stringify(userData, null, 2));
    try {
        const createdUser = await User.create(userData);
        return createdUser;
    } catch (error) {
        console.error("Repository - Error creating user:", error);
        throw error;
    }
};

export const getUserByEmail = async (email) => {
    try {
        return await User.findOne({ where: { email } });
    } catch (error) {
        throw error;
    }
};

export const getUserByNIC = async (nic) => {
    try {
        return await User.findOne({ where: { nic } });
    } catch (error) {
        throw error;
    }
};

export const getAllUsers = async () => {
    try {
        return await User.findAll({
            where: { role: 'customer' },
            attributes: { exclude: ['password'] }
        });
    } catch (error) {
        throw error;
    }
};

export const getUserById = async (id) => {
    try {
        return await User.findByPk(id, {
            attributes: { exclude: ['password'] }
        });
    } catch (error) {
        throw error;
    }
};

export const updateUser = async (id, userData) => {
    try {
        const user = await User.findOne({
            where: { id }
        });
        if (!user) return null;
        return await user.update(userData);
    } catch (error) {
        throw error;
    }
}

export const deleteUser = async (id) => {
    try {
        const user = await User.findOne({
            where: { id }
        });
        if (!user) return false;
        await user.destroy();
        return true;
    } catch (error) {
        throw error;
    }
}

export const getUsersByRole = async (role) => {
    try {
        return await User.findAll({
            where: { role },
            attributes: { exclude: ['password'] }
        });
    } catch (error) {
        throw error;
    }
};
