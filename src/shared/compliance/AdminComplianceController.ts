// ═══════════════════════════════════════════════════════════
// ADMIN COMPLIANCE CONTROLLER
// Bridge between Admin Panel and Compliance Layer
// ═══════════════════════════════════════════════════════════

import { complianceOrchestrator } from '../compliance/ComplianceOrchestrator';
import { EngineType } from '../compliance/types';

// ═══════════════════════════════════════════════════════════
// CONTROLLER CLASS
// ═══════════════════════════════════════════════════════════

export class AdminComplianceController {
  /**
   * GET /api/admin/compliance/rules
   * Fetch all compliance rules
   */
  static async getRules() {
    console.log('[AdminComplianceController] Fetching all compliance rules');
    
    const engines = complianceOrchestrator.getAllEngines();
    const rules = engines.map(engine => ({
      engineType: engine.type,
      rules: engine.getRules()
    }));

    return {
      success: true,
      data: rules,
      timestamp: new Date()
    };
  }

  /**
   * PUT /api/admin/compliance/rules/:engineType
   * Update rules for a specific engine (triggers hot-reload)
   */
  static async updateRules(engineType: EngineType, config: Record<string, any>) {
    console.log(`[AdminComplianceController] Updating rules for engine: ${engineType}`);

    try {
      await complianceOrchestrator.updateEngineRules(engineType, config);

      return {
        success: true,
        message: `Rules updated and hot-reloaded for engine: ${engineType}`,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('[AdminComplianceController] Error updating rules:', error);
      throw error;
    }
  }

  /**
   * GET /api/admin/compliance/audit-logs
   * Fetch audit logs (optionally filtered by tenant)
   */
  static async getAuditLogs(tenantId?: string) {
    console.log(`[AdminComplianceController] Fetching audit logs${tenantId ? ` for tenant: ${tenantId}` : ''}`);

    const logs = complianceOrchestrator.getAuditLogs(tenantId);

    return {
      success: true,
      data: logs,
      count: logs.length,
      timestamp: new Date()
    };
  }

  /**
   * GET /api/admin/compliance/violations
   * Fetch recent compliance violations
   */
  static async getViolations(limit: number = 100) {
    console.log(`[AdminComplianceController] Fetching recent violations (limit: ${limit})`);

    const violations = complianceOrchestrator.getViolations(limit);

    return {
      success: true,
      data: violations,
      count: violations.length,
      timestamp: new Date()
    };
  }

  /**
   * GET /api/admin/compliance/status
   * Get health status of all compliance engines
   */
  static async getStatus() {
    console.log('[AdminComplianceController] Fetching compliance engine status');

    const engines = complianceOrchestrator.getAllEngines();
    const status = engines.map(engine => ({
      engineType: engine.type,
      ruleCount: engine.getRules().length,
      isActive: true // In production, check actual health
    }));

    return {
      success: true,
      data: {
        engines: status,
        totalEngines: engines.length,
        timestamp: new Date()
      }
    };
  }

  /**
   * GET /api/admin/compliance/reports/gdpr/:tenantId
   * Generate GDPR report for a specific tenant
   */
  static async generateGDPRReport(tenantId: string) {
    console.log(`[AdminComplianceController] Generating GDPR report for tenant: ${tenantId}`);

    const report = complianceOrchestrator.generateGDPRReport(tenantId);

    if (!report) {
      return {
        success: false,
        error: 'Failed to generate GDPR report',
        timestamp: new Date()
      };
    }

    return {
      success: true,
      data: report,
      timestamp: new Date()
    };
  }

  /**
   * POST /api/admin/compliance/force-reevaluation
   * Force re-evaluation of compliance for a tenant
   */
  static async forceReevaluation(tenantId: string) {
    console.log(`[AdminComplianceController] Force re-evaluation for tenant: ${tenantId}`);

    // In production, this would:
    // 1. Fetch all resources for the tenant
    // 2. Re-run compliance checks on each resource
    // 3. Update compliance tags
    // 4. Generate a report

    return {
      success: true,
      message: `Re-evaluation initiated for tenant: ${tenantId}`,
      timestamp: new Date()
    };
  }
}

// ═══════════════════════════════════════════════════════════
// EXPRESS ROUTE HANDLERS
// ═══════════════════════════════════════════════════════════

/*
// Example Express routes
import express from 'express';
const router = express.Router();

// GET /api/admin/compliance/rules
router.get('/rules', async (req, res) => {
  try {
    const result = await AdminComplianceController.getRules();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/admin/compliance/rules/:engineType
router.put('/rules/:engineType', async (req, res) => {
  try {
    const engineType = req.params.engineType as EngineType;
    const config = req.body;
    
    const result = await AdminComplianceController.updateRules(engineType, config);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/admin/compliance/audit-logs
router.get('/audit-logs', async (req, res) => {
  try {
    const tenantId = req.query.tenantId as string;
    const result = await AdminComplianceController.getAuditLogs(tenantId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/admin/compliance/violations
router.get('/violations', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const result = await AdminComplianceController.getViolations(limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/admin/compliance/status
router.get('/status', async (req, res) => {
  try {
    const result = await AdminComplianceController.getStatus();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/admin/compliance/reports/gdpr/:tenantId
router.get('/reports/gdpr/:tenantId', async (req, res) => {
  try {
    const tenantId = req.params.tenantId;
    const result = await AdminComplianceController.generateGDPRReport(tenantId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/admin/compliance/force-reevaluation
router.post('/force-reevaluation', async (req, res) => {
  try {
    const tenantId = req.body.tenantId;
    const result = await AdminComplianceController.forceReevaluation(tenantId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
*/

// ═══════════════════════════════════════════════════════════
// USAGE EXAMPLES
// ═══════════════════════════════════════════════════════════

/*
// Example 1: Admin updates residency rules
await AdminComplianceController.updateRules('RESIDENCY', {
  allowedRegions: ['IR', 'EU'],
  blockedCountries: ['KP', 'SY']
});

// Example 2: Admin fetches audit logs for a tenant
const logs = await AdminComplianceController.getAuditLogs('tenant-123');
console.log('Audit logs:', logs.data);

// Example 3: Admin generates GDPR report
const report = await AdminComplianceController.generateGDPRReport('tenant-123');
console.log('GDPR Report:', report.data);

// Example 4: Admin checks engine status
const status = await AdminComplianceController.getStatus();
console.log('Engine status:', status.data);
*/
