const userService = require("../services/user.service")
const ApiResponse = require("../common/ApiReponse")
const { HTTP_STATUS, MESSAGES } = require("../constants")
const asyncHandler = require("../common/asyncHandler")

const register = asyncHandler(async (req, res, next) => {
    const user = req.body
    const newUser = await userService.register(user)
    new ApiResponse(HTTP_STATUS.CREATED, MESSAGES.AUTH.REGISTER_SUCCESS, newUser).send(res)
})

const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body
    const user = await userService.login(email, password)
    new ApiResponse(HTTP_STATUS.OK, MESSAGES.AUTH.LOGIN_SUCCESS, user).send(res)
})

const findAll = asyncHandler(async (req, res, next) => {
    const users = await userService.findAll()
    new ApiResponse(HTTP_STATUS.OK, MESSAGES.USER.GET_ALL_SUCCESS, users).send(res)
})

const findById = asyncHandler(async (req, res, next) => {
    const id = req.params.id
    const user = await userService.findById(id)
    new ApiResponse(HTTP_STATUS.OK, MESSAGES.USER.GET_DETAIL_SUCCESS, user).send(res)
})

module.exports = {
    register,
    login,
    findAll,
    findById,
}
