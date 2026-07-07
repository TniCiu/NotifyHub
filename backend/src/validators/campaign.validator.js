const Joi = require("joi");
const {
    NOTIFICATION_CHANNEL,
    NOTIFICATION_CHANNELS,
} = require("../constants");

const CAMPAIGN_STATUSES = ["PENDING", "PROCESSING", "COMPLETED", "FAILED"];

const campaignIdSchema = Joi.object({
    id: Joi.number()
        .integer()
        .positive()
        .required(),
});

const receiverSchema = Joi.object({
    receiver: Joi.when("...channel", {
        is: NOTIFICATION_CHANNEL.EMAIL,
        then: Joi.string().trim().email().required(),
        otherwise: Joi.string().trim().min(1).max(255).required(),
    }),
    data: Joi.object()
        .required(),
});

const createCampaignSchema = Joi.object({
    campaignCode: Joi.string()
        .trim()
        .max(100),
    campaignName: Joi.string()
        .trim()
        .min(1)
        .max(255)
        .required(),
    templateCode: Joi.string()
        .trim()
        .min(1)
        .max(100)
        .required(),
    channel: Joi.string()
        .valid(...NOTIFICATION_CHANNELS),
    receivers: Joi.array()
        .items(receiverSchema)
        .min(1)
        .required(),
});

const getCampaignsQuerySchema = Joi.object({
    page: Joi.number()
        .integer()
        .positive()
        .default(1),
    limit: Joi.number()
        .integer()
        .positive()
        .max(100)
        .default(10),
    status: Joi.string()
        .valid(...CAMPAIGN_STATUSES),
});

module.exports = {
    campaignIdSchema,
    createCampaignSchema,
    getCampaignsQuerySchema,
};
