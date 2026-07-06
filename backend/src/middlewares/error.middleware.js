const { HTTP_STATUS, HTTP_STATUS_TEXT, MESSAGES } = require("../constants");

const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    const response = {
        success: false,
        message: err.message || MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
        errorCode: err.errorCode || MESSAGES.ERROR.INTERNAL_SERVER_ERROR
    };

    if (err.errors) {
        response.errors = err.errors;
    }

    res.status(statusCode).json(response);
};

module.exports = errorMiddleware;
