const Route = require("express").Router()
const UserRoute = require("./user.rotue")
const TemplateRoute = require("./template.route")

Route.use("/users", UserRoute)
Route.use("/templates", TemplateRoute)

module.exports = Route