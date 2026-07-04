const pool = require("../database/db")

async function findAll(){
    const result = await pool.query(
        `
        SELECT * 
        FROM users
        ORDER BY id DESC
        `
    )
    return result.rows
}

async function findByEmail(email){
    const result = await pool.query(
        `
        SELECT *
        FROM users
        WHERE email = $1
        `,
        [email]
    )
    return result.rows[0]
}

async function findById(id){
    const result = await pool.query(
        `
        SELECT * 
        FROM users
        WHERE id = $1
        `,
        [id]
    )
    return result.rows[0]
}
async function create(user){
    const result = await pool.query(
        `
        INSERT INTO users (full_name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        [user.fullName || user.full_name, user.email, user.password]
    )
    return result.rows[0]
}
async function update(id, user){
    const result = await pool.query(
        `
        UPDATE users
        SET full_name = $1, email = $2, password_hash = $3, updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING *
        `,
        [user.fullName || user.full_name, user.email, user.password, id]
    )
    return result.rows[0]
}
async function remove(id){
    const result = await pool.query(
        `
        DELETE FROM users
        WHERE id = $1
        RETURNING *
        `,
        [id]
    )
    return result.rows[0]
}

module.exports = {
    findAll,
    findByEmail,
    findById,
    create,
    update,
    remove
}
