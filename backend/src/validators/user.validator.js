const AppError = require("../common/AppError");
const { HTTP_STATUS, MESSAGES } = require("../constants");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

function isBlank(value) {
    return typeof value !== "string" || value.trim() === "";
}

function validateEmail(email) {
    if (isBlank(email)) {
        throw new AppError(MESSAGES.AUTH.EMAIL_REQUIRED, HTTP_STATUS.BAD_REQUEST);
    }
    if (!EMAIL_REGEX.test(email.trim())) {
        throw new AppError(MESSAGES.AUTH.EMAIL_INVALID, HTTP_STATUS.BAD_REQUEST);
    }
}

function validatePassword(password) {
    if (isBlank(password)) {
        throw new AppError(MESSAGES.AUTH.PASSWORD_REQUIRED, HTTP_STATUS.BAD_REQUEST);
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
        throw new AppError(MESSAGES.AUTH.PASSWORD_MIN_LENGTH, HTTP_STATUS.BAD_REQUEST);
    }
}

function validatePasswordRequired(password) {
    if (isBlank(password)) {
        throw new AppError(MESSAGES.AUTH.PASSWORD_REQUIRED, HTTP_STATUS.BAD_REQUEST);
    }
}

function validateRegister(req, res, next) {
    try {
        const { fullName, full_name, email, password } = req.body;

        if (isBlank(fullName) && isBlank(full_name)) {
            throw new AppError(MESSAGES.AUTH.FULL_NAME_REQUIRED, HTTP_STATUS.BAD_REQUEST);
        }

        validateEmail(email);
        validatePassword(password);
        next();
    } catch (error) {
        next(error);
    }
}

function validateLogin(req, res, next) {
    try {
        const { email, password } = req.body;

        validateEmail(email);
        validatePasswordRequired(password);
        next();
    } catch (error) {
        next(error);
    }
}

function validateUserId(req, res, next) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            throw new AppError(MESSAGES.USER.ID_INVALID, HTTP_STATUS.BAD_REQUEST);
        }

        next();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    validateRegister,
    validateLogin,
    validateUserId,
};
