const { Pool } = require("pg")
const databaseConfig = require("../config/database")

const pool = new Pool(databaseConfig)

module.exports = pool
