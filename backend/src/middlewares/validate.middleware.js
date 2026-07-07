const AppError = require("../common/AppError");
const { HTTP_STATUS, ERROR_CODE } = require("../constants");

function getValidationMessage(error) {
    return error.details[0].message;
}

function validateBody(schema) {
    return function (req, res, next) {
        const { error, value } = schema.validate(req.body, {
            abortEarly: true,
            stripUnknown: true,
        });

        if (error) {
            return next(
                new AppError(
                    getValidationMessage(error),
                    HTTP_STATUS.BAD_REQUEST,
                    ERROR_CODE.VALIDATION.ERROR
                )
            )
        }

        req.body = value
        next()
    };
}

function validateParams(schema) {
    return function (req, res, next) {
        const { error, value } = schema.validate(req.params, {
            abortEarly: true,
            convert: true,
            stripUnknown: true,
        });

        if (error) {
            return next(
                new AppError(
                    getValidationMessage(error),
                    HTTP_STATUS.BAD_REQUEST,
                    ERROR_CODE.VALIDATION.ERROR
                )
            )
        }

        req.params = value;
        next();
    };
}

function validateQuery(schema) {
    return function (req, res, next) {
        const { error, value } = schema.validate(req.query, {
            abortEarly: true,
            convert: true,
            stripUnknown: true,
        });

        if (error) {
            return next(
                new AppError(
                    getValidationMessage(error),
                    HTTP_STATUS.BAD_REQUEST,
                    ERROR_CODE.VALIDATION.ERROR
                )
            )
        }

        req.query = value;
        next();
    };
}

module.exports = {
    validateBody,
    validateParams,
    validateQuery,
};
