const amqp = require("amqplib")
const queueConfig = require("../config/queue")
const { amqp: logger } = require("./logger")

async function createNotificationChannel() {
    if (!queueConfig.rabbitmqUrl) {
        throw new Error("RabbitMQ URL is not configured")
    }

    logger.info("startConnection connecting", {
        queueName: queueConfig.notificationQueue,
    })

    const connection = await amqp.connect(queueConfig.rabbitmqUrl)
    const channel = await connection.createChannel()

    connection.on("close", () => {
        logger.warn("startConnection closed", {
            queueName: queueConfig.notificationQueue,
        })
    })

    connection.on("error", (error) => {
        logger.error("startConnection error", {
            queueName: queueConfig.notificationQueue,
            error,
        })
    })

    channel.on("error", (error) => {
        logger.error("startChannel error", {
            queueName: queueConfig.notificationQueue,
            error,
        })
    })

    await channel.assertQueue(queueConfig.notificationQueue, { durable: true })
    channel.prefetch(1)

    logger.info("startConnection connected", {
        queueName: queueConfig.notificationQueue,
    })
    logger.info("startChannel Channel is created", {
        queueName: queueConfig.notificationQueue,
    })

    return {
        connection,
        channel,
        queueName: queueConfig.notificationQueue,
    }
}

module.exports = {
    createNotificationChannel,
}
