// A custom error class that extends the built-in Error.
// It adds an HTTP status code so that the global error handler
// can send the correct HTTP response status.
class AppError extends Error {
    public statusCode: number;

    constructor(statusCode: number, message: string, stack = "") {
        super(message);
        this.statusCode = statusCode;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default AppError;
