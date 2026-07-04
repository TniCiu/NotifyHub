const router = require("express").Router()
const UserController = require("../controllers/user.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const {
    validateRegister,
    validateLogin,
    validateUserId,
} = require("../middlewares/user.validate.middleware")

router.post("/login", validateLogin, UserController.login)
router.post("/register", validateRegister, UserController.register)
router.get("/users", authMiddleware, UserController.findAll)
router.get("/users/:id", authMiddleware, validateUserId, UserController.findById)

module.exports = router
