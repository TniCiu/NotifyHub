const nodemailer = require("nodemailer")
const emailConfig = require("../config/email")

let transporter

function getTransporter() {
    if (transporter) {
        return transporter
    }

    if (!emailConfig.host || !emailConfig.user || !emailConfig.pass) {
        throw new Error("Email configuration is missing")
    }

    transporter = nodemailer.createTransport({
        host: emailConfig.host,
        port: emailConfig.port,
        secure: emailConfig.secure,
        auth: {
            user: emailConfig.user,
            pass: emailConfig.pass,
        },
    })

    return transporter
}

module.exports = {
    getTransporter,
}
