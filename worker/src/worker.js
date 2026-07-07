require("dotenv").config()

const { startNotificationConsumer } = require("./consumers/notification.consumer")

startNotificationConsumer().catch((error) => {
    console.error("[Worker]", error.message)
    process.exit(1)
})
