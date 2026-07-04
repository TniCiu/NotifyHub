const { HTTP_STATUS_TEXT } = require("../constants");

class ApiResponse {
    constructor(statusCode, message, data) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }

    send(res) {
        res.status(this.statusCode).json({
            status: HTTP_STATUS_TEXT[this.statusCode] || "Unknown",
            message: this.message,
            data: this.data
        });
    }
}

module.exports = ApiResponse
