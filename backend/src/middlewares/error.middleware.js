const { HTTP_STATUS, HTTP_STATUS_TEXT, MESSAGES } = require("../constants");

const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;

    res.status(statusCode).json({
        status: HTTP_STATUS_TEXT[statusCode] || "Error",
        message: err.message || MESSAGES.ERROR.INTERNAL_SERVER_ERROR
    });
};

module.exports = errorMiddleware;
