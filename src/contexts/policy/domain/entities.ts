// ═══════════════════════════════════════════════════════════
// POLICY CONTEXT - Domain Layer
// Entities & Value Objects
// ═══════════════════════════════════════════════════════════

export type PolicyAction = 'allow' | 'deny' | 'warn';
export type Severity = 'low' | 'medium' | 'high' | 'critical';

// ═══════════════════════════════════════════════════════════
// ENTITIES
// ═══════════════════════════════════════════════════════════

export interface Policy {
  id: string;
  name: string;
  description: string;
  condition: PolicyCondition;
  action: PolicyAction;
  priority: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PolicyCondition {
  resource: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'contains';
  value: any;
  context?: Record<string, any>;
}

export interface Quota {
  id: string;
  tenantId: string;
  resourceType: string;
  limit: number;
  used: number;
  warningThreshold: number;
  resetPeriod?: 'daily' | 'weekly' | 'monthly';
  createdAt: Date;
  updatedAt: Date;
}

export interface UsageMetric {
  id: string;
  tenantId: string;
  resourceType: string;
  metricName: string;
  value: number;
  timestamp: Date;
}

export interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  regulation: string; // GDPR, HIPAA, etc.
  condition: PolicyCondition;
  severity: Severity;
  isActive: boolean;
  createdAt: Date;
}

export interface ComplianceFlag {
  id: string;
  resourceId: string;
  ruleId: string;
  severity: Severity;
  description: string;
  createdAt: Date;
  resolved: boolean;
  resolvedAt?: Date;
}

// ═══════════════════════════════════════════════════════════
// VALUE OBJECTS
// ═══════════════════════════════════════════════════════════

export interface PolicyEvaluationResult {
  allowed: boolean;
  policyId?: string;
  reason?: string;
  warnings?: string[];
}

export interface QuotaCheckResult {
  withinLimit: boolean;
  currentUsage: number;
  limit: number;
  percentage: number;
  warningTriggered: boolean;
}
