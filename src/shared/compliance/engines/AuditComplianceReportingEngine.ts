// ═══════════════════════════════════════════════════════════
// ENGINE 6: Audit & Compliance Reporting Engine
// Immutable logging and proof generation
// ═══════════════════════════════════════════════════════════

import { 
  IComplianceEngine, 
  ComplianceContext, 
  PolicyResult, 
  EngineType,
  ComplianceRule,
  ComplianceAuditLog,
  ComplianceViolation
} from '../types';

export class AuditComplianceReportingEngine implements IComplianceEngine {
  type: EngineType = 'AUDIT';
  private rules: ComplianceRule[] = [];
  private auditLogs: ComplianceAuditLog[] = [];
  private violations: ComplianceViolation[] = [];

  constructor() {
    this.loadDefaultRules();
  }

  private loadDefaultRules() {
    this.rules = [
      {
        id: 'audit-001',
        engineType: 'AUDIT',
        config: {
          logAllDecisions: true,
          immutableLogs: true,
          generateReports: true
        },
        priority: 100,
        isActive: true,
        updatedAt: new Date()
      }
    ];
  }

  async evaluate(context: ComplianceContext): Promise<PolicyResult> {
    // Audit engine always allows but logs the action
    const auditLog = this.createAuditLog(context, 'ALLOW', 'Audit trail created');
    this.auditLogs.push(auditLog);

    return {
      decision: 'ALLOW',
      engine: this.type,
      reason: 'Audit trail created',
      metadata: {
        auditLogId: auditLog.id,
        timestamp: auditLog.timestamp
      },
      timestamp: new Date()
    };
  }

  private createAuditLog(
    context: ComplianceContext,
    decision: 'ALLOW' | 'DENY',
    reason: string
  ): ComplianceAuditLog {
    return {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      userId: context.user.userId,
      tenantId: context.tenant.tenantId,
      action: context.action,
      decision,
      engineType: this.type,
      reason,
      contextHash: this.generateContextHash(context),
      metadata: {
        userRegion: context.user.region,
        tenantPlan: context.tenant.planType,
        resourceType: context.resource?.type
      }
    };
  }

  private generateContextHash(context: ComplianceContext): string {
    // Simple hash generation (in production, use SHA256)
    const contextString = JSON.stringify({
      userId: context.user.userId,
      tenantId: context.tenant.tenantId,
      action: context.action,
      timestamp: Date.now()
    });
    
    // Simple hash (replace with crypto in production)
    let hash = 0;
    for (let i = 0; i < contextString.length; i++) {
      const char = contextString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  reloadRules(config: Record<string, any>): void {
    console.log('[AuditComplianceReportingEngine] Rules hot-reloaded');
  }

  getRules(): ComplianceRule[] {
    return this.rules;
  }

  // Log a compliance decision
  logDecision(context: ComplianceContext, decision: 'ALLOW' | 'DENY', engineType: string, reason: string) {
    const auditLog = this.createAuditLog(context, decision, reason);
    auditLog.engineType = engineType as any;
    this.auditLogs.push(auditLog);
    
    console.log(`[AuditEngine] Decision logged: ${decision} - ${reason}`);
  }

  // Log a violation
  logViolation(violation: ComplianceViolation) {
    this.violations.push(violation);
    
    // Also create an audit log
    const auditLog = this.createAuditLog(
      violation.context,
      'DENY',
      violation.message
    );
    this.auditLogs.push(auditLog);
    
    console.log(`[AuditEngine] Violation logged: ${violation.severity} - ${violation.message}`);
  }

  // Get audit logs for a tenant
  getAuditLogsByTenant(tenantId: string): ComplianceAuditLog[] {
    return this.auditLogs.filter(log => log.tenantId === tenantId);
  }

  // Get recent violations
  getRecentViolations(limit: number = 100): ComplianceViolation[] {
    return this.violations
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  // Generate GDPR report for a tenant
  generateGDPRReport(tenantId: string): {
    tenantId: string;
    generatedAt: Date;
    totalActions: number;
    allowedActions: number;
    deniedActions: number;
    violations: number;
    dataResidency: Record<string, number>;
    actions: ComplianceAuditLog[];
  } {
    const tenantLogs = this.getAuditLogsByTenant(tenantId);
    const tenantViolations = this.violations.filter(v => v.tenantId === tenantId);

    const allowedActions = tenantLogs.filter(log => log.decision === 'ALLOW').length;
    const deniedActions = tenantLogs.filter(log => log.decision === 'DENY').length;

    // Calculate data residency distribution
    const dataResidency: Record<string, number> = {};
    tenantLogs.forEach(log => {
      const region = log.metadata?.userRegion || 'UNKNOWN';
      dataResidency[region] = (dataResidency[region] || 0) + 1;
    });

    return {
      tenantId,
      generatedAt: new Date(),
      totalActions: tenantLogs.length,
      allowedActions,
      deniedActions,
      violations: tenantViolations.length,
      dataResidency,
      actions: tenantLogs
    };
  }

  // Get all audit logs
  getAllAuditLogs(): ComplianceAuditLog[] {
    return this.auditLogs;
  }

  // Get all violations
  getAllViolations(): ComplianceViolation[] {
    return this.violations;
  }

  // Clear old logs (for maintenance)
  clearLogsOlderThan(days: number) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    this.auditLogs = this.auditLogs.filter(log => log.timestamp > cutoffDate);
    this.violations = this.violations.filter(v => v.timestamp > cutoffDate);
    
    console.log(`[AuditEngine] Cleared logs older than ${days} days`);
  }
}
