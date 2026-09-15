-- ═══════════════════════════════════════════════════════════
-- COMPLIANCE & DATA RESIDENCY LAYER - DATABASE SCHEMA
-- ═══════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════
-- COMPLIANCE RULES
-- Admin updates this -> Compliance Layer watches for changes
-- ═══════════════════════════════════════════════════════════
CREATE TABLE compliance_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engine_type VARCHAR(50) NOT NULL, -- RESIDENCY, SANCTIONS, CLASSIFICATION, etc.
  config JSONB NOT NULL, -- { allowedRegions: ["IR"], blockedCountries: ["XX"] }
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Index for fast lookup by engine type
  CONSTRAINT chk_engine_type CHECK (engine_type IN (
    'RESIDENCY', 'CROSS_BORDER', 'SANCTIONS', 
    'CLASSIFICATION', 'TENANT_PLACEMENT', 'AUDIT'
  ))
);

CREATE INDEX idx_compliance_rules_engine ON compliance_rules(engine_type);
CREATE INDEX idx_compliance_rules_active ON compliance_rules(is_active);

-- ═══════════════════════════════════════════════════════════
-- COMPLIANCE AUDIT LOG
-- Immutable history of all compliance decisions
-- Compliance writes this -> Admin reads this
-- ═══════════════════════════════════════════════════════════
CREATE TABLE compliance_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID NOT NULL,
  tenant_id UUID NOT NULL,
  action VARCHAR(50) NOT NULL, -- PROVISION, MIGRATE, EXPORT, DELETE
  decision VARCHAR(20) NOT NULL, -- ALLOWED, DENIED
  engine_type VARCHAR(50),
  reason TEXT,
  context_hash VARCHAR(64) NOT NULL, -- SHA256 of the request context for immutability
  metadata JSONB,
  
  -- Indexes for fast queries
  CONSTRAINT chk_decision CHECK (decision IN ('ALLOWED', 'DENIED', 'WARNED'))
);

CREATE INDEX idx_audit_logs_tenant ON compliance_audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_timestamp ON compliance_audit_logs(timestamp);
CREATE INDEX idx_audit_logs_user ON compliance_audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON compliance_audit_logs(action);

-- ═══════════════════════════════════════════════════════════
-- RESOURCE COMPLIANCE TAGS
-- Compliance writes this -> Inventory/Provisioning reads this
-- ═══════════════════════════════════════════════════════════
CREATE TABLE resource_compliance_tags (
  resource_id UUID PRIMARY KEY,
  residency VARCHAR(20) NOT NULL, -- IR, EU, US, ASIA, GLOBAL
  classification VARCHAR(30) NOT NULL, -- PII, FINANCIAL, LOGS, PUBLIC, CONFIDENTIAL
  encryption_level VARCHAR(20) NOT NULL, -- NONE, AES128, AES256, RSA2048
  retention_days INTEGER,
  is_cross_border_allowed BOOLEAN DEFAULT false,
  last_checked TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB,
  
  -- Constraints
  CONSTRAINT chk_residency CHECK (residency IN ('IR', 'EU', 'US', 'ASIA', 'GLOBAL')),
  CONSTRAINT chk_classification CHECK (classification IN (
    'PII', 'FINANCIAL', 'LOGS', 'PUBLIC', 'CONFIDENTIAL'
  )),
  CONSTRAINT chk_encryption CHECK (encryption_level IN (
    'NONE', 'AES128', 'AES256', 'RSA2048'
  ))
);

CREATE INDEX idx_resource_tags_residency ON resource_compliance_tags(residency);
CREATE INDEX idx_resource_tags_classification ON resource_compliance_tags(classification);
CREATE INDEX idx_resource_tags_last_checked ON resource_compliance_tags(last_checked);

-- ═══════════════════════════════════════════════════════════
-- COMPLIANCE VIOLATION ALERTS
-- Compliance writes this -> Admin Panel displays this via SSE
-- ═══════════════════════════════════════════════════════════
CREATE TABLE compliance_violation_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  severity VARCHAR(20) NOT NULL, -- LOW, MEDIUM, HIGH, CRITICAL
  engine_type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  tenant_id UUID NOT NULL,
  user_id UUID NOT NULL,
  action VARCHAR(50) NOT NULL,
  context JSONB NOT NULL, -- Full compliance context snapshot
  is_read BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID,
  
  -- Constraints
  CONSTRAINT chk_severity CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'))
);

CREATE INDEX idx_violation_alerts_tenant ON compliance_violation_alerts(tenant_id);
CREATE INDEX idx_violation_alerts_severity ON compliance_violation_alerts(severity);
CREATE INDEX idx_violation_alerts_timestamp ON compliance_violation_alerts(timestamp);
CREATE INDEX idx_violation_alerts_read ON compliance_violation_alerts(is_read);

-- ═══════════════════════════════════════════════════════════
-- TENANT COMPLIANCE REQUIREMENTS
-- Admin defines per-tenant compliance requirements
-- ═══════════════════════════════════════════════════════════
CREATE TABLE tenant_compliance_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL UNIQUE,
  required_encryption VARCHAR(20) DEFAULT 'NONE',
  data_residency VARCHAR(20) DEFAULT 'GLOBAL',
  retention_policy_days INTEGER DEFAULT 365,
  cross_border_allowed BOOLEAN DEFAULT true,
  gdpr_compliant BOOLEAN DEFAULT false,
  hipaa_compliant BOOLEAN DEFAULT false,
  custom_requirements JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT chk_tenant_encryption CHECK (required_encryption IN (
    'NONE', 'AES128', 'AES256', 'RSA2048'
  )),
  CONSTRAINT chk_tenant_residency CHECK (data_residency IN (
    'IR', 'EU', 'US', 'ASIA', 'GLOBAL'
  ))
);

CREATE INDEX idx_tenant_compliance_tenant ON tenant_compliance_requirements(tenant_id);

-- ═══════════════════════════════════════════════════════════
-- COMPLIANCE ENGINE STATUS
-- Tracks health and last execution of each engine
-- ═══════════════════════════════════════════════════════════
CREATE TABLE compliance_engine_status (
  engine_type VARCHAR(50) PRIMARY KEY,
  is_healthy BOOLEAN DEFAULT true,
  last_execution TIMESTAMPTZ,
  last_error TEXT,
  rules_count INTEGER DEFAULT 0,
  evaluations_count BIGINT DEFAULT 0,
  violations_count BIGINT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT chk_engine_status_type CHECK (engine_type IN (
    'RESIDENCY', 'CROSS_BORDER', 'SANCTIONS', 
    'CLASSIFICATION', 'TENANT_PLACEMENT', 'AUDIT'
  ))
);

-- Initialize engine status records
INSERT INTO compliance_engine_status (engine_type, is_healthy, rules_count) VALUES
  ('RESIDENCY', true, 0),
  ('CROSS_BORDER', true, 0),
  ('SANCTIONS', true, 0),
  ('CLASSIFICATION', true, 0),
  ('TENANT_PLACEMENT', true, 0),
  ('AUDIT', true, 0);

-- ═══════════════════════════════════════════════════════════
-- FUNCTIONS & TRIGGERS
-- ═══════════════════════════════════════════════════════════

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_compliance_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for compliance_rules
CREATE TRIGGER trg_compliance_rules_updated_at
  BEFORE UPDATE ON compliance_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_compliance_updated_at();

-- Trigger for tenant_compliance_requirements
CREATE TRIGGER trg_tenant_compliance_updated_at
  BEFORE UPDATE ON tenant_compliance_requirements
  FOR EACH ROW
  EXECUTE FUNCTION update_compliance_updated_at();

-- ═══════════════════════════════════════════════════════════
-- SAMPLE DATA
-- ═══════════════════════════════════════════════════════════

-- Sample residency rules
INSERT INTO compliance_rules (engine_type, config, priority, is_active) VALUES
  ('RESIDENCY', '{"userRegion": "IR", "allowedProviderLocations": ["IR", "LOCAL-DC"]}', 100, true),
  ('RESIDENCY', '{"userRegion": "EU", "allowedProviderLocations": ["EU"]}', 100, true);

-- Sample sanctions rules
INSERT INTO compliance_rules (engine_type, config, priority, is_active) VALUES
  ('SANCTIONS', '{"blockedCountries": ["KP", "SY", "CU"], "blockedEntities": [], "blockedIPs": []}', 100, true);

-- Sample cross-border rules
INSERT INTO compliance_rules (engine_type, config, priority, is_active) VALUES
  ('CROSS_BORDER', '{"sourceRegion": "IR", "destinationRegion": "EU", "requiresApproval": true}', 90, true),
  ('CROSS_BORDER', '{"sourceRegion": "EU", "destinationRegion": "US", "requiresApproval": true}', 90, true);

-- Sample tenant placement rules
INSERT INTO compliance_rules (engine_type, config, priority, is_active) VALUES
  ('TENANT_PLACEMENT', '{"planType": "DEDICATED", "allowedResourceTypes": ["DEDICATED_SERVER", "PRIVATE_CLOUD"], "deniedResourceTypes": ["SHARED_VPS", "PUBLIC_CLOUD"]}', 95, true),
  ('TENANT_PLACEMENT', '{"planType": "ENTERPRISE", "allowedResourceTypes": ["DEDICATED_SERVER", "PRIVATE_CLOUD", "SHARED_VPS"], "deniedResourceTypes": ["PUBLIC_CLOUD"]}', 90, true);

-- ═══════════════════════════════════════════════════════════
-- VIEWS FOR ADMIN DASHBOARD
-- ═══════════════════════════════════════════════════════════

-- View: Recent violations
CREATE VIEW v_recent_violations AS
SELECT 
  id,
  timestamp,
  severity,
  engine_type,
  message,
  tenant_id,
  user_id,
  action,
  is_read,
  EXTRACT(EPOCH FROM (NOW() - timestamp))/3600 AS hours_ago
FROM compliance_violation_alerts
WHERE is_read = false
ORDER BY timestamp DESC
LIMIT 100;

-- View: Audit logs summary by tenant
CREATE VIEW v_audit_summary_by_tenant AS
SELECT 
  tenant_id,
  COUNT(*) as total_actions,
  COUNT(*) FILTER (WHERE decision = 'ALLOWED') as allowed_actions,
  COUNT(*) FILTER (WHERE decision = 'DENIED') as denied_actions,
  MAX(timestamp) as last_activity
FROM compliance_audit_logs
GROUP BY tenant_id;

-- View: Compliance status dashboard
CREATE VIEW v_compliance_dashboard AS
SELECT 
  e.engine_type,
  e.is_healthy,
  e.last_execution,
  e.rules_count,
  e.evaluations_count,
  e.violations_count,
  COUNT(a.id) FILTER (WHERE a.is_read = false) as unread_alerts
FROM compliance_engine_status e
LEFT JOIN compliance_violation_alerts a ON a.engine_type = e.engine_type AND a.is_read = false
GROUP BY e.engine_type, e.is_healthy, e.last_execution, e.rules_count, e.evaluations_count, e.violations_count;

-- ═══════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════

-- Enable RLS on sensitive tables
ALTER TABLE compliance_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_violation_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_compliance_tags ENABLE ROW LEVEL SECURITY;

-- Admin can read all audit logs
CREATE POLICY admin_read_audit_logs ON compliance_audit_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = current_setting('app.current_user_id')::UUID 
      AND level = 'L1_SUPER_ADMIN'
    )
  );

-- Tenant can read own audit logs
CREATE POLICY tenant_read_own_audit_logs ON compliance_audit_logs
  FOR SELECT
  USING (
    tenant_id = current_setting('app.current_tenant_id')::UUID
  );

-- Admin can read all violations
CREATE POLICY admin_read_violations ON compliance_violation_alerts
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = current_setting('app.current_user_id')::UUID 
      AND level IN ('L1_SUPER_ADMIN', 'L2_OPS_ADMIN')
    )
  );

-- Tenant can read own violations
CREATE POLICY tenant_read_own_violations ON compliance_violation_alerts
  FOR SELECT
  USING (
    tenant_id = current_setting('app.current_tenant_id')::UUID
  );

-- Compliance layer can write to resource tags
CREATE POLICY compliance_write_resource_tags ON resource_compliance_tags
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = current_setting('app.current_user_id')::UUID 
      AND level = 'L1_SUPER_ADMIN'
    )
  );
