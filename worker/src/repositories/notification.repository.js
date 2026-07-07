const pool = require("../utils/db")

async function updateRequestStatus(requestId, status, errorMessage = null) {
    await pool.query(
        `
        UPDATE notification_requests
        SET
            status = $1,
            error_message = $2,
            sent_at = CASE WHEN $1::varchar = 'SENT' THEN CURRENT_TIMESTAMP ELSE sent_at END,
            updated_at = CURRENT_TIMESTAMP
        WHERE request_id = $3
        `,
        [status, errorMessage, requestId]
    )
}

async function createLog({ requestId, action, status, message, rawRequest, rawResponse }) {
    await pool.query(
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
}

module.exports = {
    updateRequestStatus,
    createLog,
}
