-- ═══════════════════════════════════════════════════════════
-- ABRAN SYSTEM - Enterprise Multi-Cloud Admin Schema
-- Isolated Admin/OPS Plane Database
-- ═══════════════════════════════════════════════════════════

-- Provider Types
CREATE TYPE provider_type AS ENUM ('INTERNAL', 'LOCAL_EXTERNAL', 'INTL_EXTERNAL');

-- Resource Status
CREATE TYPE resource_status AS ENUM ('RUNNING', 'STOPPED', 'MIGRATING', 'ERROR', 'PROVISIONING');

-- Migration Status
CREATE TYPE migration_status AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'CANCELLED');

-- User Access Levels
CREATE TYPE user_level AS ENUM ('L1_SUPER_ADMIN', 'L2_OPS_ADMIN', 'L3_VIEWER');

-- ═══════════════════════════════════════════════════════════
-- PROVIDERS (Tri-Partite Infrastructure Model)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type provider_type NOT NULL,
  api_config JSONB, -- Encrypted API credentials
  currency VARCHAR(3) NOT NULL DEFAULT 'IRR', -- IRR, USD, EUR
  is_active BOOLEAN DEFAULT true,
  location VARCHAR(255),
  contract_start DATE,
  contract_end DATE,
  monthly_budget DECIMAL(15, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════
-- RESOURCES (VPS, GPU, Storage across all providers)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id),
  external_id VARCHAR(255), -- ID in upstream provider's system
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- VPS, GPU, STORAGE, DB
  status resource_status DEFAULT 'STOPPED',
  specs JSONB NOT NULL, -- { cpu: 4, ram: 8192, disk: 100, gpu: 'A100' }
  cost_per_hour DECIMAL(10, 4), -- Wholesale cost
  retail_price DECIMAL(10, 2), -- Customer price
  customer_id UUID, -- Assigned customer
  margin_percent DECIMAL(5, 2), -- Profit margin
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════
-- MIGRATIONS (Smart Shifting Engine)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE migrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES resources(id),
  from_provider_id UUID REFERENCES providers(id),
  to_provider_id UUID REFERENCES providers(id),
  status migration_status DEFAULT 'PENDING',
  initiated_by UUID, -- Admin user ID
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  estimated_downtime INTERVAL,
  actual_downtime INTERVAL,
  cost_estimate DECIMAL(10, 2),
  logs JSONB, -- Migration process logs
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════
-- CUSTOMERS
-- ═══════════════════════════════════════════════════════════
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  company VARCHAR(255),
  tier VARCHAR(50), -- bronze, silver, gold, enterprise
  balance DECIMAL(15, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════
-- FINANCIAL LEDGER (Multi-Currency)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL, -- WHOLESALE_COST, RETAIL_REVENUE, MIGRATION_COST
  resource_id UUID REFERENCES resources(id),
  provider_id UUID REFERENCES providers(id),
  customer_id UUID REFERENCES customers(id),
  amount DECIMAL(15, 4) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  amount_irr DECIMAL(15, 2), -- Converted to IRR
  description TEXT,
  transaction_date TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════
-- EXCHANGE RATES (Real-time)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE exchange_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_currency VARCHAR(3) NOT NULL,
  to_currency VARCHAR(3) NOT NULL,
  rate DECIMAL(15, 6) NOT NULL,
  effective_date TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════
-- AUTO-BALANCING RULES ENGINE
-- ═══════════════════════════════════════════════════════════
CREATE TABLE balancing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  condition JSONB NOT NULL, -- { metric: 'cpu_avg', operator: '>', threshold: 85, duration: '10min' }
  action JSONB NOT NULL, -- { type: 'route_orders', target: 'LOCAL_DC' }
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════
-- AUDIT LOG (Immutable)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  user_level user_level NOT NULL,
  action VARCHAR(255) NOT NULL, -- MIGRATE_RESOURCE, CHANGE_RBAC, etc.
  target VARCHAR(255), -- Resource ID or Setting key
  details JSONB,
  ip_address INET NOT NULL,
  user_agent TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════
-- ADMIN USERS (Zero Trust Access Control)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  level user_level NOT NULL,
  mfa_secret VARCHAR(255), -- TOTP secret
  mfa_enabled BOOLEAN DEFAULT false,
  device_certificates JSONB, -- Certificate-based auth
  allowed_ips INET[], -- IP allowlist
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════
-- RBAC PERMISSIONS (Granular)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES admin_users(id),
  permission VARCHAR(255) NOT NULL, -- ops:read, billing:write, migration:execute
  granted_by UUID REFERENCES admin_users(id),
  granted_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════
-- BREAKGLASS ACCESS (Emergency Override)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE breakglass_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requested_by UUID REFERENCES admin_users(id),
  approved_by_1 UUID REFERENCES admin_users(id),
  approved_by_2 UUID REFERENCES admin_users(id),
  reason TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, APPROVED, USED, EXPIRED
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════
-- INDEXES FOR PERFORMANCE
-- ═══════════════════════════════════════════════════════════
CREATE INDEX idx_resources_provider ON resources(provider_id);
CREATE INDEX idx_resources_status ON resources(status);
CREATE INDEX idx_resources_customer ON resources(customer_id);
CREATE INDEX idx_migrations_status ON migrations(status);
CREATE INDEX idx_migrations_resource ON migrations(resource_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_financial_transactions_date ON financial_transactions(transaction_date);

-- ═══════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE migrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- L1 Super Admin: Full access
CREATE POLICY l1_full_access ON resources FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = current_setting('app.current_user_id')::UUID AND level = 'L1_SUPER_ADMIN')
);

-- L2 Ops Admin: Read + Write ops, no delete
CREATE POLICY l2_ops_access ON resources FOR SELECT USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = current_setting('app.current_user_id')::UUID AND level IN ('L1_SUPER_ADMIN', 'L2_OPS_ADMIN'))
);

-- L3 Viewer: Read only
CREATE POLICY l3_read_only ON resources FOR SELECT USING (true);
