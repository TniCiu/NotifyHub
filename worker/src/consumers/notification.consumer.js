const { createNotificationChannel } = require("../utils/queue")
const {
    handleNotification,
    handleNotificationError,
} = require("../services/notification.service")

async function startNotificationConsumer() {
    const { channel, queueName } = await createNotificationChannel()

    console.log(`[Worker] Waiting for notifications on ${queueName}`)

    channel.consume(queueName, async (message) => {
        if (!message) {
            return
        }

        const notification = JSON.parse(message.content.toString())

        try {
            await handleNotification(notification)
            channel.ack(message)
        } catch (error) {
            try {
                await handleNotificationError(notification, error)
            } catch (handleError) {
                console.error("[Worker] Failed to update notification error", handleError.message)
            }
            channel.ack(message)
        }
    })
}

module.exports = {
    startNotificationConsumer,
}
