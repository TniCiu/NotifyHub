const Joi = require("joi");
const { MESSAGES } = require("../constants")

const registerSchema = Joi.object({
    fullName: Joi.string()
        .trim()
        .min(1)
        .messages({
            "string.base": MESSAGES.AUTH.FULL_NAME_REQUIRED,
            "string.empty": MESSAGES.AUTH.FULL_NAME_REQUIRED,
            "any.required": MESSAGES.AUTH.FULL_NAME_REQUIRED,
        }),
    full_name: Joi.string()
        .trim()
        .min(1)
        .messages({
            "string.base": MESSAGES.AUTH.FULL_NAME_REQUIRED,
            "string.empty": MESSAGES.AUTH.FULL_NAME_REQUIRED,
        }),
    email: Joi.string()
        .trim()
        .email()
        .required()
        .messages({
            "string.base": MESSAGES.AUTH.EMAIL_REQUIRED,
            "string.empty": MESSAGES.AUTH.EMAIL_REQUIRED,
            "string.email": MESSAGES.AUTH.EMAIL_INVALID,
        }),
    password: Joi.string()
        .min(6)
        .required()
        .messages({
            "string.base": MESSAGES.AUTH.PASSWORD_REQUIRED,
            "string.empty": MESSAGES.AUTH.PASSWORD_REQUIRED,
            "string.min": MESSAGES.AUTH.PASSWORD_MIN_LENGTH,
        }),
})
    .or("fullName", "full_name")
    .messages({
        "object.missing": MESSAGES.AUTH.FULL_NAME_REQUIRED,
    });

const loginSchema = Joi.object({
    email: Joi.string()
        .trim()
        .email()
        .required()
        .messages({
            "string.base": MESSAGES.AUTH.EMAIL_REQUIRED,
            "string.empty": MESSAGES.AUTH.EMAIL_REQUIRED,
            "string.email": MESSAGES.AUTH.EMAIL_INVALID,
        }),
    password: Joi.string()
        .required()
        .messages({
            "string.base": MESSAGES.AUTH.PASSWORD_REQUIRED,
            "string.empty": MESSAGES.AUTH.PASSWORD_REQUIRED,
        }),
});

const userIdSchema = Joi.object({
    id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": MESSAGES.USER.ID_INVALID,
            "number.integer": MESSAGES.USER.ID_INVALID,
            "number.positive": MESSAGES.USER.ID_INVALID,
            "any.required": MESSAGES.USER.ID_INVALID,
        }),
});

module.exports = {
    registerSchema,
    loginSchema,
    userIdSchema,
};
