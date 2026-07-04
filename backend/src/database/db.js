const { Pool } = require("pg")
const Databaseconfig = require("../config/database")

const pool = new Pool(Databaseconfig)

pool.on("connect", () => {
    console.log("[Database] Connected")
})

pool.on("error", (err) => {
    console.error("[Database]", err.message)
})  
module.exports = pool