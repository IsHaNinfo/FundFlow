import AppError from '../utils/AppError.js';
import ApiResponse from '../utils/ApiResponse.js';

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || ApiResponse.HTTP_STATUS.INTERNAL_SERVER_ERROR;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json(
            ApiResponse.error(
                err.message,
                err.statusCode,
                {
                    error: err,
                    stack: err.stack
                }
            )
        );
    } else {
        // Production mode
        if (err.isOperational) {
            res.status(err.statusCode).json(
                ApiResponse.error(
                    err.message,
                    err.statusCode
                )
            );
        } else {
            // Programming or unknown errors: don't leak error details
            console.error('ERROR 💥', err);
            res.status(ApiResponse.HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
                ApiResponse.error(
                    'Something went wrong!',
                    ApiResponse.HTTP_STATUS.INTERNAL_SERVER_ERROR
                )
            );
        }
    }
};

export default errorHandler; 