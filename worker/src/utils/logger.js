const sails = require("sails")
const loggerConfig = require("../config/logger")

const LEVELS = {
    debug: 10,
    info: 20,
    warn: 30,
    error: 40,
}

const configuredLevel = loggerConfig.level
const minimumLevel = LEVELS[configuredLevel] || LEVELS.info

function shouldLog(level) {
    return LEVELS[level] >= minimumLevel
}

function sanitizeContext(context) {
    if (!context || typeof context !== "object") {
        return context
    }

    const sanitized = { ...context }

    if (sanitized.pass) {
        sanitized.pass = "******"
    }

    if (sanitized.password) {
        sanitized.password = "******"
    }

    if (sanitized.emailConfig && sanitized.emailConfig.pass) {
        sanitized.emailConfig = {
            ...sanitized.emailConfig,
            pass: "******",
        }
    }

    return sanitized
}

function formatValue(value) {
    if (value instanceof Error) {
        return loggerConfig.includeStack ? value.stack : value.message
    }

    if (typeof value === "object" && value !== null) {
        return JSON.stringify(sanitizeContext(value))
    }

    return value
}

function formatContext(context = {}) {
    const sanitized = sanitizeContext(context)
    const entries = Object.entries(sanitized)
        .filter(([, value]) => value !== undefined && value !== null)

    if (entries.length === 0) {
        return ""
    }

    return ` ${entries.map(([key, value]) => `${key}=${formatValue(value)}`).join(" ")}`
}

function write(level, component, message, context = {}) {
    if (!shouldLog(level)) {
        return
    }

    const line = `[${component}] ${message}${formatContext(context)}`
    const log = sails.log[level] || sails.log.info
    log(line)
}

function createLogger(defaultComponent, defaultContext = {}) {
    return {
        debug: (message, context) => write("debug", defaultComponent, message, { ...defaultContext, ...context }),
        info: (message, context) => write("info", defaultComponent, message, { ...defaultContext, ...context }),
        warn: (message, context) => write("warn", defaultComponent, message, { ...defaultContext, ...context }),
        error: (message, context) => write("error", defaultComponent, message, { ...defaultContext, ...context }),
        child(childContext = {}) {
            return createLogger(defaultComponent, { ...defaultContext, ...childContext })
        },
    }
}

module.exports = {
    createLogger,
    worker: createLogger("Worker"),
    amqp: createLogger("AMQP"),
    notificationConsumer: createLogger("NotificationConsumer"),
    notificationService: createLogger("NotificationService"),
    emailService: createLogger("EmailService"),
    database: createLogger("Database"),
}
