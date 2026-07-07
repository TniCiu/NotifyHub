const Joi = require("joi")
const {
    NOTIFICATION_CHANNEL,
    NOTIFICATION_CHANNELS,
    NOTIFICATION_STATUSES,
} = require("../constants")

const createNotificationSchema = Joi.object({
    requestId: Joi.string()
        .trim()
        .max(100),
    templateCode: Joi.string()
        .trim()
        .min(1)
        .max(100)
        .required(),
    channel: Joi.string()
        .valid(...NOTIFICATION_CHANNELS),
    receiver: Joi.when("channel", {
        is: NOTIFICATION_CHANNEL.EMAIL,
        then: Joi.string().trim().email().required(),
        otherwise: Joi.string().trim().min(1).max(255).required(),
    }),
    subject: Joi.string()
        .trim()
        .max(255)
        .allow(null, ""),
    payload: Joi.object(),
    data: Joi.object(),
})
    .or("payload", "data")
    .custom((value) => {
        if (!value.payload && value.data) {
            value.payload = value.data
        }
        delete value.data
        return value
    })

const getNotificationsQuerySchema = Joi.object({
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
        .valid(...NOTIFICATION_STATUSES),
    channel: Joi.string()
        .valid(...NOTIFICATION_CHANNELS),
    requestId: Joi.string()
        .trim()
        .allow(""),
})

const notificationRequestIdSchema = Joi.object({
    requestId: Joi.string()
        .trim()
        .min(1)
        .max(100)
        .required(),
})

module.exports = {
    createNotificationSchema,
    getNotificationsQuerySchema,
    notificationRequestIdSchema,
}
