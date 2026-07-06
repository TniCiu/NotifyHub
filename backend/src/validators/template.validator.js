const Joi = require("joi");
const { MESSAGES } = require("../constants");

const TEMPLATE_CHANNELS = ["EMAIL", "SMS", "PUSH"];
const TEMPLATE_STATUSES = ["ACTIVE", "INACTIVE"];

const templateIdSchema = Joi.object({
    id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": MESSAGES.TEMPLATE.ID_INVALID,
            "number.integer": MESSAGES.TEMPLATE.ID_INVALID,
            "number.positive": MESSAGES.TEMPLATE.ID_INVALID,
            "any.required": MESSAGES.TEMPLATE.ID_INVALID,
        }),
});

const createTemplateSchema = Joi.object({
    templateCode: Joi.string()
        .trim()
        .min(1)
        .required(),
    templateName: Joi.string()
        .trim()
        .min(1)
        .required(),
    channel: Joi.string()
        .valid(...TEMPLATE_CHANNELS)
        .required(),
    subject: Joi.string()
        .trim()
        .allow(null, ""),
    content: Joi.string()
        .trim()
        .min(1)
        .required(),
});

const updateTemplateSchema = Joi.object({
    templateName: Joi.string()
        .trim()
        .min(1)
        .required(),
    channel: Joi.string()
        .valid(...TEMPLATE_CHANNELS)
        .required(),
    subject: Joi.string()
        .trim()
        .allow(null, ""),
    content: Joi.string()
        .trim()
        .min(1)
        .required(),
    status: Joi.string()
        .valid(...TEMPLATE_STATUSES)
        .required(),
});

const getTemplatesQuerySchema = Joi.object({
    page: Joi.number()
        .integer()
        .positive()
        .default(1),
    limit: Joi.number()
        .integer()
        .positive()
        .max(100)
        .default(10),
    keyword: Joi.string()
        .trim()
        .allow(""),
    status: Joi.string()
        .valid(...TEMPLATE_STATUSES),
    channel: Joi.string()
        .valid(...TEMPLATE_CHANNELS),
});

const previewTemplateSchema = Joi.object({
    content: Joi.string()
        .trim()
        .min(1)
        .required(),
    data: Joi.object()
        .required(),
});

module.exports = {
    templateIdSchema,
    createTemplateSchema,
    updateTemplateSchema,
    getTemplatesQuerySchema,
    previewTemplateSchema,
};
