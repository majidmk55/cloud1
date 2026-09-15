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
