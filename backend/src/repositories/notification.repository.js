const pool = require("../database/db")

async function createRequest({
    requestId,
    templateCode,
    channel,
    receiver,
    subject,
    payload,
    renderedContent,
    status,
}) {
    const result = await pool.query(
        `
        INSERT INTO notification_requests (
            request_id,
            template_code,
            channel,
            receiver,
            subject,
            payload,
            rendered_content,
            status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
        `,
        [
            requestId,
            templateCode,
            channel,
            receiver,
            subject,
            JSON.stringify(payload),
            renderedContent,
            status,
        ]
    )

    return result.rows[0]
}

async function findByRequestId(requestId) {
    const result = await pool.query(
        `
        SELECT *
        FROM notification_requests
        WHERE request_id = $1
        `,
        [requestId]
    )

    return result.rows[0]
}

async function findAll({ page, limit, status, channel, requestId }) {
    const offset = (page - 1) * limit
    const conditions = []
    const params = []

    if (status) {
        params.push(status)
        conditions.push(`status = $${params.length}`)
    }

    if (channel) {
        params.push(channel)
        conditions.push(`channel = $${params.length}`)
    }

    if (requestId) {
        params.push(`%${requestId}%`)
        conditions.push(`request_id ILIKE $${params.length}`)
    }

    const whereSql = conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""

    params.push(limit)
    const limitIndex = params.length

    params.push(offset)
    const offsetIndex = params.length

    const result = await pool.query(
        `
        SELECT *
        FROM notification_requests
        ${whereSql}
        ORDER BY id DESC
        LIMIT $${limitIndex}
        OFFSET $${offsetIndex}
        `,
        params
    )

    const countResult = await pool.query(
        `
        SELECT COUNT(*)::int AS total
        FROM notification_requests
        ${whereSql}
        `,
        params.slice(0, params.length - 2)
    )

    return {
        data: result.rows,
        total: countResult.rows[0].total,
    }
}

async function updateStatus(requestId, { status, errorMessage }) {
    const result = await pool.query(
        `
        UPDATE notification_requests
        SET
            status = $1,
            error_message = $2,
            updated_at = CURRENT_TIMESTAMP
        WHERE request_id = $3
        RETURNING *
        `,
        [status, errorMessage, requestId]
    )

    return result.rows[0]
}

async function createLog({
    requestId,
    action,
    status,
    message,
    rawRequest,
    rawResponse,
}) {
    const result = await pool.query(
        `
        INSERT INTO notification_logs (
            request_id,
            action,
            status,
            message,
            raw_request,
            raw_response
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
        `,
        [
            requestId,
            action,
            status,
            message,
            rawRequest ? JSON.stringify(rawRequest) : null,
            rawResponse ? JSON.stringify(rawResponse) : null,
        ]
    )

    return result.rows[0]
}

async function findLogsByRequestId(requestId) {
    const result = await pool.query(
        `
        SELECT *
        FROM notification_logs
        WHERE request_id = $1
        ORDER BY id ASC
        `,
        [requestId]
    )

    return result.rows
}

module.exports = {
    createRequest,
    findByRequestId,
    findAll,
    updateStatus,
    createLog,
    findLogsByRequestId,
}
