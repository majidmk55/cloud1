// ═══════════════════════════════════════════════════════════
// COMPLIANCE LAYER - Types & Interfaces
// Policy Enforcement Point (PEP)
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// CORE TYPES
// ═══════════════════════════════════════════════════════════

export type PolicyDecision = 'ALLOW' | 'DENY' | 'WARN';
export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type EngineType = 
  | 'RESIDENCY' 
  | 'CROSS_BORDER' 
  | 'SANCTIONS' 
  | 'CLASSIFICATION' 
  | 'TENANT_PLACEMENT' 
  | 'AUDIT';

export type Region = 'IR' | 'EU' | 'US' | 'ASIA' | 'GLOBAL';
export type Classification = 'PII' | 'FINANCIAL' | 'LOGS' | 'PUBLIC' | 'CONFIDENTIAL';
export type EncryptionLevel = 'NONE' | 'AES128' | 'AES256' | 'RSA2048';
export type PlanType = 'FREE' | 'STARTER' | 'BUSINESS' | 'ENTERPRISE' | 'DEDICATED';

// ═══════════════════════════════════════════════════════════
// CONTEXT TYPES
// ═══════════════════════════════════════════════════════════

export interface UserContext {
  userId: string;
  tenantId: string;
  region: Region;
  planType: PlanType;
  billingAddress?: {
    country: string;
    city: string;
  };
  ipAddress?: string;
}

export interface TenantContext {
  tenantId: string;
  region: Region;
  planType: PlanType;
  isEnterprise: boolean;
  complianceRequirements: string[];
}

export interface ResourceContext {
  resourceId?: string;
  type: string;
  location: Region;
  dataType?: string;
  sensitivityLevel?: string;
  dataFields?: string[];
}

export interface TemplateContext {
  templateId: string;
  sensitivityLevel: string;
  osType: string;
  requiredEncryption?: EncryptionLevel;
}

export interface MigrationContext {
  sourceLocation: Region;
  destinationLocation: Region;
  resourceId: string;
  dataType: string;
  approvalFlag?: boolean;
}

export interface ComplianceContext {
  action: string; // 'PROVISION', 'MIGRATE', 'EXPORT', 'DELETE'
  user: UserContext;
  tenant: TenantContext;
  resource?: ResourceContext;
  template?: TemplateContext;
  migration?: MigrationContext;
  metadata?: Record<string, any>;
}

// ═══════════════════════════════════════════════════════════
// RESULT TYPES
// ═══════════════════════════════════════════════════════════

export interface PolicyResult {
  decision: PolicyDecision;
  engine: EngineType;
  reason?: string;
  warnings?: string[];
  metadata?: Record<string, any>;
  timestamp: Date;
}

export interface ComplianceEvaluationResult {
  allowed: boolean;
  results: PolicyResult[];
  contextHash: string;
  timestamp: Date;
}

export interface ComplianceViolation {
  id: string;
  timestamp: Date;
  severity: Severity;
  engine: EngineType;
  message: string;
  tenantId: string;
  userId: string;
  action: string;
  context: ComplianceContext;
  isRead: boolean;
}

// ═══════════════════════════════════════════════════════════
// TAG TYPES
// ═══════════════════════════════════════════════════════════

export interface ResourceComplianceTag {
  resourceId: string;
  residency: Region;
  classification: Classification;
  encryptionLevel: EncryptionLevel;
  retentionDays?: number;
  isCrossBorderAllowed: boolean;
  lastChecked: Date;
}

// ═══════════════════════════════════════════════════════════
// AUDIT TYPES
// ═══════════════════════════════════════════════════════════

export interface ComplianceAuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  tenantId: string;
  action: string;
  decision: PolicyDecision;
  engineType: EngineType;
  reason?: string;
  contextHash: string;
  metadata?: Record<string, any>;
}

// ═══════════════════════════════════════════════════════════
// RULE TYPES
// ═══════════════════════════════════════════════════════════

export interface ComplianceRule {
  id: string;
  engineType: EngineType;
  config: Record<string, any>;
  priority: number;
  isActive: boolean;
  updatedAt: Date;
}

export interface ResidencyRuleConfig {
  allowedRegions: Region[];
  blockedCountries: string[];
  exceptions?: string[];
}

export interface SanctionsRuleConfig {
  blockedEntities: string[];
  blockedCountries: string[];
  blockedIPs: string[];
}

export interface ClassificationRuleConfig {
  piiFields: string[];
  financialFields: string[];
  encryptionRequirements: Record<Classification, EncryptionLevel>;
  retentionPolicies: Record<string, number>;
}

// ═══════════════════════════════════════════════════════════
// ENGINE INTERFACE
// ═══════════════════════════════════════════════════════════

export interface IComplianceEngine {
  type: EngineType;
  evaluate(context: ComplianceContext): Promise<PolicyResult>;
  reloadRules(config: Record<string, any>): void;
  getRules(): ComplianceRule[];
}

// ═══════════════════════════════════════════════════════════
// ERROR TYPES
// ═══════════════════════════════════════════════════════════

export class ComplianceViolationError extends Error {
  public readonly violation: ComplianceViolation;
  
  constructor(violation: ComplianceViolation) {
    super(violation.message);
    this.name = 'ComplianceViolationError';
    this.violation = violation;
  }
}
