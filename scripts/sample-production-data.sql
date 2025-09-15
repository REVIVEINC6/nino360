-- Insert sample tenants
INSERT INTO tenants (id, name, domain, status, plan, settings) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'TechCorp Inc', 'techcorp.com', 'active', 'enterprise', '{"features": ["ai_insights", "automation", "advanced_analytics"]}'),
('550e8400-e29b-41d4-a716-446655440002', 'StartupXYZ', 'startupxyz.com', 'active', 'professional', '{"features": ["ai_insights", "basic_analytics"]}'),
('550e8400-e29b-41d4-a716-446655440003', 'GlobalCorp', 'globalcorp.com', 'active', 'enterprise', '{"features": ["ai_insights", "automation", "advanced_analytics", "blockchain_audit"]}');

-- Insert sample users
INSERT INTO users (id, email, name, role, tenant_id, is_active, metadata) VALUES
('550e8400-e29b-41d4-a716-446655440101', 'admin@techcorp.com', 'John Admin', 'admin', '550e8400-e29b-41d4-a716-446655440001', true, '{"department": "IT", "hire_date": "2023-01-15"}'),
('550e8400-e29b-41d4-a716-446655440102', 'hr@techcorp.com', 'Jane HR', 'hr_manager', '550e8400-e29b-41d4-a716-446655440001', true, '{"department": "HR", "hire_date": "2023-02-01"}'),
('550e8400-e29b-41d4-a716-446655440103', 'recruiter@techcorp.com', 'Bob Recruiter', 'recruiter', '550e8400-e29b-41d4-a716-446655440001', true, '{"department": "Talent", "hire_date": "2023-03-10"}'),
('550e8400-e29b-41d4-a716-446655440201', 'admin@startupxyz.com', 'Alice Startup', 'admin', '550e8400-e29b-41d4-a716-446655440002', true, '{"department": "Operations", "hire_date": "2023-01-01"}'),
('550e8400-e29b-41d4-a716-446655440301', 'superadmin@globalcorp.com', 'Mike Super', 'super_admin', '550e8400-e29b-41d4-a716-446655440003', true, '{"department": "Executive", "hire_date": "2022-12-01"}');

-- Insert sample system metrics
INSERT INTO system_metrics (tenant_id, metric_type, value, metadata, recorded_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'cpu_usage', 45.5, '{"server": "prod-1", "region": "us-east-1"}', NOW() - INTERVAL '1 hour'),
('550e8400-e29b-41d4-a716-446655440001', 'memory_usage', 67.2, '{"server": "prod-1", "region": "us-east-1"}', NOW() - INTERVAL '1 hour'),
('550e8400-e29b-41d4-a716-446655440001', 'storage_usage', 23.8, '{"server": "prod-1", "region": "us-east-1"}', NOW() - INTERVAL '1 hour'),
('550e8400-e29b-41d4-a716-446655440001', 'network_usage', 89.1, '{"server": "prod-1", "region": "us-east-1"}', NOW() - INTERVAL '1 hour'),
('550e8400-e29b-41d4-a716-446655440001', 'revenue', 125000, '{"currency": "USD", "period": "monthly"}', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440001', 'growth_rate', 15.3, '{"period": "monthly", "comparison": "mom"}', NOW() - INTERVAL '1 day');

-- Insert sample AI insights
INSERT INTO ai_insights (tenant_id, type, title, description, confidence, impact, status, metadata) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'optimization', 'Database Query Optimization', 'Detected slow queries in the CRM module that could be optimized for 40% better performance', 0.92, 'high', 'active', '{"module": "CRM", "estimated_savings": 15000, "recommendations": ["Add index on user_id column", "Optimize JOIN operations", "Implement query caching"]}'),
('550e8400-e29b-41d4-a716-446655440001', 'prediction', 'Revenue Forecast', 'Based on current trends, revenue is projected to increase by 23% next quarter', 0.87, 'high', 'active', '{"forecast_period": "Q2 2024", "estimated_value": 89000, "confidence_interval": "±5%"}'),
('550e8400-e29b-41d4-a716-446655440001', 'recommendation', 'Security Enhancement', 'Implement two-factor authentication for all admin users to reduce security risks', 0.95, 'critical', 'active', '{"security_score_improvement": 15, "implementation_time": "2 weeks", "cost": 5000}'),
('550e8400-e29b-41d4-a716-446655440002', 'alert', 'High Churn Risk', 'User engagement has decreased by 25% in the last 30 days, indicating potential churn risk', 0.78, 'high', 'active', '{"affected_users": 45, "recommended_actions": ["Send re-engagement campaign", "Offer premium features trial", "Schedule customer success call"]});

-- Insert sample audit logs
INSERT INTO audit_logs (user_id, tenant_id, action, resource_type, resource_id, new_values, ip_address, user_agent) VALUES
('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440001', 'CREATE', 'user', '550e8400-e29b-41d4-a716-446655440103', '{"name": "Bob Recruiter", "role": "recruiter"}', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
('550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440001', 'UPDATE', 'user', '550e8400-e29b-41d4-a716-446655440103', '{"is_active": true}', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'),
('550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440003', 'VIEW', 'dashboard', 'analytics', '{"time_range": "30d"}', '10.0.0.50', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36');

-- Insert sample automation rules
INSERT INTO automation_rules (tenant_id, name, trigger_type, conditions, actions, enabled) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Daily Health Check', 'schedule', '{"schedule": "daily", "time": "02:00"}', '[{"type": "ai_analysis", "config": {}}, {"type": "report_generation", "config": {"reportType": "health", "timeRange": "24h"}}]', true),
('550e8400-e29b-41d4-a716-446655440001', 'High CPU Alert', 'condition', '{"metric": "cpu_usage", "threshold": 80, "duration": "5m"}', '[{"type": "email", "config": {"recipients": ["admin@techcorp.com"], "template": "high_cpu_alert"}}, {"type": "webhook", "config": {"url": "https://hooks.slack.com/services/...", "message": "High CPU usage detected"}}]', true),
('550e8400-e29b-41d4-a716-446655440003', 'Weekly Security Scan', 'schedule', '{"schedule": "weekly", "day": "sunday", "time": "01:00"}', '[{"type": "security_scan", "config": {"scope": "full"}}, {"type": "report_generation", "config": {"reportType": "security", "timeRange": "7d"}}]', true);

-- Insert sample security events
INSERT INTO security_events (tenant_id, event_type, severity, description, source_ip, user_id, metadata) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'failed_login', 'medium', 'Multiple failed login attempts detected', '203.0.113.1', NULL, '{"attempts": 5, "time_window": "5m", "blocked": true}'),
('550e8400-e29b-41d4-a716-446655440001', 'privilege_escalation', 'high', 'User attempted to access admin functions without proper permissions', '192.168.1.105', '550e8400-e29b-41d4-a716-446655440103', '{"attempted_action": "delete_user", "blocked": true}'),
('550e8400-e29b-41d4-a716-446655440003', 'suspicious_activity', 'critical', 'Unusual data access pattern detected', '198.51.100.1', '550e8400-e29b-41d4-a716-446655440301', '{"data_accessed": "user_database", "pattern": "bulk_download", "flagged": true}');

-- Insert sample automation logs
INSERT INTO automation_logs (rule_id, tenant_id, status, executed_at) VALUES
((SELECT id FROM automation_rules WHERE name = 'Daily Health Check' LIMIT 1), '550e8400-e29b-41d4-a716-446655440001', 'success', NOW() - INTERVAL '2 hours'),
((SELECT id FROM automation_rules WHERE name = 'High CPU Alert' LIMIT 1), '550e8400-e29b-41d4-a716-446655440001', 'success', NOW() - INTERVAL '6 hours'),
((SELECT id FROM automation_rules WHERE name = 'Weekly Security Scan' LIMIT 1), '550e8400-e29b-41d4-a716-446655440003', 'success', NOW() - INTERVAL '1 day');
