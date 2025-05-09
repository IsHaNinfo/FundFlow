import Joi from "joi";

export const customerProfileValidation = {
    createProfile: Joi.object({
        body: Joi.object({
            monthlyIncome: Joi.number().required().min(0).messages({
                'number.base': 'Monthly income must be a number',
                'number.min': 'Monthly income cannot be negative',
                'any.required': 'Monthly income is required'
            })
        })
    }),

    getProfileById: Joi.object({
        params: Joi.object({
            id: Joi.number().integer().required().messages({
                'number.base': 'ID must be a number',
                'number.integer': 'ID must be an integer',
                'any.required': 'ID is required'
            })
        })
    }),

    getProfileByUserId: Joi.object({
        params: Joi.object({
            userId: Joi.string().uuid().required().messages({
                'string.guid': 'User ID must be a valid UUID',
                'any.required': 'User ID is required'
            })
        })
    }),

    updateProfile: Joi.object({
        params: Joi.object({
            id: Joi.number().integer().required().messages({
                'number.base': 'ID must be a number',
                'number.integer': 'ID must be an integer',
                'any.required': 'ID is required'
            })
        }),
        body: Joi.object({
            monthlyIncome: Joi.number().min(0).messages({
                'number.base': 'Monthly income must be a number',
                'number.min': 'Monthly income cannot be negative'
            })
        })
    }),

    deleteProfile: Joi.object({
        params: Joi.object({
            id: Joi.number().integer().required().messages({
                'number.base': 'ID must be a number',
                'number.integer': 'ID must be an integer',
                'any.required': 'ID is required'
            })
        })
    })
}; 