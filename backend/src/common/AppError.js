class AppError extends Error {
    constructor(message, statusCode, errorCode, errors) {
        super(message)

        this.statusCode = statusCode
        this.errorCode = typeof errorCode === "string" ? errorCode : undefined
        this.errors = typeof errorCode === "string" ? errors : errorCode
        this.isOperational = true
    }
}

module.exports = AppError
