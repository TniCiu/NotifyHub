const { sendEmail } = require("./email.service")
const NotificationRepository = require("../repositories/notification.repository")
const { notificationService: logger } = require("../utils/logger")

const NOTIFICATION_CHANNEL = {
    EMAIL: "EMAIL",
}

const NOTIFICATION_STATUS = {
    SENT: "SENT",
    FAILED: "FAILED",
}

async function handleNotification(notification) {
    if (notification.channel !== NOTIFICATION_CHANNEL.EMAIL) {
        throw new Error(`Unsupported notification channel: ${notification.channel}`)
    }

    logger.info("sendEmail start", {
        requestId: notification.requestId,
        receiver: notification.receiver,
    })

    const response = await sendEmail({
        to: notification.receiver,
        subject: notification.subject,
        html: notification.content,
    })

    await NotificationRepository.updateRequestStatus(notification.requestId, NOTIFICATION_STATUS.SENT)
    logger.info("updateStatus success", {
        requestId: notification.requestId,
        status: NOTIFICATION_STATUS.SENT,
    })

    await NotificationRepository.createLog({
        requestId: notification.requestId,
        action: "SEND_EMAIL",
        status: NOTIFICATION_STATUS.SENT,
        message: "Email sent successfully",
        rawRequest: notification,
        rawResponse: response,
    })

    logger.info("sendEmail success", {
        requestId: notification.requestId,
        messageId: response.messageId,
    })
}

async function handleNotificationError(notification, error) {
    await NotificationRepository.updateRequestStatus(
        notification.requestId,
        NOTIFICATION_STATUS.FAILED,
        error.message
    )
    logger.info("updateStatus success", {
        requestId: notification.requestId,
        status: NOTIFICATION_STATUS.FAILED,
    })

    await NotificationRepository.createLog({
        requestId: notification.requestId,
        action: "SEND_EMAIL",
        status: NOTIFICATION_STATUS.FAILED,
        message: error.message,
        rawRequest: notification,
    })
}

module.exports = {
    handleNotification,
    handleNotificationError,
}
