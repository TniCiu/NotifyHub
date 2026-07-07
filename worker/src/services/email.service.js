const emailConfig = require("../config/email")
const { getTransporter } = require("../utils/mailer")
const { emailService: logger } = require("../utils/logger")

async function sendEmail({ to, subject, html }) {
    logger.debug("sendMail", {
        to,
        subject,
        from: emailConfig.from,
    })

    return getTransporter().sendMail({
        from: emailConfig.from,
        to,
        subject,
        html,
    })
}

module.exports = {
    sendEmail,
}
