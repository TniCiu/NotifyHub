const { verifyToken } = require("../utils/jwt")
const ApiResponse = require("../common/ApiReponse")
const { HTTP_STATUS, MESSAGES } = require("../constants")

function authMiddleware(req, res, next) {

    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return new ApiResponse(HTTP_STATUS.UNAUTHORIZED, MESSAGES.AUTH.ACCESS_TOKEN_MISSING, null).send(res)
        }

        const token = authHeader.split(" ")[1]
        const decoded = verifyToken(token)
        req.user = decoded
        next()

    } catch (error) {
        return new ApiResponse(HTTP_STATUS.UNAUTHORIZED, MESSAGES.AUTH.TOKEN_INVALID, null).send(res)
    }
}
module.exports = authMiddleware
