// ═══════════════════════════════════════════════════════════
// COMPLIANCE ORCHESTRATOR
// Central coordinator for all compliance engines
// ═══════════════════════════════════════════════════════════

import { 
  ComplianceContext, 
  ComplianceEvaluationResult, 
  PolicyResult,
  ComplianceViolation,
  EngineType,
  IComplianceEngine,
  Severity
} from './types';

import { DataResidencyEngine } from './engines/DataResidencyEngine';
import { CrossBorderTransferEngine } from './engines/CrossBorderTransferEngine';
import { SanctionsExportControlEngine } from './engines/SanctionsExportControlEngine';
import { DataClassificationEngine } from './engines/DataClassificationEngine';
import { TenantDataPlacementEngine } from './engines/TenantDataPlacementEngine';
import { AuditComplianceReportingEngine } from './engines/AuditComplianceReportingEngine';

import { eventBus } from '../events/EventBus';

export class ComplianceOrchestrator {
  private engines: Map<EngineType, IComplianceEngine> = new Map();
  private adminNotificationCallback?: (violation: ComplianceViolation) => void;

  constructor() {
    this.initializeEngines();
    this.setupEventListeners();
  }

  private initializeEngines() {
    // Initialize all 6 engines
    this.engines.set('RESIDENCY', new DataResidencyEngine());
    this.engines.set('CROSS_BORDER', new CrossBorderTransferEngine());
    this.engines.set('SANCTIONS', new SanctionsExportControlEngine());
    this.engines.set('CLASSIFICATION', new DataClassificationEngine());
    this.engines.set('TENANT_PLACEMENT', new TenantDataPlacementEngine());
    this.engines.set('AUDIT', new AuditComplianceReportingEngine());

    console.log('[ComplianceOrchestrator] All 6 engines initialized');
  }

  private setupEventListeners() {
    // Listen for rule updates from Admin
    eventBus.subscribe('Compliance.RuleUpdated', 'compliance', (event: any) => {
      this.handleRuleUpdate(event);
    });

    // Listen for resource events from Control Plane
    eventBus.subscribe('ResourceProvisioned', 'compliance', (event: any) => {
      this.handleResourceProvisioned(event);
    });

    eventBus.subscribe('MigrationCompleted', 'compliance', (event: any) => {
      this.handleMigrationCompleted(event);
    });

    console.log('[ComplianceOrchestrator] Event listeners registered');
  }

  // ═══════════════════════════════════════════════════════════
  // CORE EVALUATION METHOD
  // ═══════════════════════════════════════════════════════════

  async evaluate(
    context: ComplianceContext,
    engineTypes?: EngineType[]
  ): Promise<ComplianceEvaluationResult> {
    const enginesToRun = engineTypes 
      ? engineTypes.map(type => this.engines.get(type)).filter(Boolean) as IComplianceEngine[]
      : Array.from(this.engines.values());

    const results: PolicyResult[] = [];

    // Run all engines in parallel
    const evaluationPromises = enginesToRun.map(engine => 
      engine.evaluate(context).catch(error => {
        console.error(`[ComplianceOrchestrator] Engine ${engine.type} failed:`, error);
        return {
          decision: 'DENY' as const,
          engine: engine.type,
          reason: `Engine error: ${error.message}`,
          timestamp: new Date()
        };
      })
    );

    const evaluationResults = await Promise.all(evaluationPromises);
    results.push(...evaluationResults);

    // Determine overall decision
    const hasDeny = results.some(r => r.decision === 'DENY');
    const hasWarn = results.some(r => r.decision === 'WARN');

    // Log to audit engine
    const auditEngine = this.engines.get('AUDIT') as AuditComplianceReportingEngine;
    if (auditEngine) {
      const decision = hasDeny ? 'DENY' : 'ALLOW';
      const reason = hasDeny 
        ? results.find(r => r.decision === 'DENY')?.reason 
        : 'All checks passed';
      
      auditEngine.logDecision(context, decision, 'ORCHESTRATOR', reason || '');
    }

    // If denied, create violation and notify admin
    if (hasDeny) {
      const denyResult = results.find(r => r.decision === 'DENY')!;
      const violation = this.createViolation(context, denyResult);
      
      // Log violation
      if (auditEngine) {
        auditEngine.logViolation(violation);
      }

      // Notify admin
      await this.notifyAdmin(violation);

      // Emit violation event
      eventBus.publish('Compliance.Violation', violation, 'compliance');
    }

    return {
      allowed: !hasDeny,
      results,
      contextHash: this.generateContextHash(context),
      timestamp: new Date()
    };
  }

  // ═══════════════════════════════════════════════════════════
  // BIDIRECTIONAL: Admin -> Compliance (Hot Reload)
  // ═══════════════════════════════════════════════════════════

  private handleRuleUpdate(event: { engine: EngineType; config: Record<string, any> }) {
    const engine = this.engines.get(event.engine);
    if (engine) {
      engine.reloadRules(event.config);
      console.log(`[ComplianceOrchestrator] Engine ${event.engine} hot-reloaded by Admin`);
    }
  }

  // Admin can update rules for a specific engine
  async updateEngineRules(engineType: EngineType, config: Record<string, any>) {
    const engine = this.engines.get(engineType);
    if (!engine) {
      throw new Error(`Engine ${engineType} not found`);
    }

    engine.reloadRules(config);
    
    // Publish event for audit
    eventBus.publish('Compliance.RuleUpdated', { engine: engineType, config }, 'compliance');
    
    console.log(`[ComplianceOrchestrator] Rules updated for engine: ${engineType}`);
  }

  // ═══════════════════════════════════════════════════════════
  // BIDIRECTIONAL: Compliance -> Admin (Real-Time Alerts)
  // ═══════════════════════════════════════════════════════════

  private async notifyAdmin(violation: ComplianceViolation) {
    console.log(`[ComplianceOrchestrator] Notifying Admin of violation: ${violation.message}`);

    // Call admin notification callback if registered
    if (this.adminNotificationCallback) {
      this.adminNotificationCallback(violation);
    }

    // Emit event for admin dashboard
    eventBus.publish('Admin.ComplianceAlert', {
      type: 'COMPLIANCE_VIOLATION',
      severity: violation.severity,
      message: violation.message,
      tenantId: violation.tenantId,
      timestamp: violation.timestamp
    }, 'compliance');
  }

  // Register admin notification callback
  registerAdminNotificationCallback(callback: (violation: ComplianceViolation) => void) {
    this.adminNotificationCallback = callback;
    console.log('[ComplianceOrchestrator] Admin notification callback registered');
  }

  // ═══════════════════════════════════════════════════════════
  // BIDIRECTIONAL: Control Plane -> Compliance (Event Feedback)
  // ═══════════════════════════════════════════════════════════

  private async handleResourceProvisioned(event: any) {
    console.log('[ComplianceOrchestrator] Resource provisioned, running classification...');

    const classificationEngine = this.engines.get('CLASSIFICATION') as DataClassificationEngine;
    if (classificationEngine && event.specs) {
      const tags = classificationEngine.getClassificationTags({
        dataFields: event.specs.dataFields,
        dataType: event.specs.dataType,
        location: event.providerRegion
      });

      // Update inventory with compliance tags
      eventBus.publish('Inventory.UpdateTags', {
        resourceId: event.resourceId,
        tags
      }, 'compliance');

      console.log(`[ComplianceOrchestrator] Classification tags applied to resource ${event.resourceId}`);
    }
  }

  private async handleMigrationCompleted(event: any) {
    console.log('[ComplianceOrchestrator] Migration completed, verifying cross-border compliance...');

    const crossBorderEngine = this.engines.get('CROSS_BORDER') as CrossBorderTransferEngine;
    if (crossBorderEngine && event.sourceLocation && event.destinationLocation) {
      // Log the migration for audit
      const auditEngine = this.engines.get('AUDIT') as AuditComplianceReportingEngine;
      if (auditEngine) {
        auditEngine.logDecision(
          {
            action: 'MIGRATE',
            user: event.user,
            tenant: event.tenant,
            migration: {
              sourceLocation: event.sourceLocation,
              destinationLocation: event.destinationLocation,
              resourceId: event.resourceId,
              dataType: event.dataType
            }
          },
          'ALLOW',
          'CROSS_BORDER',
          'Migration completed and logged'
        );
      }
    }
  }

  // ═══════════════════════════════════════════════════════════
  // HELPER METHODS
  // ═══════════════════════════════════════════════════════════

  private createViolation(context: ComplianceContext, result: PolicyResult): ComplianceViolation {
    return {
      id: `violation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      severity: this.determineSeverity(result),
      engine: result.engine,
      message: result.reason || 'Compliance violation',
      tenantId: context.tenant.tenantId,
      userId: context.user.userId,
      action: context.action,
      context,
      isRead: false
    };
  }

  private determineSeverity(result: PolicyResult): Severity {
    // Determine severity based on engine and reason
    if (result.engine === 'SANCTIONS') return 'CRITICAL';
    if (result.engine === 'RESIDENCY') return 'HIGH';
    if (result.engine === 'CROSS_BORDER') return 'HIGH';
    if (result.engine === 'TENANT_PLACEMENT') return 'MEDIUM';
    return 'LOW';
  }

  private generateContextHash(context: ComplianceContext): string {
    const contextString = JSON.stringify({
      userId: context.user.userId,
      tenantId: context.tenant.tenantId,
      action: context.action,
      timestamp: Date.now()
    });
    
    let hash = 0;
    for (let i = 0; i < contextString.length; i++) {
      const char = contextString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  // ═══════════════════════════════════════════════════════════
  // PUBLIC API METHODS
  // ═══════════════════════════════════════════════════════════

  getEngine(engineType: EngineType): IComplianceEngine | undefined {
    return this.engines.get(engineType);
  }

  getAllEngines(): IComplianceEngine[] {
    return Array.from(this.engines.values());
  }

  getAuditLogs(tenantId?: string) {
    const auditEngine = this.engines.get('AUDIT') as AuditComplianceReportingEngine;
    if (!auditEngine) return [];
    
    return tenantId 
      ? auditEngine.getAuditLogsByTenant(tenantId)
      : auditEngine.getAllAuditLogs();
  }

  getViolations(limit?: number) {
    const auditEngine = this.engines.get('AUDIT') as AuditComplianceReportingEngine;
    if (!auditEngine) return [];
    
    return auditEngine.getRecentViolations(limit);
  }

  generateGDPRReport(tenantId: string) {
    const auditEngine = this.engines.get('AUDIT') as AuditComplianceReportingEngine;
    if (!auditEngine) return null;
    
    return auditEngine.generateGDPRReport(tenantId);
  }
}

// ═══════════════════════════════════════════════════════════
// SINGLETON INSTANCE
// ═══════════════════════════════════════════════════════════

export const complianceOrchestrator = new ComplianceOrchestrator();
