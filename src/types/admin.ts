// ═══════════════════════════════════════════════════════════
// ABRAN SYSTEM - Enterprise Multi-Cloud Admin Types
// ═══════════════════════════════════════════════════════════

export type ProviderType = 'INTERNAL' | 'LOCAL_EXTERNAL' | 'INTL_EXTERNAL';
export type ResourceStatus = 'RUNNING' | 'STOPPED' | 'MIGRATING' | 'ERROR' | 'PROVISIONING';
export type MigrationStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
export type UserLevel = 'L1_SUPER_ADMIN' | 'L2_OPS_ADMIN' | 'L3_VIEWER';
export type ResourceType = 'VPS' | 'GPU' | 'STORAGE' | 'DB';

export interface Provider {
  id: string;
  name: string;
  type: ProviderType;
  currency: string;
  isActive: boolean;
  location: string;
  contractStart?: string;
  contractEnd?: string;
  monthlyBudget?: number;
  resourceCount: number;
  healthScore: number; // 0-100
}

export interface ResourceSpecs {
  cpu?: number;
  ram?: number; // MB
  disk?: number; // GB
  gpu?: string;
  vram?: number; // GB
  network?: number; // Gbps
}

export interface Resource {
  id: string;
  providerId: string;
  provider: Provider;
  externalId?: string;
  name: string;
  type: ResourceType;
  status: ResourceStatus;
  specs: ResourceSpecs;
  costPerHour: number;
  retailPrice: number;
  customerId?: string;
  marginPercent: number;
  ipAddress?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Migration {
  id: string;
  resourceId: string;
  resource: Resource;
  fromProviderId: string;
  fromProvider: Provider;
  toProviderId: string;
  toProvider: Provider;
  status: MigrationStatus;
  initiatedBy: string;
  startedAt: string;
  completedAt?: string;
  estimatedDowntime?: number; // minutes
  actualDowntime?: number; // minutes
  costEstimate: number;
  logs: string[];
  errorMessage?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  tier: 'bronze' | 'silver' | 'gold' | 'enterprise';
  balance: number;
  resourceCount: number;
  createdAt: string;
}

export interface FinancialTransaction {
  id: string;
  type: 'WHOLESALE_COST' | 'RETAIL_REVENUE' | 'MIGRATION_COST';
  resourceId?: string;
  providerId?: string;
  customerId?: string;
  amount: number;
  currency: string;
  amountIRR: number;
  description: string;
  transactionDate: string;
}

export interface ExchangeRate {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  effectiveDate: string;
}

export interface BalancingRule {
  id: string;
  name: string;
  condition: {
    metric: string;
    operator: '>' | '<' | '=' | '>=' | '<=';
    threshold: number;
    duration: string;
  };
  action: {
    type: 'route_orders' | 'migrate_workloads' | 'failover';
    target: ProviderType;
  };
  isActive: boolean;
  priority: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userLevel: UserLevel;
  action: string;
  target?: string;
  details?: Record<string, any>;
  ipAddress: string;
  timestamp: string;
}

export interface AdminUser {
  id: string;
  email: string;
  level: UserLevel;
  mfaEnabled: boolean;
  allowedIps: string[];
  isActive: boolean;
  lastLogin?: string;
}

// Dashboard Metrics
export interface DashboardMetrics {
  totalResources: number;
  runningResources: number;
  totalCustomers: number;
  monthlyRevenue: number;
  monthlyCost: number;
  profit: number;
  activeMigrations: number;
  providerHealth: {
    internal: number;
    local: number;
    international: number;
  };
}
