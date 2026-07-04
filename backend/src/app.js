const express = require("express")
const cors = require("cors")
const app = express()
const routes = require("./routes")
const errorMiddleware = require("./middlewares/error.middleware")

app.use(cors())

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use("/api", routes)

app.use(errorMiddleware)

module.exports = app
