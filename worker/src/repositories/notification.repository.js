const pool = require("../utils/db")

async function updateRequestStatus(requestId, status, errorMessage = null) {
    const result = await pool.query(
        `
        UPDATE notification_requests
        SET
            status = $1,
            error_message = $2,
            sent_at = CASE WHEN $1::varchar = 'SENT' THEN CURRENT_TIMESTAMP ELSE sent_at END,
            updated_at = CURRENT_TIMESTAMP
        WHERE request_id = $3
        RETURNING *
        `,
        [status, errorMessage, requestId]
    )

    return result.rows[0]
}

async function refreshCampaignStatistics(campaignId) {
    if (!campaignId) {
        return null
    }

    const result = await pool.query(
        `
        WITH stats AS (
            SELECT
                campaign_id,
                COUNT(*)::int AS total,
                COUNT(*) FILTER (WHERE status = 'SENT')::int AS success,
                COUNT(*) FILTER (WHERE status = 'FAILED')::int AS failed,
                COUNT(*) FILTER (WHERE status IN ('PENDING', 'QUEUED'))::int AS pending
            FROM notification_requests
            WHERE campaign_id = $1
            GROUP BY campaign_id
        )
        UPDATE notification_campaigns AS campaign
        SET
            total_count = stats.total,
            success_count = stats.success,
            failed_count = stats.failed,
            status = CASE
                WHEN stats.pending > 0 THEN 'PROCESSING'
                WHEN stats.failed > 0 AND stats.success = 0 THEN 'FAILED'
                ELSE 'COMPLETED'
            END,
            updated_at = CURRENT_TIMESTAMP
        FROM stats
        WHERE campaign.id = stats.campaign_id
        RETURNING campaign.*
        `,
        [campaignId]
    )

    return result.rows[0]
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
    refreshCampaignStatistics,
    createLog,
}
