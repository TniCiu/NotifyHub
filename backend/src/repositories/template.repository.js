const pool = require("../database/db");

async function createTemplate({
    templateCode,
    templateName,
    channel,
    subject,
    content,
    variables,
}) {
    const result = await pool.query(
        `
        INSERT INTO notification_templates (
            template_code,
            template_name,
            channel,
            subject,
            content,
            variables
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
        `,
        [
            templateCode,
            templateName,
            channel,
            subject,
            content,
            JSON.stringify(variables),
        ]
    );

    return result.rows[0];
}

async function findByCode(templateCode) {
    const result = await pool.query(
        `
        SELECT *
        FROM notification_templates
        WHERE template_code = $1
        `,
        [templateCode]
    );

    return result.rows[0];
}

async function findById(id) {
    const result = await pool.query(
        `
        SELECT *
        FROM notification_templates
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0];
}

async function findAll({ page, limit, keyword, status, channel }) {
    const offset = (page - 1) * limit;

    const conditions = [];
    const params = [];

    if (keyword) {
        params.push(`%${keyword}%`);
        conditions.push(`(template_code ILIKE $${params.length} OR template_name ILIKE $${params.length})`);
    }

    if (status) {
        params.push(status);
        conditions.push(`status = $${params.length}`);
    }

    if (channel) {
        params.push(channel);
        conditions.push(`channel = $${params.length}`);
    }

    const whereSql = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    params.push(limit);
    const limitIndex = params.length;

    params.push(offset);
    const offsetIndex = params.length;

    const result = await pool.query(
        `
        SELECT *
        FROM notification_templates
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
        FROM notification_templates
        ${whereSql}
        `,
        params.slice(0, params.length - 2)
    );

    return {
        data: result.rows,
        total: countResult.rows[0].total,
    };
}

async function updateTemplate(id, {
    templateName,
    channel,
    subject,
    content,
    variables,
    status,
}) {
    const result = await pool.query(
        `
        UPDATE notification_templates
        SET
            template_name = $1,
            channel = $2,
            subject = $3,
            content = $4,
            variables = $5,
            status = $6,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $7
        RETURNING *
        `,
        [
            templateName,
            channel,
            subject,
            content,
            JSON.stringify(variables),
            status,
            id,
        ]
    );

    return result.rows[0];
}

async function deleteTemplate(id) {
    const result = await pool.query(
        `
        DELETE FROM notification_templates
        WHERE id = $1
        RETURNING *
        `,
        [id]
    );

    return result.rows[0];
}

module.exports = {
    createTemplate,
    findByCode,
    findById,
    findAll,
    updateTemplate,
    deleteTemplate,
};