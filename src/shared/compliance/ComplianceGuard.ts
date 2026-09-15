// ═══════════════════════════════════════════════════════════
// COMPLIANCE GUARD MIDDLEWARE
// Policy Enforcement Point (PEP) for Control Plane
// ═══════════════════════════════════════════════════════════

import { ComplianceContext, EngineType, ComplianceViolationError } from './types';
import { complianceOrchestrator } from './ComplianceOrchestrator';

// ═══════════════════════════════════════════════════════════
// COMPLIANCE GUARD CLASS
// ═══════════════════════════════════════════════════════════

export class ComplianceGuard {
  /**
   * Check compliance before executing an action
   * This is the main entry point for Policy Enforcement
   */
  static async check(
    context: ComplianceContext,
    engines?: EngineType[]
  ): Promise<{ allowed: boolean; reason?: string }> {
    console.log(`[ComplianceGuard] Checking compliance for action: ${context.action}`);

    const result = await complianceOrchestrator.evaluate(context, engines);

    if (!result.allowed) {
      const denyResult = result.results.find(r => r.decision === 'DENY');
      const reason = denyResult?.reason || 'Compliance check failed';
      
      console.log(`[ComplianceGuard] DENIED: ${reason}`);
      
      return {
        allowed: false,
        reason
      };
    }

    console.log(`[ComplianceGuard] ALLOWED: All checks passed`);
    return { allowed: true };
  }

  /**
   * Check and throw error if denied
   * Use this for strict enforcement
   */
  static async checkOrThrow(
    context: ComplianceContext,
    engines?: EngineType[]
  ): Promise<void> {
    const result = await this.check(context, engines);
    
    if (!result.allowed) {
      throw new ComplianceViolationError({
        id: `violation-${Date.now()}`,
        timestamp: new Date(),
        severity: 'HIGH',
        engine: 'RESIDENCY', // Will be updated by orchestrator
        message: result.reason || 'Compliance violation',
        tenantId: context.tenant.tenantId,
        userId: context.user.userId,
        action: context.action,
        context,
        isRead: false
      });
    }
  }
}

// ═══════════════════════════════════════════════════════════
// DECORATOR FOR CONTROLLERS
// ═══════════════════════════════════════════════════════════

/**
 * Decorator to enforce compliance on controller methods
 * Usage: @EnforceCompliance('PROVISION', ['RESIDENCY', 'SANCTIONS'])
 */
export function EnforceCompliance(
  action: string,
  engines?: EngineType[]
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      // Extract context from arguments
      // Assuming first argument is the DTO and second is user context
      const dto = args[0];
      const userContext = args[1];

      if (!userContext || !userContext.userId || !userContext.tenantId) {
        throw new Error('User context required for compliance check');
      }

      // Build compliance context
      const complianceContext: ComplianceContext = {
        action,
        user: {
          userId: userContext.userId,
          tenantId: userContext.tenantId,
          region: userContext.region || 'GLOBAL',
          planType: userContext.planType || 'FREE',
          billingAddress: userContext.billingAddress,
          ipAddress: userContext.ipAddress
        },
        tenant: {
          tenantId: userContext.tenantId,
          region: userContext.tenantRegion || 'GLOBAL',
          planType: userContext.planType || 'FREE',
          isEnterprise: userContext.planType === 'ENTERPRISE' || userContext.planType === 'DEDICATED',
          complianceRequirements: userContext.complianceRequirements || []
        },
        resource: dto.resource,
        template: dto.template,
        migration: dto.migration,
        metadata: dto.metadata
      };

      // Check compliance
      await ComplianceGuard.checkOrThrow(complianceContext, engines);

      // If compliance check passes, execute original method
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

// ═══════════════════════════════════════════════════════════
// MIDDLEWARE FOR EXPRESS/NESTJS
// ═══════════════════════════════════════════════════════════

/**
 * Express middleware for compliance checking
 */
export function complianceMiddleware(action: string, engines?: EngineType[]) {
  return async (req: any, res: any, next: any) => {
    try {
      const userContext = req.user; // Assuming user is attached to request
      
      if (!userContext) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const complianceContext: ComplianceContext = {
        action,
        user: {
          userId: userContext.id,
          tenantId: userContext.tenantId,
          region: userContext.region || 'GLOBAL',
          planType: userContext.planType || 'FREE',
          billingAddress: userContext.billingAddress,
          ipAddress: req.ip
        },
        tenant: {
          tenantId: userContext.tenantId,
          region: userContext.tenantRegion || 'GLOBAL',
          planType: userContext.planType || 'FREE',
          isEnterprise: userContext.planType === 'ENTERPRISE' || userContext.planType === 'DEDICATED',
          complianceRequirements: userContext.complianceRequirements || []
        },
        resource: req.body.resource,
        template: req.body.template,
        migration: req.body.migration,
        metadata: req.body.metadata
      };

      const result = await ComplianceGuard.check(complianceContext, engines);

      if (!result.allowed) {
        return res.status(403).json({
          error: 'Compliance check failed',
          reason: result.reason,
          action: 'Request blocked by compliance policy'
        });
      }

      // Attach compliance result to request for downstream use
      req.complianceResult = result;
      
      next();
    } catch (error) {
      console.error('[ComplianceMiddleware] Error:', error);
      return res.status(500).json({ error: 'Compliance check error' });
    }
  };
}

// ═══════════════════════════════════════════════════════════
// USAGE EXAMPLES
// ═══════════════════════════════════════════════════════════

/*
// Example 1: Using ComplianceGuard directly
async function createResource(dto: any, user: any) {
  const context: ComplianceContext = {
    action: 'PROVISION',
    user: { userId: user.id, tenantId: user.tenantId, region: user.region, planType: user.planType },
    tenant: { tenantId: user.tenantId, region: user.region, planType: user.planType, isEnterprise: false, complianceRequirements: [] },
    resource: dto.resource
  };

  const result = await ComplianceGuard.check(context, ['RESIDENCY', 'SANCTIONS']);
  
  if (!result.allowed) {
    throw new Error(result.reason);
  }

  // Proceed with resource creation
  return await resourceService.create(dto);
}

// Example 2: Using decorator
class ProvisioningController {
  @EnforceCompliance('PROVISION', ['RESIDENCY', 'SANCTIONS', 'TENANT_PLACEMENT'])
  async createResource(dto: any, user: any) {
    // Compliance is automatically checked before this method executes
    return await resourceService.create(dto);
  }
}

// Example 3: Using middleware
app.post('/api/provisioning/resources',
  authenticateMiddleware,
  complianceMiddleware('PROVISION', ['RESIDENCY', 'SANCTIONS']),
  async (req, res) => {
    // Compliance is automatically checked by middleware
    const resource = await resourceService.create(req.body);
    res.json(resource);
  }
);
*/
