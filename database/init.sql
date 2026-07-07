CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'USER',
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notification_templates (
    id SERIAL PRIMARY KEY,
    template_code VARCHAR(100) UNIQUE NOT NULL,
    template_name VARCHAR(255) NOT NULL,
    channel VARCHAR(50) NOT NULL,
    subject VARCHAR(255),
    content TEXT NOT NULL,
    variables JSONB DEFAULT '[]',
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notification_campaigns (
    id SERIAL PRIMARY KEY,
    campaign_code VARCHAR(100) UNIQUE NOT NULL,
    campaign_name VARCHAR(255) NOT NULL,
    template_code VARCHAR(100) NOT NULL,
    channel VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    total_count INT DEFAULT 0,
    success_count INT DEFAULT 0,
    failed_count INT DEFAULT 0,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notification_requests (
    id SERIAL PRIMARY KEY,
    request_id VARCHAR(100) UNIQUE NOT NULL,
    template_code VARCHAR(100) NOT NULL,
    channel VARCHAR(50) NOT NULL,
    receiver VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    payload JSONB NOT NULL,
    rendered_content TEXT,
    status VARCHAR(50) DEFAULT 'PENDING',
    retry_count INT DEFAULT 0,
    campaign_id INT,
    error_message TEXT,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'notification_requests'
          AND column_name = 'campaign_id'
    ) THEN
        ALTER TABLE notification_requests ADD COLUMN campaign_id INT;
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS notification_logs (
    id SERIAL PRIMARY KEY,
    request_id VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    status VARCHAR(50),
    message TEXT,
    raw_request JSONB,
    raw_response JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notification_requests_campaign_id
ON notification_requests (campaign_id);

CREATE INDEX IF NOT EXISTS idx_notification_requests_status
ON notification_requests (status);

CREATE INDEX IF NOT EXISTS idx_notification_requests_template_code
ON notification_requests (template_code);

CREATE INDEX IF NOT EXISTS idx_notification_campaigns_status
ON notification_campaigns (status);
