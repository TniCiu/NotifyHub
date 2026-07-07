const Route = require("express").Router()
const UserRoute = require("./user.rotue")
const TemplateRoute = require("./template.route")
const NotificationRoute = require("./notification.route")

Route.use("/users", UserRoute)
Route.use("/templates", TemplateRoute)
Route.use("/notifications", NotificationRoute)

module.exports = Route
