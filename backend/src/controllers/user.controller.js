const userService = require("../services/user.service");
const ApiResponse = require("../common/ApiReponse");
const { HTTP_STATUS, MESSAGES } = require("../constants");

async function register(req, res, next) {
    try {
        const user = req.body
        const newUser = await userService.register(user)
        new ApiResponse(HTTP_STATUS.CREATED, MESSAGES.AUTH.REGISTER_SUCCESS, newUser).send(res)
    } catch (error) {
        next(error)
    }
}

async function login(req, res, next) {
    try {
        const { email, password } = req.body
        const user = await userService.login(email, password)
        new ApiResponse(HTTP_STATUS.OK, MESSAGES.AUTH.LOGIN_SUCCESS, user).send(res)
    } catch (error) {
        next(error)
    }
}

async function findAll(req, res, next) {
    try {
        const users = await userService.findAll()
        new ApiResponse(HTTP_STATUS.OK, MESSAGES.USER.GET_ALL_SUCCESS, users).send(res)
    } catch (error) {
        next(error)
    }
}

async function findById(req, res, next) {
    try {
        const id = req.params.id
        const user = await userService.findById(id)
        new ApiResponse(HTTP_STATUS.OK, MESSAGES.USER.GET_DETAIL_SUCCESS, user).send(res)
    } catch (error) {
        next(error)
    }
}
module.exports = {
    register,
    login,
    findAll,
    findById,
}
