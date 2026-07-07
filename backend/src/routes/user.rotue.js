const router = require("express").Router()
const UserController = require("../controllers/user.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const { validateBody, validateParams } = require("../middlewares/validate.middleware")
const {
    registerSchema,
    loginSchema,
    userIdSchema,
} = require("../validators/user.validator")

router.post("/login", validateBody(loginSchema), UserController.login)
router.post("/register", validateBody(registerSchema), UserController.register)
router.get("/", authMiddleware, UserController.findAll)
router.get("/:id", authMiddleware, validateParams(userIdSchema), UserController.findById)

module.exports = router
