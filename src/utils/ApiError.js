// Custom error class so controllers/services can throw errors
// with a specific HTTP status code, caught by the global error handler.
class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.success = false;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ApiError;
