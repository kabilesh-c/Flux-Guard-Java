-- Initial schema for Fraud Detection System
-- Version: 1.0
-- Description: Core tables for users, transactions, rules, alerts, and audit logs

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    home_country CHAR(2),
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT chk_role CHECK (role IN ('ADMIN', 'USER', 'ANALYST')),
    CONSTRAINT chk_status CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED'))
);

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id VARCHAR(128) UNIQUE NOT NULL,
    user_id VARCHAR(128) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'USD',
    source_account VARCHAR(64),
    dest_account VARCHAR(64),
    transaction_type VARCHAR(50) DEFAULT 'TRANSFER',
    ip_address VARCHAR(64),
    device_fingerprint VARCHAR(128),
    location JSONB,
    metadata JSONB,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    risk_score INTEGER DEFAULT 0,
    evaluated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_amount CHECK (amount > 0),
    CONSTRAINT chk_status CHECK (status IN ('PENDING', 'APPROVED', 'FLAGGED', 'REJECTED')),
    CONSTRAINT chk_risk_score CHECK (risk_score >= 0 AND risk_score <= 100)
);

-- Create indexes for performance
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_transactions_risk_score ON transactions(risk_score DESC);
CREATE INDEX idx_transactions_transaction_id ON transactions(transaction_id);
CREATE INDEX idx_transactions_user_created ON transactions(user_id, created_at DESC);

-- Transaction features table (for velocity and historical analysis)
CREATE TABLE transaction_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    user_id VARCHAR(128) NOT NULL,
    txn_count_last_1h INTEGER DEFAULT 0,
    txn_count_last_24h INTEGER DEFAULT 0,
    txn_count_last_7d INTEGER DEFAULT 0,
    avg_amount_last_24h NUMERIC(12, 2) DEFAULT 0,
    max_amount_last_24h NUMERIC(12, 2) DEFAULT 0,
    unique_devices_last_24h INTEGER DEFAULT 0,
    unique_ips_last_24h INTEGER DEFAULT 0,
    is_new_device BOOLEAN DEFAULT FALSE,
    is_new_ip BOOLEAN DEFAULT FALSE,
    is_unusual_location BOOLEAN DEFAULT FALSE,
    time_since_last_txn_minutes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_txn_features_transaction_id ON transaction_features(transaction_id);
CREATE INDEX idx_txn_features_user_id ON transaction_features(user_id);

-- Rules table
CREATE TABLE rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rule_id VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    expression TEXT NOT NULL,
    weight INTEGER NOT NULL DEFAULT 50,
    severity VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    action VARCHAR(20) NOT NULL DEFAULT 'FLAG',
    active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_weight CHECK (weight >= 0 AND weight <= 100),
    CONSTRAINT chk_severity CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    CONSTRAINT chk_action CHECK (action IN ('FLAG', 'REJECT', 'NOTIFY', 'BLOCK'))
);

CREATE INDEX idx_rules_active ON rules(active);
CREATE INDEX idx_rules_severity ON rules(severity);
CREATE INDEX idx_rules_rule_id ON rules(rule_id);

-- Rule evaluations table (audit trail)
CREATE TABLE rule_evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    rule_id UUID NOT NULL REFERENCES rules(id) ON DELETE CASCADE,
    matched BOOLEAN NOT NULL,
    detail JSONB,
    execution_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rule_eval_transaction_id ON rule_evaluations(transaction_id);
CREATE INDEX idx_rule_eval_rule_id ON rule_evaluations(rule_id);
CREATE INDEX idx_rule_eval_matched ON rule_evaluations(matched);
CREATE INDEX idx_rule_eval_created_at ON rule_evaluations(created_at DESC);

-- Alerts table
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    level VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    title VARCHAR(255) NOT NULL,
    message TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'NEW',
    assigned_to UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    CONSTRAINT chk_level CHECK (level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    CONSTRAINT chk_alert_status CHECK (status IN ('NEW', 'READ', 'IN_PROGRESS', 'RESOLVED', 'DISMISSED'))
);

CREATE INDEX idx_alerts_transaction_id ON alerts(transaction_id);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_level ON alerts(level);
CREATE INDEX idx_alerts_created_at ON alerts(created_at DESC);
CREATE INDEX idx_alerts_assigned_to ON alerts(assigned_to);

-- Audit logs table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,
    performed_by UUID REFERENCES users(id),
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(64),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_performed_by ON audit_logs(performed_by);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- User profiles table (extended user information)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(128) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    date_of_birth DATE,
    address JSONB,
    kyc_status VARCHAR(20) DEFAULT 'PENDING',
    risk_level VARCHAR(20) DEFAULT 'LOW',
    account_created_at TIMESTAMP WITH TIME ZONE,
    total_transactions INTEGER DEFAULT 0,
    total_amount_transacted NUMERIC(15, 2) DEFAULT 0,
    flagged_transactions_count INTEGER DEFAULT 0,
    last_transaction_at TIMESTAMP WITH TIME ZONE,
    preferred_currency CHAR(3) DEFAULT 'USD',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_kyc_status CHECK (kyc_status IN ('PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED')),
    CONSTRAINT chk_risk_level CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH'))
);

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_risk_level ON user_profiles(risk_level);
CREATE INDEX idx_user_profiles_kyc_status ON user_profiles(kyc_status);

-- Blacklist table
CREATE TABLE blacklist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL,
    entity_value VARCHAR(255) NOT NULL,
    reason TEXT,
    severity VARCHAR(20) DEFAULT 'MEDIUM',
    active BOOLEAN DEFAULT TRUE,
    added_by UUID REFERENCES users(id),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_entity_type CHECK (entity_type IN ('IP', 'DEVICE', 'ACCOUNT', 'USER', 'EMAIL')),
    CONSTRAINT chk_blacklist_severity CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'))
);

CREATE INDEX idx_blacklist_entity ON blacklist(entity_type, entity_value);
CREATE INDEX idx_blacklist_active ON blacklist(active);
CREATE INDEX idx_blacklist_expires_at ON blacklist(expires_at);

-- Materialized view for dashboard aggregations
CREATE MATERIALIZED VIEW txn_agg_by_hour AS
SELECT
    date_trunc('hour', created_at) AS hour,
    COUNT(*) AS total_count,
    COUNT(*) FILTER (WHERE status = 'FLAGGED') AS flagged_count,
    COUNT(*) FILTER (WHERE status = 'REJECTED') AS rejected_count,
    COUNT(*) FILTER (WHERE status = 'APPROVED') AS approved_count,
    AVG(risk_score) AS avg_risk_score,
    SUM(amount) AS total_amount,
    COUNT(DISTINCT user_id) AS unique_users
FROM transactions
WHERE created_at >= CURRENT_TIMESTAMP - INTERVAL '30 days'
GROUP BY date_trunc('hour', created_at)
ORDER BY hour DESC;

CREATE UNIQUE INDEX idx_txn_agg_hour ON txn_agg_by_hour(hour);

-- Function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_txn_agg_by_hour()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY txn_agg_by_hour;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rules_updated_at BEFORE UPDATE ON rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE transactions IS 'Stores all financial transactions with risk assessment data';
COMMENT ON TABLE rules IS 'Fraud detection rules with expressions and weights';
COMMENT ON TABLE rule_evaluations IS 'Audit trail of rule evaluations for each transaction';
COMMENT ON TABLE alerts IS 'Alert records generated from high-risk transactions';
COMMENT ON TABLE audit_logs IS 'System-wide audit trail for all important actions';
COMMENT ON TABLE user_profiles IS 'Extended user profile information for risk assessment';
COMMENT ON TABLE transaction_features IS 'Computed features for each transaction (velocity, patterns)';
COMMENT ON TABLE blacklist IS 'Blacklisted entities (IPs, devices, accounts)';
