import Joi from "joi";

export const userValidation = {
    createUser: Joi.object({
        firstName: Joi.string().required().min(2).max(50),
        lastName: Joi.string().required().min(2).max(50),
        email: Joi.string().required().email(),
        nic: Joi.string().required().min(10).max(12),
        phoneNumber: Joi.string().required().min(10).max(15),
        role: Joi.string().required().valid("admin", "customer")
    }),

    getUserById: Joi.object({
        id: Joi.string().required().uuid()
    }),

    updateUser: Joi.object({
        id: Joi.string().required().uuid(),
        firstName: Joi.string().min(2).max(50),
        lastName: Joi.string().min(2).max(50),
        email: Joi.string().email(),
        nic: Joi.string().min(10).max(12),
        phoneNumber: Joi.string().min(10).max(15),
        role: Joi.string().valid("admin", "customer")
    }),

    deleteUser: Joi.object({
        id: Joi.string().required().uuid()
    }),

    getUsersByRole: Joi.object({
        role: Joi.string().required().valid("admin", "customer")
    })
}; 