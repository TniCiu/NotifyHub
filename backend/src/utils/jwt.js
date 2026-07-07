const jwt = require('jsonwebtoken')
const jwtConfig = require("../config/jwt")
const { MESSAGES } = require("../constants")

function signToken(payload) {
    if (!jwtConfig.secret) {
        throw new Error(MESSAGES.AUTH.JWT_SECRET_MISSING)
    }

    return jwt.sign(payload, jwtConfig.secret, {
        expiresIn: jwtConfig.expiresIn
    })
}

function verifyToken(token) {
    if (!jwtConfig.secret) {
        throw new Error(MESSAGES.AUTH.JWT_SECRET_MISSING)
    }

    return jwt.verify(token, jwtConfig.secret)
}

module.exports = {
    signToken,
    verifyToken
}
