const emailConfig = require("../config/email")
const { getTransporter } = require("../utils/mailer")

async function sendEmail({ to, subject, html }) {
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
