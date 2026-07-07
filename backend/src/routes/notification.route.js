const router = require("express").Router()
const NotificationController = require("../controllers/notification.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const {
    validateBody,
    validateParams,
    validateQuery,
} = require("../middlewares/validate.middleware")
const {
    createNotificationSchema,
    getNotificationsQuerySchema,
    notificationRequestIdSchema,
} = require("../validators/notification.validator")

router.post("/", authMiddleware, validateBody(createNotificationSchema), NotificationController.createNotification)
router.get("/", authMiddleware, validateQuery(getNotificationsQuerySchema), NotificationController.getNotifications)
router.get("/:requestId", authMiddleware, validateParams(notificationRequestIdSchema), NotificationController.getNotificationByRequestId)

module.exports = router
