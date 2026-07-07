const { verifyToken } = require("../utils/jwt")
const AppError = require("../common/AppError")
const { HTTP_STATUS, MESSAGES, ERROR_CODE } = require("../constants")

function authMiddleware(req, res, next) {

    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return next(
                new AppError(
                    MESSAGES.AUTH.ACCESS_TOKEN_MISSING,
                    HTTP_STATUS.UNAUTHORIZED,
                    ERROR_CODE.AUTH.ACCESS_TOKEN_MISSING
                )
            )
        }

        const token = authHeader.split(" ")[1]
        const decoded = verifyToken(token)
        req.user = decoded
        next()

    } catch (error) {
        return next(
            new AppError(
                MESSAGES.AUTH.TOKEN_INVALID,
                HTTP_STATUS.UNAUTHORIZED,
                ERROR_CODE.AUTH.TOKEN_INVALID
            )
        )
    }
}
module.exports = authMiddleware
