import AppError from "../utils/AppError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            return next(new AppError(errorMessage, ApiResponse.HTTP_STATUS.BAD_REQUEST));
        }

        next();
    };
}; 