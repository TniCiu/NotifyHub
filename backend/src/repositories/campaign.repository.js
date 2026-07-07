const pool = require("../database/db");

async function createCampaign(payload) {
    const result = await pool.query(
        `
        INSERT INTO notification_campaigns (
            campaign_code,
            campaign_name,
            template_code,
            channel,
            status,
            total_count,
            created_by
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        RETURNING *
        `,
        [
            payload.campaignCode,
            payload.campaignName,
            payload.templateCode,
            payload.channel,
            payload.status,
            payload.totalCount,
            payload.createdBy,
        ]
    );

    return result.rows[0];
}

async function findByCode(campaignCode) {
    const result = await pool.query(
        `
        SELECT *
        FROM notification_campaigns
        WHERE campaign_code = $1
        `,
        [campaignCode]
    );

    return result.rows[0];
}

async function findAll({ page, limit, status }) {
    const offset = (page - 1) * limit;

    const params = [];
    const conditions = [];

    if (status) {
        params.push(status);
        conditions.push(`status = $${params.length}`);
    }

    const whereSql = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    params.push(limit);
    const limitIndex = params.length;

    params.push(offset);
    const offsetIndex = params.length;

    const result = await pool.query(
        `
        SELECT *
        FROM notification_campaigns
        ${whereSql}
        ORDER BY id DESC
        LIMIT $${limitIndex}
        OFFSET $${offsetIndex}
        `,
        params
    );

    const countResult = await pool.query(
        `
        SELECT COUNT(*)::int AS total
        FROM notification_campaigns
        ${whereSql}
        `,
        params.slice(0, -2)
    );

    return {
        data: result.rows,
        pagination: {
            page,
            limit,
            total: countResult.rows[0].total,
        },
    };
}

async function findById(id) {
    const result = await pool.query(
        `SELECT * FROM notification_campaigns WHERE id = $1`,
        [id]
    );

    return result.rows[0];
}

async function getStatistics(id) {
    const result = await pool.query(
        `
        SELECT
            COUNT(*)::int AS total,
            COUNT(*) FILTER (WHERE status = 'SENT')::int AS success,
            COUNT(*) FILTER (WHERE status = 'FAILED')::int AS failed,
            COUNT(*) FILTER (WHERE status IN ('PENDING', 'QUEUED'))::int AS pending
        FROM notification_requests
        WHERE campaign_id = $1
        `,
        [id]
    );

    return result.rows[0];
}

module.exports = {
    createCampaign,
    findByCode,
    findAll,
    findById,
    getStatistics,
};
