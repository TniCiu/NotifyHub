const router = require("express").Router()
const UserController = require("../controllers/user.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const {
    validateRegister,
    validateLogin,
    validateUserId,
} = require("../validators/user.validator")

router.post("/login", validateLogin, UserController.login)
router.post("/register", validateRegister, UserController.register)
router.get("/", authMiddleware, UserController.findAll)
router.get("/:id", authMiddleware, validateUserId, UserController.findById)

module.exports = router
