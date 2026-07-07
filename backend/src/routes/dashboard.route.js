const router = require("express").Router()

const DashboardController = require("../controllers/dashboard.controller")
const authMiddleware = require("../middlewares/auth.middleware")

router.get("/summary", authMiddleware, DashboardController.getSummary)
router.get("/trend", authMiddleware, DashboardController.getTrend)
router.get("/channel", authMiddleware, DashboardController.getChannelDistribution)
router.get("/templates/top", authMiddleware, DashboardController.getTopTemplates)

module.exports = router
