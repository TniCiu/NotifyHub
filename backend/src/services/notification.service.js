const { v4: uuidv4 } = require("uuid")
const TemplateRepository = require("../repositories/template.repository")
const NotificationRepository = require("../repositories/notification.repository")
const { extractVariables, renderTemplate } = require("../utils/template.util")
const { publishNotification } = require("../utils/queue.util")
const { HTTP_STATUS, MESSAGES, ERROR_CODE, NOTIFICATION_STATUS } = require("../constants")
const AppError = require("../common/AppError")

async function createNotification(payload) {
    const notificationPayload = payload.payload || payload.data || {}
    const template = await TemplateRepository.findByCode(payload.templateCode)
    if (!template || template.status !== "ACTIVE") {
        throw new AppError(
            MESSAGES.NOTIFICATION.TEMPLATE_NOT_FOUND,
            HTTP_STATUS.NOT_FOUND,
            ERROR_CODE.NOTIFICATION.TEMPLATE_NOT_FOUND
        )
    }

    const contentVariables = Array.isArray(template.variables) && template.variables.length
        ? template.variables
        : extractVariables(template.content)
    const subjectVariables = extractVariables(template.subject || "")
    const variables = Array.from(new Set([...contentVariables, ...subjectVariables]))
    const missingVariables = variables.filter((variable) => !(variable in notificationPayload))

    if (missingVariables.length > 0) {
        throw new AppError(
            MESSAGES.TEMPLATE.MISSING_VARIABLES,
            HTTP_STATUS.BAD_REQUEST,
            ERROR_CODE.TEMPLATE.MISSING_VARIABLES,
            { missingVariables }
        )
    }

    const requestId = payload.requestId || uuidv4()
    const existingRequest = await NotificationRepository.findByRequestId(requestId)
    if (existingRequest) {
        throw new AppError(
            MESSAGES.NOTIFICATION.REQUEST_EXISTS,
            HTTP_STATUS.CONFLICT,
            ERROR_CODE.NOTIFICATION.REQUEST_EXISTS
        )
    }

    const subject = payload.subject || renderTemplate(template.subject || "", notificationPayload)
    const renderedContent = renderTemplate(template.content, notificationPayload)

    const notification = await NotificationRepository.createRequest({
        requestId,
        templateCode: payload.templateCode,
        channel: payload.channel || template.channel,
        receiver: payload.receiver,
        subject,
        payload: notificationPayload,
        renderedContent,
        status: NOTIFICATION_STATUS.PENDING,
    })

    await NotificationRepository.createLog({
        requestId,
        action: "CREATE",
        status: NOTIFICATION_STATUS.PENDING,
        message: MESSAGES.NOTIFICATION.CREATE_SUCCESS,
        rawRequest: payload,
        rawResponse: notification,
    })

    try {
        await publishNotification({
            requestId,
            channel: notification.channel,
            receiver: notification.receiver,
            subject: notification.subject,
            content: notification.rendered_content,
            payload: notification.payload,
        })

        await NotificationRepository.createLog({
            requestId,
            action: "PUBLISH",
            status: NOTIFICATION_STATUS.QUEUED,
            message: MESSAGES.NOTIFICATION.PUBLISH_SUCCESS,
            rawRequest: notification,
        })

        return NotificationRepository.updateStatus(requestId, {
            status: NOTIFICATION_STATUS.QUEUED,
            errorMessage: null,
        })
    } catch (error) {
        await NotificationRepository.createLog({
            requestId,
            action: "PUBLISH",
            status: NOTIFICATION_STATUS.FAILED,
            message: error.message,
            rawRequest: notification,
        })

        await NotificationRepository.updateStatus(requestId, {
            status: NOTIFICATION_STATUS.FAILED,
            errorMessage: error.message,
        })

        throw new AppError(
            MESSAGES.NOTIFICATION.PUBLISH_FAILED,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            ERROR_CODE.NOTIFICATION.PUBLISH_FAILED
        )
    }
}

async function getNotifications(query) {
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 10

    return NotificationRepository.findAll({
        page,
        limit,
        status: query.status,
        channel: query.channel,
        requestId: query.requestId,
    })
}

async function getNotificationByRequestId(requestId) {
    const notification = await NotificationRepository.findByRequestId(requestId)
    if (!notification) {
        throw new AppError(
            MESSAGES.NOTIFICATION.NOT_FOUND,
            HTTP_STATUS.NOT_FOUND,
            ERROR_CODE.NOTIFICATION.NOT_FOUND
        )
    }

    const logs = await NotificationRepository.findLogsByRequestId(requestId)

    return {
        ...notification,
        logs,
    }
}

module.exports = {
    createNotification,
    getNotifications,
    getNotificationByRequestId,
}
