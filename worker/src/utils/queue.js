const amqp = require("amqplib")
const queueConfig = require("../config/queue")

async function createNotificationChannel() {
    if (!queueConfig.rabbitmqUrl) {
        throw new Error("RabbitMQ URL is not configured")
    }

    const connection = await amqp.connect(queueConfig.rabbitmqUrl)
    const channel = await connection.createChannel()

    await channel.assertQueue(queueConfig.notificationQueue, { durable: true })
    channel.prefetch(1)

    return {
        connection,
        channel,
        queueName: queueConfig.notificationQueue,
    }
}

module.exports = {
    createNotificationChannel,
}
