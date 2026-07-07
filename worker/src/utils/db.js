const { Pool } = require("pg")
const databaseConfig = require("../config/database")
const { database: logger } = require("./logger")

const pool = new Pool(databaseConfig)

pool.on("connect", () => {
    logger.debug("connect success")
})

pool.on("error", (error) => {
    logger.error("pool error", {
        error,
    })
})

module.exports = pool
