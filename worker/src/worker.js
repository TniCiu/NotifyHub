require("dotenv").config()

const { startNotificationConsumer } = require("./consumers/notification.consumer")
const { worker: logger } = require("./utils/logger")

async function bootstrap() {
    logger.info("bootstrap start", {
        pid: process.pid,
        nodeVersion: process.version,
    })

    await startNotificationConsumer()

    logger.info("bootstrap success", {
        pid: process.pid,
    })
}

function registerShutdownHandlers() {
    const shutdown = (signal) => {
        logger.warn("shutdown signal", {
            signal,
            pid: process.pid,
        })
        process.exit(0)
    }

    process.on("SIGINT", shutdown)
    process.on("SIGTERM", shutdown)

    process.on("unhandledRejection", (error) => {
        logger.error("unhandledRejection", { error })
    })

    process.on("uncaughtException", (error) => {
        logger.error("uncaughtException", { error })
        process.exit(1)
    })
}

registerShutdownHandlers()

bootstrap().catch((error) => {
    logger.error("bootstrap failed", {
        error,
    })
    process.exit(1)
})
