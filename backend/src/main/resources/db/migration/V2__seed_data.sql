-- Seed data for Fraud Detection System
-- Version: 2.0
-- Description: Initial data for testing and demo

-- Insert admin user (password: Admin@123, hashed with BCrypt)
INSERT INTO users (id, email, password_hash, first_name, last_name, role, status, home_country)
VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin@fraud-detection.com',
     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
     'System', 'Admin', 'ADMIN', 'ACTIVE', 'US'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'analyst@fraud-detection.com',
     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
     'John', 'Analyst', 'ANALYST', 'ACTIVE', 'US'),
    ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'user@fraud-detection.com',
     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
     'Jane', 'User', 'USER', 'ACTIVE', 'US');

-- Insert sample user profiles
INSERT INTO user_profiles (user_id, full_name, kyc_status, risk_level, account_created_at, preferred_currency)
VALUES
    ('USR001', 'Alice Johnson', 'VERIFIED', 'LOW', CURRENT_TIMESTAMP - INTERVAL '2 years', 'USD'),
    ('USR002', 'Bob Smith', 'VERIFIED', 'LOW', CURRENT_TIMESTAMP - INTERVAL '1 year', 'USD'),
    ('USR003', 'Charlie Brown', 'VERIFIED', 'MEDIUM', CURRENT_TIMESTAMP - INTERVAL '6 months', 'EUR'),
    ('USR004', 'Diana Prince', 'VERIFIED', 'LOW', CURRENT_TIMESTAMP - INTERVAL '3 years', 'GBP'),
    ('USR005', 'Eve Wilson', 'PENDING', 'HIGH', CURRENT_TIMESTAMP - INTERVAL '1 week', 'USD');

-- Insert default fraud detection rules
INSERT INTO rules (id, rule_id, name, description, expression, weight, severity, action, active, created_by)
VALUES
    -- High amount rules
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'rule_high_amount_usd',
     'High Amount Single Transaction (USD)',
     'Flags transactions above $10,000 USD',
     'amount > 10000 && currency == ''USD''',
     85, 'HIGH', 'FLAG', true, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),

    ('d1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'rule_very_high_amount',
     'Very High Amount Transaction',
     'Rejects transactions above $50,000',
     'amount > 50000',
     95, 'CRITICAL', 'REJECT', true, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),

    -- Velocity rules
    ('d2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'rule_rapid_velocity_1h',
     'Rapid Transaction Velocity (1 hour)',
     'Flags users with more than 10 transactions in 1 hour',
     'txn_count_last_1h > 10',
     70, 'MEDIUM', 'FLAG', true, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),

    ('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'rule_rapid_velocity_24h',
     'High Daily Transaction Count',
     'Flags users with more than 50 transactions in 24 hours',
     'txn_count_last_24h > 50',
     60, 'MEDIUM', 'FLAG', true, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),

    -- Device and location rules
    ('d4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'rule_new_device_high_amount',
     'New Device with High Amount',
     'Flags high-value transactions from new devices',
     'is_new_device == true && amount > 5000',
     75, 'HIGH', 'FLAG', true, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),

    ('d5eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'rule_unusual_location',
     'Unusual Location',
     'Flags transactions from unusual locations',
     'is_unusual_location == true',
     65, 'MEDIUM', 'FLAG', true, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),

    ('d6eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'rule_new_device_and_ip',
     'New Device and New IP',
     'Flags transactions with both new device and new IP',
     'is_new_device == true && is_new_ip == true',
     80, 'HIGH', 'FLAG', true, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),

    -- Amount anomaly rules
    ('d7eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 'rule_amount_spike',
     'Amount Significantly Above Average',
     'Flags transactions 5x higher than user average',
     'amount > (avg_amount_last_24h * 5) && avg_amount_last_24h > 0',
     70, 'MEDIUM', 'FLAG', true, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),

    -- Time-based rules
    ('d8eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', 'rule_rapid_succession',
     'Rapid Succession Transactions',
     'Flags transactions within 2 minutes of previous transaction',
     'time_since_last_txn_minutes != null && time_since_last_txn_minutes < 2',
     55, 'LOW', 'FLAG', true, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),

    -- Multiple devices rule
    ('d9eebc99-9c0b-4ef8-bb6d-6bb9bd380aaa', 'rule_multiple_devices',
     'Multiple Devices in 24h',
     'Flags users accessing from more than 3 devices in 24 hours',
     'unique_devices_last_24h > 3',
     60, 'MEDIUM', 'FLAG', true, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');

-- Insert sample transactions (mix of normal and suspicious)
INSERT INTO transactions (id, transaction_id, user_id, amount, currency, source_account, dest_account,
                         transaction_type, ip_address, device_fingerprint, location, status, risk_score, evaluated_at)
VALUES
    -- Normal transactions
    ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'TXN001', 'USR001', 150.00, 'USD',
     'ACC001', 'ACC002', 'TRANSFER', '192.168.1.1', 'DEV001',
     '{"country": "US", "city": "New York", "lat": 40.7128, "lon": -74.0060}'::jsonb,
     'APPROVED', 15, CURRENT_TIMESTAMP - INTERVAL '2 hours'),

    ('e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'TXN002', 'USR002', 500.00, 'USD',
     'ACC003', 'ACC004', 'TRANSFER', '192.168.1.2', 'DEV002',
     '{"country": "US", "city": "Los Angeles", "lat": 34.0522, "lon": -118.2437}'::jsonb,
     'APPROVED', 20, CURRENT_TIMESTAMP - INTERVAL '1 hour'),

    -- Suspicious transactions
    ('e2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'TXN003', 'USR003', 15000.00, 'USD',
     'ACC005', 'ACC006', 'TRANSFER', '192.168.1.3', 'DEV003',
     '{"country": "US", "city": "Chicago", "lat": 41.8781, "lon": -87.6298}'::jsonb,
     'FLAGGED', 85, CURRENT_TIMESTAMP - INTERVAL '30 minutes'),

    ('e3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'TXN004', 'USR001', 8000.00, 'USD',
     'ACC001', 'ACC007', 'TRANSFER', '10.0.0.1', 'DEV004',
     '{"country": "CN", "city": "Beijing", "lat": 39.9042, "lon": 116.4074}'::jsonb,
     'FLAGGED', 75, CURRENT_TIMESTAMP - INTERVAL '15 minutes'),

    ('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'TXN005', 'USR005', 75000.00, 'USD',
     'ACC008', 'ACC009', 'TRANSFER', '10.0.0.2', 'DEV005',
     '{"country": "RU", "city": "Moscow", "lat": 55.7558, "lon": 37.6173}'::jsonb,
     'REJECTED', 95, CURRENT_TIMESTAMP - INTERVAL '5 minutes'),

    -- More normal transactions
    ('e5eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'TXN006', 'USR004', 250.00, 'GBP',
     'ACC010', 'ACC011', 'TRANSFER', '192.168.1.4', 'DEV006',
     '{"country": "GB", "city": "London", "lat": 51.5074, "lon": -0.1278}'::jsonb,
     'APPROVED', 10, CURRENT_TIMESTAMP - INTERVAL '3 hours'),

    ('e6eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'TXN007', 'USR002', 1200.00, 'USD',
     'ACC003', 'ACC012', 'TRANSFER', '192.168.1.2', 'DEV002',
     '{"country": "US", "city": "Los Angeles", "lat": 34.0522, "lon": -118.2437}'::jsonb,
     'APPROVED', 25, CURRENT_TIMESTAMP - INTERVAL '45 minutes'),

    -- Pending transaction
    ('e7eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 'TXN008', 'USR003', 3500.00, 'EUR',
     'ACC005', 'ACC013', 'TRANSFER', '192.168.1.5', 'DEV007',
     '{"country": "DE", "city": "Berlin", "lat": 52.5200, "lon": 13.4050}'::jsonb,
     'PENDING', 0, NULL);

-- Insert transaction features for evaluated transactions
INSERT INTO transaction_features (transaction_id, user_id, txn_count_last_1h, txn_count_last_24h,
                                  avg_amount_last_24h, is_new_device, is_new_ip, is_unusual_location)
VALUES
    ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'USR001', 1, 3, 200.00, false, false, false),
    ('e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'USR002', 1, 2, 450.00, false, false, false),
    ('e2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'USR003', 1, 1, 0.00, false, false, false),
    ('e3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'USR001', 2, 4, 2000.00, true, true, true),
    ('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'USR005', 1, 1, 0.00, true, true, true),
    ('e5eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'USR004', 1, 5, 300.00, false, false, false),
    ('e6eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'USR002', 1, 3, 600.00, false, false, false);

-- Insert rule evaluations for flagged/rejected transactions
INSERT INTO rule_evaluations (transaction_id, rule_id, matched, detail, execution_time_ms)
VALUES
    -- TXN003 evaluations (high amount)
    ('e2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', true,
     '{"reason": "Transaction amount $15,000 exceeds threshold of $10,000", "weight": 85}'::jsonb, 5),

    -- TXN004 evaluations (new device + unusual location)
    ('e3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'd4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', true,
     '{"reason": "New device with amount $8,000 exceeds threshold", "weight": 75}'::jsonb, 4),
    ('e3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'd5eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', true,
     '{"reason": "Transaction from unusual location (China)", "weight": 65}'::jsonb, 3),

    -- TXN005 evaluations (very high amount)
    ('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', true,
     '{"reason": "Transaction amount $75,000 exceeds critical threshold", "weight": 95}'::jsonb, 6);

-- Insert alerts for flagged/rejected transactions
INSERT INTO alerts (id, transaction_id, level, title, message, status, assigned_to)
VALUES
    ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
     'HIGH', 'High Amount Transaction Detected',
     'Transaction TXN003 for $15,000 has been flagged due to high amount. Risk score: 85',
     'NEW', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'),

    ('f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'e3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
     'HIGH', 'Suspicious Device and Location',
     'Transaction TXN004 flagged: new device from unusual location (China). Risk score: 75',
     'READ', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'),

    ('f2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55',
     'CRITICAL', 'Transaction Rejected - Very High Amount',
     'Transaction TXN005 for $75,000 has been automatically rejected. Risk score: 95',
     'IN_PROGRESS', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22');

-- Insert sample blacklist entries
INSERT INTO blacklist (entity_type, entity_value, reason, severity, active, added_by)
VALUES
    ('IP', '10.0.0.100', 'Known fraudulent IP address', 'HIGH', true, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    ('DEVICE', 'DEV999', 'Device associated with multiple fraud attempts', 'CRITICAL', true, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    ('ACCOUNT', 'ACC999', 'Compromised account', 'HIGH', true, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    ('EMAIL', 'fraud@example.com', 'Known fraudster email', 'MEDIUM', true, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');

-- Insert audit logs
INSERT INTO audit_logs (entity_type, entity_id, action, performed_by, new_values)
VALUES
    ('RULE', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'CREATE', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
     '{"name": "High Amount Single Transaction (USD)", "active": true}'::jsonb),
    ('TRANSACTION', 'e2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'EVALUATE', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
     '{"status": "FLAGGED", "risk_score": 85}'::jsonb),
    ('ALERT', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'CREATE', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
     '{"level": "HIGH", "status": "NEW"}'::jsonb);

-- Refresh materialized view
REFRESH MATERIALIZED VIEW txn_agg_by_hour;
