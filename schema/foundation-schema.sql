-- ═══════════════════════════════════════════════════════════
-- DATA & SECURITY FOUNDATION - DATABASE SCHEMA
-- Cross-cutting tables for all foundation modules
-- ═══════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════
-- MODULE 7: AUDIT LOG (Immutable, Tamper-Proof)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE audit_log_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trace_id VARCHAR(64) NOT NULL,
  tenant_id UUID NOT NULL,
  user_id UUID NOT NULL,
  action VARCHAR(100) NOT NULL,
  resource VARCHAR(255),
  before_state JSONB,
  after_state JSONB,
  policy_decision VARCHAR(50),
  ip_address INET NOT NULL,
  user_agent TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  signature VARCHAR(128) NOT NULL, -- HMAC-SHA256
  previous_hash VARCHAR(128) NOT NULL, -- Chain hash for tamper detection
  
  -- Indexes
  CONSTRAINT chk_action CHECK (action IS NOT NULL)
);

CREATE INDEX idx_audit_tenant ON audit_log_entries(tenant_id);
CREATE INDEX idx_audit_timestamp ON audit_log_entries(timestamp);
CREATE INDEX idx_audit_trace ON audit_log_entries(trace_id);
CREATE INDEX idx_audit_user ON audit_log_entries(user_id);

-- IMMUTABILITY: Prevent UPDATE/DELETE
CREATE OR REPLACE FUNCTION prevent_audit_mutation()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Audit log entries are immutable. UPDATE/DELETE not allowed.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_audit_update
  BEFORE UPDATE ON audit_log_entries
  FOR EACH ROW EXECUTE FUNCTION prevent_audit_mutation();

CREATE TRIGGER trg_prevent_audit_delete
  BEFORE DELETE ON audit_log_entries
  FOR EACH ROW EXECUTE FUNCTION prevent_audit_mutation();

-- ═══════════════════════════════════════════════════════════
-- MODULE 9: TENANT CMK (Per-Tenant Encryption Keys)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE tenant_cmks (
  tenant_id UUID PRIMARY KEY,
  kms_key_id VARCHAR(255) NOT NULL, -- AWS KMS / Vault Transit key ID
  created_at TIMESTAMPTZ DEFAULT NOW(),
  rotated_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  
  -- Used for per-tenant encryption. Revoking = crypto-shredding.
  CONSTRAINT chk_kms_key CHECK (kms_key_id IS NOT NULL)
);

-- ═══════════════════════════════════════════════════════════
-- MODULE 9: TENANT QUOTAS
-- ═══════════════════════════════════════════════════════════
CREATE TABLE tenant_quotas (
  tenant_id UUID PRIMARY KEY,
  max_vps INTEGER DEFAULT 100,
  max_gpu INTEGER DEFAULT 10,
  max_storage_tb FLOAT DEFAULT 50,
  max_bandwidth_gbps FLOAT DEFAULT 10,
  current_vps INTEGER DEFAULT 0,
  current_gpu INTEGER DEFAULT 0,
  current_storage_tb FLOAT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════
-- MODULE 8: SLO STATUS
-- ═══════════════════════════════════════════════════════════
CREATE TABLE slo_status (
  slo_name VARCHAR(100) PRIMARY KEY,
  target FLOAT NOT NULL,
  current_value FLOAT NOT NULL,
  burn_rate FLOAT NOT NULL,
  error_budget_remaining FLOAT NOT NULL,
  window_start TIMESTAMPTZ NOT NULL,
  window_end TIMESTAMPTZ NOT NULL,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Initialize SLOs
INSERT INTO slo_status (slo_name, target, current_value, burn_rate, error_budget_remaining, window_start, window_end) VALUES
  ('CONTROL_PLANE_AVAILABILITY', 0.9995, 0.9998, 0.5, 0.0003, NOW() - INTERVAL '30 days', NOW()),
  ('API_LATENCY_P95', 300, 180, 0.6, 120, NOW() - INTERVAL '5 minutes', NOW()),
  ('EVENT_DELIVERY', 0.9999, 0.99995, 0.5, 0.00005, NOW() - INTERVAL '1 hour', NOW()),
  ('RPO', 300, 120, 0.4, 180, NOW() - INTERVAL '1 hour', NOW()),
  ('BACKUP_RETENTION', 30, 30, 0, 0, NOW() - INTERVAL '30 days', NOW());

-- ═══════════════════════════════════════════════════════════
-- MODULE 6: BACKUP MANIFESTS
-- ═══════════════════════════════════════════════════════════
CREATE TABLE backup_manifests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  resource_type VARCHAR(50) NOT NULL, -- POSTGRES, REDIS, S3
  backup_type VARCHAR(50) NOT NULL, -- FULL, INCREMENTAL, WAL
  s3_key VARCHAR(500) NOT NULL,
  encrypted BOOLEAN DEFAULT true,
  kms_key_id VARCHAR(255),
  region VARCHAR(50) NOT NULL, -- PRIMARY, SECONDARY
  immutable_until TIMESTAMPTZ, -- WORM lock expiry
  created_at TIMESTAMPTZ DEFAULT NOW(),
  verified BOOLEAN DEFAULT false, -- Checked by restore test
  
  CONSTRAINT chk_resource_type CHECK (resource_type IN ('POSTGRES', 'REDIS', 'S3')),
  CONSTRAINT chk_backup_type CHECK (backup_type IN ('FULL', 'INCREMENTAL', 'WAL'))
);

CREATE INDEX idx_backup_tenant ON backup_manifests(tenant_id);
CREATE INDEX idx_backup_created ON backup_manifests(created_at);

-- ═══════════════════════════════════════════════════════════
-- MODULE 7: DATA RETENTION POLICIES
-- ═══════════════════════════════════════════════════════════
CREATE TABLE data_retention_policies (
  data_type VARCHAR(50) PRIMARY KEY, -- PII, FINANCIAL, LOGS, BACKUPS
  retention_days INTEGER NOT NULL,
  anonymize_after_days INTEGER,
  legal_basis VARCHAR(255), -- GDPR Art. 6, Local Law X
  last_reviewed TIMESTAMPTZ DEFAULT NOW()
);

-- Initialize retention policies
INSERT INTO data_retention_policies (data_type, retention_days, anonymize_after_days, legal_basis) VALUES
  ('PII', 2555, 2555, 'GDPR Art. 6 + Local Tax Law (7 years)'),
  ('FINANCIAL', 3650, NULL, 'Financial Regulations (10 years)'),
  ('LOGS', 90, 365, 'Operational Requirements'),
  ('BACKUPS', 30, NULL, 'DR Requirements (30 days immutable)');

-- ═══════════════════════════════════════════════════════════
-- MODULE 1: IDENTITY - KEYCLOAK USERS (Sync Table)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE keycloak_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keycloak_id VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  tenant_id UUID NOT NULL,
  roles JSONB DEFAULT '[]',
  attributes JSONB DEFAULT '{}',
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ,
  
  -- RLS: Tenant isolation
  CONSTRAINT chk_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_kc_user_tenant ON keycloak_users(tenant_id);
CREATE INDEX idx_kc_user_email ON keycloak_users(email);

-- Enable RLS
ALTER TABLE keycloak_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_kc_users ON keycloak_users
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant')::UUID);

-- ═══════════════════════════════════════════════════════════
-- MODULE 2: SECRETS ROTATION LOG
-- ═══════════════════════════════════════════════════════════
CREATE TABLE secret_rotation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  secret_path VARCHAR(500) NOT NULL,
  rotated_by VARCHAR(100) NOT NULL, -- user or system
  rotated_at TIMESTAMPTZ DEFAULT NOW(),
  previous_version_hash VARCHAR(128),
  new_version_hash VARCHAR(128),
  success BOOLEAN DEFAULT true,
  error_message TEXT
);

CREATE INDEX idx_secret_rotation_path ON secret_rotation_logs(secret_path);
CREATE INDEX idx_secret_rotation_time ON secret_rotation_logs(rotated_at);

-- ═══════════════════════════════════════════════════════════
-- MODULE 3: ZERO TRUST - OPA DECISIONS LOG
-- ═══════════════════════════════════════════════════════════
CREATE TABLE opa_decision_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy VARCHAR(255) NOT NULL,
  input JSONB NOT NULL,
  result JSONB NOT NULL,
  decision BOOLEAN NOT NULL, -- allow/deny
  evaluated_at TIMESTAMPTZ DEFAULT NOW(),
  trace_id VARCHAR(64)
);

CREATE INDEX idx_opa_policy ON opa_decision_logs(policy);
CREATE INDEX idx_opa_decision ON opa_decision_logs(decision);
CREATE INDEX idx_opa_time ON opa_decision_logs(evaluated_at);

-- ═══════════════════════════════════════════════════════════
-- MODULE 4: OBSERVABILITY - TRACE INDEX
-- ═══════════════════════════════════════════════════════════
CREATE TABLE trace_index (
  trace_id VARCHAR(64) PRIMARY KEY,
  service_name VARCHAR(100) NOT NULL,
  operation_name VARCHAR(255) NOT NULL,
  tenant_id UUID,
  duration_ms INTEGER NOT NULL,
  status_code INTEGER,
  started_at TIMESTAMPTZ NOT NULL,
  tags JSONB DEFAULT '{}'
);

CREATE INDEX idx_trace_service ON trace_index(service_name);
CREATE INDEX idx_trace_tenant ON trace_index(tenant_id);
CREATE INDEX idx_trace_time ON trace_index(started_at);

-- ═══════════════════════════════════════════════════════════
-- FUNCTIONS & TRIGGERS
-- ═══════════════════════════════════════════════════════════

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_foundation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_tenant_quotas_updated
  BEFORE UPDATE ON tenant_quotas
  FOR EACH ROW EXECUTE FUNCTION update_foundation_updated_at();

CREATE TRIGGER trg_slo_status_updated
  BEFORE UPDATE ON slo_status
  FOR EACH ROW EXECUTE FUNCTION update_foundation_updated_at();

-- ═══════════════════════════════════════════════════════════
-- SAMPLE DATA
-- ═══════════════════════════════════════════════════════════

-- Sample tenant quotas
INSERT INTO tenant_quotas (tenant_id, max_vps, max_gpu, max_storage_tb) VALUES
  ('00000000-0000-0000-0000-000000000001', 50, 5, 20),
  ('00000000-0000-0000-0000-000000000002', 200, 20, 100);

-- Sample backup manifest
INSERT INTO backup_manifests (tenant_id, resource_type, backup_type, s3_key, region, immutable_until) VALUES
  ('00000000-0000-0000-0000-000000000001', 'POSTGRES', 'FULL', 'backups/tenant-1/2026-01-15/full.dump', 'PRIMARY', NOW() + INTERVAL '30 days');

-- ═══════════════════════════════════════════════════════════
-- GEO-AWARE TABLES (Multi-Region Infrastructure)
-- ═══════════════════════════════════════════════════════════

-- Region Configuration
CREATE TABLE geo_regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(10) UNIQUE NOT NULL, -- IR, EU, US, ASIA
  name VARCHAR(255) NOT NULL,
  flag VARCHAR(10),
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, DEGRADED, OFFLINE, PLANNED
  compliance JSONB NOT NULL,
  infrastructure JSONB NOT NULL,
  endpoints JSONB NOT NULL,
  capacity JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT chk_region_status CHECK (status IN ('ACTIVE', 'DEGRADED', 'OFFLINE', 'PLANNED'))
);

CREATE INDEX idx_geo_region_code ON geo_regions(code);
CREATE INDEX idx_geo_region_status ON geo_regions(status);

-- Initialize regions
INSERT INTO geo_regions (code, name, flag, status, compliance, infrastructure, endpoints, capacity) VALUES
  ('IR', 'Iran Datacenter (DC-A)', '🇮🇷', 'ACTIVE',
   '{"dataResidency": "STRICT_LOCAL", "sanctionsRisk": "HIGH", "crossBorderAllowed": false, "gdprCompliant": false}',
   '{"k8sProvider": "RKE2", "virtualization": ["KubeVirt", "KVM"], "storageClass": ["local-ssd", "ceph-block"], "networkProvider": "calico"}',
   '{"apiGateway": "https://api.ir.abran.system", "metricsExporter": "http://metrics.ir.abran.system:9090", "backupTarget": "s3://backup-ir.abran.system"}',
   '{"maxVps": 500, "maxGpu": 50, "currentUtilization": 0.65}'),
  ('EU', 'Europe Datacenter (DC-B)', '🇪🇺', 'ACTIVE',
   '{"dataResidency": "GDPR", "sanctionsRisk": "LOW", "crossBorderAllowed": true, "gdprCompliant": true}',
   '{"k8sProvider": "RKE2", "virtualization": ["KubeVirt", "VMware"], "storageClass": ["ebs-gp3", "ceph-block"], "networkProvider": "cilium"}',
   '{"apiGateway": "https://api.eu.abran.system", "metricsExporter": "http://metrics.eu.abran.system:9090", "backupTarget": "s3://backup-eu.abran.system"}',
   '{"maxVps": 1000, "maxGpu": 200, "currentUtilization": 0.45}'),
  ('ASIA', 'Asia Datacenter (DC-C)', '🌏', 'PLANNED',
   '{"dataResidency": "CONFIGURABLE", "sanctionsRisk": "MEDIUM", "crossBorderAllowed": true, "gdprCompliant": false}',
   '{"k8sProvider": "EKS", "virtualization": ["KubeVirt"], "storageClass": ["ebs-gp3"], "networkProvider": "cilium"}',
   '{"apiGateway": "https://api.asia.abran.system", "metricsExporter": "http://metrics.asia.abran.system:9090", "backupTarget": "s3://backup-asia.abran.system"}',
   '{"maxVps": 800, "maxGpu": 150, "currentUtilization": 0}');

-- Geo Failover Events
CREATE TABLE geo_failover_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_code VARCHAR(10) NOT NULL,
  event_type VARCHAR(50) NOT NULL, -- DEGRADE, FAIL, RECOVER, FAILOVER_TRIGGERED
  previous_state VARCHAR(20),
  new_state VARCHAR(20),
  triggered_by VARCHAR(50), -- SYSTEM, ADMIN, HEALTH_CHECK
  affected_resources INTEGER DEFAULT 0,
  migration_initiated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT chk_failover_event_type CHECK (event_type IN ('DEGRADE', 'FAIL', 'RECOVER', 'FAILOVER_TRIGGERED'))
);

CREATE INDEX idx_failover_region ON geo_failover_events(region_code);
CREATE INDEX idx_failover_time ON geo_failover_events(created_at);

-- Cross-Border Transfer Logs
CREATE TABLE cross_border_transfer_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_region VARCHAR(10) NOT NULL,
  target_region VARCHAR(10) NOT NULL,
  tenant_id UUID NOT NULL,
  resource_id UUID,
  transfer_type VARCHAR(50) NOT NULL, -- MIGRATION, REPLICATION, BACKUP
  admin_override BOOLEAN DEFAULT false,
  compliance_check_passed BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT chk_transfer_type CHECK (transfer_type IN ('MIGRATION', 'REPLICATION', 'BACKUP'))
);

CREATE INDEX idx_cross_border_regions ON cross_border_transfer_logs(source_region, target_region);
CREATE INDEX idx_cross_border_tenant ON cross_border_transfer_logs(tenant_id);
CREATE INDEX idx_cross_border_time ON cross_border_transfer_logs(created_at);

-- Latency Probe Results
CREATE TABLE latency_probe_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_region VARCHAR(10) NOT NULL,
  to_region VARCHAR(10) NOT NULL,
  latency_ms INTEGER NOT NULL,
  probe_timestamp TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT chk_latency_positive CHECK (latency_ms >= 0)
);

CREATE INDEX idx_latency_regions ON latency_probe_results(from_region, to_region);
CREATE INDEX idx_latency_time ON latency_probe_results(probe_timestamp);

-- Resources with Region Awareness
ALTER TABLE IF EXISTS resources ADD COLUMN IF NOT EXISTS region_code VARCHAR(10);
CREATE INDEX IF NOT EXISTS idx_resources_region ON resources(region_code);

-- ═══════════════════════════════════════════════════════════
-- EXTERNAL INTEGRATIONS TABLES
-- ═══════════════════════════════════════════════════════════

-- Processed Transactions (Idempotency)
CREATE TABLE processed_transactions (
  idempotency_key VARCHAR(255) PRIMARY KEY,
  integration VARCHAR(50) NOT NULL, -- PAYMENT, TAX, NOTIFICATION, DNS, CDN, MONITORING
  operation VARCHAR(50) NOT NULL, -- INITIATE, VERIFY, SUBMIT, SEND, CREATE_RECORD, PURGE
  request_hash VARCHAR(64) NOT NULL,
  response_status VARCHAR(20) NOT NULL, -- SUCCESS, FAILED, PENDING
  gateway_ref VARCHAR(255),
  processed_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  
  CONSTRAINT chk_integration CHECK (integration IN ('PAYMENT', 'TAX', 'NOTIFICATION', 'DNS', 'CDN', 'MONITORING')),
  CONSTRAINT chk_response_status CHECK (response_status IN ('SUCCESS', 'FAILED', 'PENDING'))
);

CREATE INDEX idx_processed_tx_integration ON processed_transactions(integration, processed_at);
CREATE INDEX idx_processed_tx_expires ON processed_transactions(expires_at);

-- Integration Audit Log (Immutable)
CREATE TABLE integration_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trace_id VARCHAR(64) NOT NULL,
  integration VARCHAR(50) NOT NULL,
  operation VARCHAR(50) NOT NULL,
  request_hash VARCHAR(64) NOT NULL,
  response_status INTEGER NOT NULL,
  duration_ms INTEGER NOT NULL,
  error TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT chk_audit_integration CHECK (integration IN ('PAYMENT', 'TAX', 'NOTIFICATION', 'DNS', 'CDN', 'MONITORING'))
);

CREATE INDEX idx_integration_audit_integration ON integration_audit_log(integration, timestamp);
CREATE INDEX idx_integration_audit_trace ON integration_audit_log(trace_id);

-- Prevent UPDATE/DELETE on audit log
CREATE OR REPLACE FUNCTION prevent_integration_audit_mutation()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Integration audit log is immutable';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_integration_audit_update
  BEFORE UPDATE ON integration_audit_log
  FOR EACH ROW EXECUTE FUNCTION prevent_integration_audit_mutation();

CREATE TRIGGER trg_prevent_integration_audit_delete
  BEFORE DELETE ON integration_audit_log
  FOR EACH ROW EXECUTE FUNCTION prevent_integration_audit_mutation();

-- Tax Pending Submissions (Circuit Breaker Queue)
CREATE TABLE tax_pending_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_ids UUID[] NOT NULL,
  batch_xml TEXT NOT NULL,
  retry_count INTEGER DEFAULT 0,
  last_error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  next_retry_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_tax_pending_retry ON tax_pending_submissions(next_retry_at);

-- Notification Logs
CREATE TABLE notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  channel VARCHAR(10) NOT NULL, -- EMAIL, SMS
  template_id VARCHAR(100) NOT NULL,
  recipient VARCHAR(255) NOT NULL,
  message_id VARCHAR(255),
  status VARCHAR(20) NOT NULL, -- QUEUED, SENT, DELIVERED, BOUNCED, COMPLAINT, FAILED
  priority VARCHAR(10) DEFAULT 'normal', -- HIGH, NORMAL, LOW
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  error TEXT,
  cost_amount DECIMAL(10, 4),
  
  CONSTRAINT chk_notification_channel CHECK (channel IN ('EMAIL', 'SMS')),
  CONSTRAINT chk_notification_status CHECK (status IN ('QUEUED', 'SENT', 'DELIVERED', 'BOUNCED', 'COMPLAINT', 'FAILED')),
  CONSTRAINT chk_notification_priority CHECK (priority IN ('HIGH', 'NORMAL', 'LOW'))
);

CREATE INDEX idx_notification_logs_tenant ON notification_logs(tenant_id, sent_at);
CREATE INDEX idx_notification_logs_status ON notification_logs(status, sent_at);

-- DNS Pending Changes (Circuit Breaker Queue)
CREATE TABLE dns_pending_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id VARCHAR(255) NOT NULL,
  record_type VARCHAR(10) NOT NULL,
  record_name VARCHAR(255) NOT NULL,
  new_content TEXT NOT NULL,
  operation VARCHAR(10) NOT NULL, -- CREATE, UPDATE, DELETE
  retry_count INTEGER DEFAULT 0,
  last_error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  next_retry_at TIMESTAMPTZ NOT NULL,
  
  CONSTRAINT chk_dns_operation CHECK (operation IN ('CREATE', 'UPDATE', 'DELETE'))
);

CREATE INDEX idx_dns_pending_retry ON dns_pending_changes(next_retry_at);

-- CDN Metrics (Hourly Aggregation)
CREATE TABLE cdn_metrics_hourly (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id VARCHAR(255) NOT NULL,
  hour TIMESTAMPTZ NOT NULL,
  bandwidth_gb FLOAT NOT NULL,
  requests INTEGER NOT NULL,
  threats INTEGER NOT NULL,
  cache_ratio FLOAT NOT NULL,
  cost_amount DECIMAL(10, 4),
  
  UNIQUE(zone_id, hour)
);

CREATE INDEX idx_cdn_metrics_zone ON cdn_metrics_hourly(zone_id, hour);

-- Monitor External Mappings
CREATE TABLE monitor_external_mappings (
  resource_id UUID NOT NULL,
  monitor_id VARCHAR(255) NOT NULL,
  provider VARCHAR(50) NOT NULL, -- UPTIMEROBOT, PINGDOM
  last_synced_at TIMESTAMPTZ DEFAULT NOW(),
  
  PRIMARY KEY(resource_id, provider),
  CONSTRAINT chk_monitor_provider CHECK (provider IN ('UPTIMEROBOT', 'PINGDOM'))
);

CREATE INDEX idx_monitor_mappings_provider ON monitor_external_mappings(provider);

-- Circuit Breaker States
CREATE TABLE circuit_breaker_states (
  integration VARCHAR(50) PRIMARY KEY,
  state VARCHAR(20) NOT NULL, -- CLOSED, OPEN, HALF_OPEN
  failure_count INTEGER DEFAULT 0,
  last_failure_at TIMESTAMPTZ,
  last_state_change TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT chk_cb_state CHECK (state IN ('CLOSED', 'OPEN', 'HALF_OPEN')),
  CONSTRAINT chk_cb_integration CHECK (integration IN ('PAYMENT_ZARINPAL', 'PAYMENT_LIARA', 'TAX_IRAN', 'NOTIFICATION_SENDGRID', 'NOTIFICATION_KAVENEGAR', 'DNS_CLOUDFLARE', 'CDN_CLOUDFLARE', 'MONITORING_UPTIMEROBOT'))
);

-- Initialize circuit breaker states
INSERT INTO circuit_breaker_states (integration, state) VALUES
  ('PAYMENT_ZARINPAL', 'CLOSED'),
  ('PAYMENT_LIARA', 'CLOSED'),
  ('TAX_IRAN', 'CLOSED'),
  ('NOTIFICATION_SENDGRID', 'CLOSED'),
  ('NOTIFICATION_KAVENEGAR', 'CLOSED'),
  ('DNS_CLOUDFLARE', 'CLOSED'),
  ('CDN_CLOUDFLARE', 'CLOSED'),
  ('MONITORING_UPTIMEROBOT', 'CLOSED');

-- Webhook Events (Idempotency for inbound webhooks)
CREATE TABLE webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider VARCHAR(50) NOT NULL, -- ZARINPAL, LIARA, SENDGRID, KAVENEGAR, CLOUDFLARE, UPTIMEROBOT
  event_id VARCHAR(255) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL,
  signature VARCHAR(255),
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMPTZ,
  received_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(provider, event_id),
  CONSTRAINT chk_webhook_provider CHECK (provider IN ('ZARINPAL', 'LIARA', 'SENDGRID', 'KAVENEGAR', 'CLOUDFLARE', 'UPTIMEROBOT'))
);

CREATE INDEX idx_webhook_events_provider ON webhook_events(provider, received_at);
CREATE INDEX idx_webhook_events_processed ON webhook_events(processed);

-- Sample data
INSERT INTO processed_transactions (idempotency_key, integration, operation, request_hash, response_status, expires_at) VALUES
  ('sample-key-001', 'PAYMENT', 'INITIATE', 'hash123', 'SUCCESS', NOW() + INTERVAL '24 hours');

INSERT INTO notification_logs (tenant_id, channel, template_id, recipient, status, priority) VALUES
  ('00000000-0000-0000-0000-000000000001', 'EMAIL', 'welcome', 'user@example.com', 'SENT', 'NORMAL');
