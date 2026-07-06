const UserRepository = require('../repositories/user.repository')
const AppError = require('../common/AppError')
const { HTTP_STATUS, MESSAGES, ERROR_CODE } = require("../constants")
const { signToken } = require("../utils/jwt")

function toSafeUser(user) {
    const { password_hash, ...safeUser } = user
    return safeUser
}

async function register(user) {
    const existingUser = await UserRepository.findByEmail(user.email)
    if (existingUser) {
        throw new AppError(MESSAGES.AUTH.USER_EXISTS, HTTP_STATUS.CONFLICT, ERROR_CODE.USER.ALREADY_EXISTS)
    }
    const newUser = await UserRepository.create(user)
    return toSafeUser(newUser)
}
async function login(email, password) {
    const user = await UserRepository.findByEmail(email)
    if (!user || user.password_hash !== password) {
        throw new AppError(MESSAGES.AUTH.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED, ERROR_CODE.AUTH.INVALID_CREDENTIALS)
    }

    const token = signToken({
        id: user.id,
        email: user.email,
        role: user.role
    })

    return {
        user: toSafeUser(user),
        token
    }
}
async function findAll() {
    const users = await UserRepository.findAll()
    return users.map(toSafeUser)
}
async function findById(id) {
    const user = await UserRepository.findById(id)
    if (!user) {
        throw new AppError(MESSAGES.USER.NOT_FOUND, HTTP_STATUS.NOT_FOUND, ERROR_CODE.USER.NOT_FOUND)
    }
    return toSafeUser(user)
}
async function update(id, user) {
    const updatedUser = await UserRepository.update(id, user)
    return updatedUser
}
async function remove(id) {
    const deletedUser = await UserRepository.remove(id)
    return deletedUser
}


module.exports = {
    register,
    login,
    findAll,
    findById,
    update,
    remove
}
