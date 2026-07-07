const amqp = require("amqplib")
const queueConfig = require("../config/queue")

let connection
let channel

async function getChannel() {
    if (channel) {
        return channel
    }

    if (!queueConfig.rabbitmqUrl) {
        throw new Error("RabbitMQ URL is not configured")
    }

    connection = await amqp.connect(queueConfig.rabbitmqUrl)
    channel = await connection.createChannel()
    await channel.assertQueue(queueConfig.notificationQueue, { durable: true })

    connection.on("close", () => {
        connection = null
        channel = null
    })

    connection.on("error", () => {
        connection = null
        channel = null
    })

    return channel
}

async function publishNotification(message) {
    const activeChannel = await getChannel()
    return activeChannel.sendToQueue(
        queueConfig.notificationQueue,
        Buffer.from(JSON.stringify(message)),
        { persistent: true }
    )
}

module.exports = {
    publishNotification,
}
