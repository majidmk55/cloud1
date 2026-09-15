// ═══════════════════════════════════════════════════════════
// ENGINE 5: Tenant Data Placement Policy
// Enforces isolation levels for enterprise tenants
// ═══════════════════════════════════════════════════════════

import { 
  IComplianceEngine, 
  ComplianceContext, 
  PolicyResult, 
  EngineType,
  ComplianceRule,
  PlanType
} from '../types';

export class TenantDataPlacementEngine implements IComplianceEngine {
  type: EngineType = 'TENANT_PLACEMENT';
  private rules: ComplianceRule[] = [];

  constructor() {
    this.loadDefaultRules();
  }

  private loadDefaultRules() {
    this.rules = [
      {
        id: 'placement-001',
        engineType: 'TENANT_PLACEMENT',
        config: {
          planType: 'DEDICATED',
          allowedResourceTypes: ['DEDICATED_SERVER', 'PRIVATE_CLOUD'],
          deniedResourceTypes: ['SHARED_VPS', 'PUBLIC_CLOUD']
        },
        priority: 95,
        isActive: true,
        updatedAt: new Date()
      },
      {
        id: 'placement-002',
        engineType: 'TENANT_PLACEMENT',
        config: {
          planType: 'ENTERPRISE',
          allowedResourceTypes: ['DEDICATED_SERVER', 'PRIVATE_CLOUD', 'SHARED_VPS'],
          deniedResourceTypes: ['PUBLIC_CLOUD']
        },
        priority: 90,
        isActive: true,
        updatedAt: new Date()
      },
      {
        id: 'placement-003',
        engineType: 'TENANT_PLACEMENT',
        config: {
          planType: 'BUSINESS',
          allowedResourceTypes: ['SHARED_VPS', 'PUBLIC_CLOUD'],
          deniedResourceTypes: ['DEDICATED_SERVER']
        },
        priority: 85,
        isActive: true,
        updatedAt: new Date()
      }
    ];
  }

  async evaluate(context: ComplianceContext): Promise<PolicyResult> {
    const { tenant, resource } = context;

    if (!resource || !resource.type) {
      return {
        decision: 'ALLOW',
        engine: this.type,
        reason: 'No resource type specified',
        timestamp: new Date()
      };
    }

    // Find applicable rule based on tenant plan
    const applicableRule = this.rules.find(rule => 
      rule.isActive && 
      rule.config.planType === tenant.planType
    );

    if (!applicableRule) {
      return {
        decision: 'ALLOW',
        engine: this.type,
        reason: `No placement rules for plan type '${tenant.planType}'`,
        timestamp: new Date()
      };
    }

    const { allowedResourceTypes, deniedResourceTypes } = applicableRule.config;

    // Check if resource type is explicitly denied
    if (deniedResourceTypes.includes(resource.type)) {
      return {
        decision: 'DENY',
        engine: this.type,
        reason: `Tenant plan '${tenant.planType}' does not allow resource type '${resource.type}'. Denied types: ${deniedResourceTypes.join(', ')}`,
        metadata: {
          planType: tenant.planType,
          resourceType: resource.type,
          allowedTypes: allowedResourceTypes,
          deniedTypes: deniedResourceTypes
        },
        timestamp: new Date()
      };
    }

    // Check if resource type is in allowed list
    if (!allowedResourceTypes.includes(resource.type)) {
      return {
        decision: 'DENY',
        engine: this.type,
        reason: `Resource type '${resource.type}' is not in the allowed list for plan '${tenant.planType}'. Allowed: ${allowedResourceTypes.join(', ')}`,
        metadata: {
          planType: tenant.planType,
          resourceType: resource.type,
          allowedTypes: allowedResourceTypes
        },
        timestamp: new Date()
      };
    }

    // Additional checks for enterprise tenants
    if (tenant.planType === 'DEDICATED' || tenant.planType === 'ENTERPRISE') {
      // Ensure dedicated infrastructure
      if (resource.type === 'SHARED_VPS' && tenant.planType === 'DEDICATED') {
        return {
          decision: 'DENY',
          engine: this.type,
          reason: 'Dedicated plan tenants must use dedicated infrastructure only',
          metadata: {
            planType: tenant.planType,
            resourceType: resource.type,
            requirement: 'DEDICATED_INFRASTRUCTURE'
          },
          timestamp: new Date()
        };
      }
    }

    return {
      decision: 'ALLOW',
      engine: this.type,
      reason: `Resource placement compliant with tenant plan '${tenant.planType}'`,
      metadata: {
        planType: tenant.planType,
        resourceType: resource.type,
        allowedTypes: allowedResourceTypes
      },
      timestamp: new Date()
    };
  }

  reloadRules(config: Record<string, any>): void {
    console.log('[TenantDataPlacementEngine] Rules hot-reloaded');
  }

  getRules(): ComplianceRule[] {
    return this.rules;
  }

  // Admin can update placement rules for a plan type
  updatePlacementRules(planType: PlanType, allowedTypes: string[], deniedTypes: string[]) {
    const existingRule = this.rules.find(rule => rule.config.planType === planType);
    
    if (existingRule) {
      existingRule.config.allowedResourceTypes = allowedTypes;
      existingRule.config.deniedResourceTypes = deniedTypes;
      existingRule.updatedAt = new Date();
    } else {
      this.rules.push({
        id: `placement-${Date.now()}`,
        engineType: 'TENANT_PLACEMENT',
        config: {
          planType,
          allowedResourceTypes: allowedTypes,
          deniedResourceTypes: deniedTypes
        },
        priority: 85,
        isActive: true,
        updatedAt: new Date()
      });
    }
    
    console.log(`[TenantDataPlacementEngine] Placement rules updated for plan: ${planType}`);
  }

  // Get allowed resource types for a plan
  getAllowedResourceTypes(planType: PlanType): string[] {
    const rule = this.rules.find(rule => rule.config.planType === planType);
    return rule?.config.allowedResourceTypes || [];
  }
}
