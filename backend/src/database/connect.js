const pool = require("./db")

async function connect(){
    try {
        await pool.query("SELECT NOW()")

        console.log("[Database] Connection successful")
    } catch (error) {
        console.error("[Database] Connection error")
        console.error(error.message)   
        
        process.exit(1)
    }
}

module.exports = connect