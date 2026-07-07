module.exports = {
    rabbitmqUrl: process.env.RABBITMQ_URL,
    notificationQueue: process.env.NOTIFICATION_QUEUE || "notification_queue",
}
