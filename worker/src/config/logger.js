module.exports = {
    service: process.env.SERVICE_NAME || "notifyhub-worker",
    env: process.env.NODE_ENV || "development",
    level: process.env.LOG_LEVEL || "info",
    includeStack: process.env.LOG_STACK === "true" || process.env.NODE_ENV !== "production",
}
