class ApiResponse {
    static success(data, message = 'Success', statusCode = 200) {
        return {
            success: true,
            statusCode,
            message,
            data
        };
    }

    static error(message, statusCode = 500, errors = null) {
        return {
            success: false,
            statusCode,
            message,
            errors
        };
    }

    // Common status codes
    static get HTTP_STATUS() {
        return {
            OK: 200,
            CREATED: 201,
            BAD_REQUEST: 400,
            UNAUTHORIZED: 401,
            FORBIDDEN: 403,
            NOT_FOUND: 404,
            CONFLICT: 409,
            INTERNAL_SERVER_ERROR: 500
        };
    }
}

export default ApiResponse; 