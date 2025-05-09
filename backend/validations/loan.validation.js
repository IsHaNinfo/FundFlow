import Joi from "joi";

export const loanValidation = {
    createLoan: Joi.object({
        body: Joi.object({
            loanAmount: Joi.number().required().min(0).messages({
                'number.base': 'Loan amount must be a number',
                'number.min': 'Loan amount cannot be negative',
                'any.required': 'Loan amount is required'
            }),
            durationMonths: Joi.number().integer().required().min(1).messages({
                'number.base': 'Duration must be a number',
                'number.integer': 'Duration must be an integer',
                'number.min': 'Duration must be at least 1 month',
                'any.required': 'Duration is required'
            }),
            purpose: Joi.string().required().messages({
                'string.base': 'Purpose must be a string',
                'any.required': 'Purpose is required'
            }),
            monthlyIncome: Joi.number().required().min(0).messages({
                'number.base': 'Monthly income must be a number',
                'number.min': 'Monthly income cannot be negative',
                'any.required': 'Monthly income is required'
            }),
            existingLoans: Joi.number().required().min(0).messages({
                'number.base': 'Existing loans must be a number',
                'number.min': 'Existing loans cannot be negative',
                'any.required': 'Existing loans is required'
            })
        })
    }),

    getLoanById: Joi.object({
        params: Joi.object({
            id: Joi.string().uuid().required().messages({
                'string.guid': 'ID must be a valid UUID',
                'any.required': 'ID is required'
            })
        })
    }),

    updateLoan: Joi.object({
        params: Joi.object({
            id: Joi.string().uuid().required().messages({
                'string.guid': 'ID must be a valid UUID',
                'any.required': 'ID is required'
            })
        }),
        body: Joi.object({
            status: Joi.string().valid('pending', 'approved', 'rejected').required().messages({
                'string.base': 'Status must be a string',
                'any.only': 'Status must be one of: pending, approved, rejected',
                'any.required': 'Status is required'
            })
        })
    }),

    deleteLoan: Joi.object({
        params: Joi.object({
            id: Joi.string().uuid().required().messages({
                'string.guid': 'ID must be a valid UUID',
                'any.required': 'ID is required'
            })
        })
    })
}; 