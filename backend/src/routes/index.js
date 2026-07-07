const Route = require("express").Router()
const UserRoute = require("./user.rotue")
const TemplateRoute = require("./template.route")
const NotificationRoute = require("./notification.route")
const DashboardRoute = require("./dashboard.route")
const CampaignRoute = require("./campaign.route")

Route.use("/users", UserRoute)
Route.use("/templates", TemplateRoute)
Route.use("/notifications", NotificationRoute)
Route.use("/dashboards", DashboardRoute)
Route.use("/campaigns", CampaignRoute)
module.exports = Route
