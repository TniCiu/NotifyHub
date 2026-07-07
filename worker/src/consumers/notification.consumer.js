const { createNotificationChannel } = require("../utils/queue")
const {
    handleNotification,
    handleNotificationError,
} = require("../services/notification.service")
const { notificationConsumer: logger } = require("../utils/logger")

async function startNotificationConsumer() {
    const { channel, queueName } = await createNotificationChannel()

    logger.info("subscribed", {
        queueName,
    })

    channel.consume(queueName, async (message) => {
        if (!message) {
            return
        }

        let notification

        try {
            notification = JSON.parse(message.content.toString())
        } catch (error) {
            logger.error("message parse failed", {
                error,
                rawMessage: message.content.toString(),
            })
            channel.ack(message)
            return
        }

        const messageLogger = logger.child({
            requestId: notification.requestId,
            channel: notification.channel,
            receiver: notification.receiver,
        })

        const startedAt = Date.now()

        messageLogger.info("message received")

        try {
            await handleNotification(notification)
            channel.ack(message)
            messageLogger.info("message ack", {
                durationMs: Date.now() - startedAt,
            })
        } catch (error) {
            messageLogger.error("message failed", {
                durationMs: Date.now() - startedAt,
                error,
            })
            try {
                await handleNotificationError(notification, error)
            } catch (handleError) {
                messageLogger.error("error persist failed", {
                    error: handleError,
                })
            }
            channel.ack(message)
            messageLogger.info("message ack failed", {
                durationMs: Date.now() - startedAt,
            })
        }
    })
}

module.exports = {
    startNotificationConsumer,
}
