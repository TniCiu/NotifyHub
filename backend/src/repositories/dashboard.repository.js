const pool = require("../database/db");

async function getSummary() {
    const result = await pool.query(`
        SELECT
            COUNT(*)::int AS total,
            COUNT(*) FILTER (WHERE status = 'SENT')::int AS success,
            COUNT(*) FILTER (WHERE status = 'FAILED')::int AS failed,
            COUNT(*) FILTER (WHERE status IN ('PENDING', 'QUEUED'))::int AS pending
        FROM notification_requests
    `);

    return result.rows[0];
}

async function getTrend() {
    const result = await pool.query(`
        SELECT
            DATE(created_at) AS date,
            COUNT(*)::int AS total,
            COUNT(*) FILTER (WHERE status = 'SENT')::int AS success,
            COUNT(*) FILTER (WHERE status = 'FAILED')::int AS failed
        FROM notification_requests
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at)
    `);

    return result.rows;
}

async function getChannelDistribution() {
    const result = await pool.query(`
        SELECT
            channel,
            COUNT(*)::int AS total
        FROM notification_requests
        GROUP BY channel
        ORDER BY total DESC
    `);

    return result.rows;
}

async function getTopTemplates() {
    const result = await pool.query(`
        SELECT
            template_code,
            COUNT(*)::int AS total
        FROM notification_requests
        GROUP BY template_code
        ORDER BY total DESC
        LIMIT 10
    `);

    return result.rows;
}

module.exports = {
    getSummary,
    getTrend,
    getChannelDistribution,
    getTopTemplates,
};
