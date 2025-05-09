import { CustomerProfile } from "../models/customerProfile.model.js";
import { User } from "../models/user.modal.js";

export const createCustomerProfile = async (profileData) => {
    try {
        const result = await CustomerProfile.create(profileData);
        return result;
    } catch (error) {
        console.error("Error creating profile:", error.message);
        throw error;
    }
};

export const getCustomerProfileById = async (id) => {
    try {
        return await CustomerProfile.findByPk(id, {
            include: [{
                model: User,
                as: 'user',
                attributes: ['firstName', 'lastName', 'email', 'phoneNumber']
            }]
        });
    } catch (error) {
        throw error;
    }
};

export const getCustomerProfileByUserId = async (userId) => {
    try {
        return await CustomerProfile.findOne({
            where: { userId: userId },
        });
    } catch (error) {
        throw error;
    }
};

export const updateCustomerProfile = async (id, profileData) => {
    try {
        const profile = await CustomerProfile.findByPk(id);
        if (!profile) return null;
        return await profile.update(profileData);
    } catch (error) {
        throw error;
    }
};

export const deleteCustomerProfile = async (id) => {
    try {
        const profile = await CustomerProfile.findByPk(id);
        if (!profile) return false;
        await profile.destroy();
        return true;
    } catch (error) {
        throw error;
    }
};

export const getAllCustomerProfiles = async () => {
    try {
        return await CustomerProfile.findAll({
            include: [{
                model: User,
                as: 'user',
                attributes: ['firstName', 'lastName', 'email', 'phoneNumber', 'nic']
            }]
        });
    } catch (error) {
        throw error;
    }
}; 