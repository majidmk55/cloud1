// ═══════════════════════════════════════════════════════════
// ENGINE 1: Data Residency Policy Engine
// Enforces geographic storage constraints
// ═══════════════════════════════════════════════════════════

import { 
  IComplianceEngine, 
  ComplianceContext, 
  PolicyResult, 
  EngineType,
  ComplianceRule,
  ResidencyRuleConfig 
} from '../types';

export class DataResidencyEngine implements IComplianceEngine {
  type: EngineType = 'RESIDENCY';
  private rules: ComplianceRule[] = [];
  private config: ResidencyRuleConfig = {
    allowedRegions: ['IR', 'EU', 'US'],
    blockedCountries: [],
    exceptions: []
  };

  constructor() {
    this.loadDefaultRules();
  }

  private loadDefaultRules() {
    this.rules = [
      {
        id: 'residency-001',
        engineType: 'RESIDENCY',
        config: {
          userRegion: 'IR',
          allowedProviderLocations: ['IR', 'LOCAL-DC']
        },
        priority: 100,
        isActive: true,
        updatedAt: new Date()
      },
      {
        id: 'residency-002',
        engineType: 'RESIDENCY',
        config: {
          userRegion: 'EU',
          allowedProviderLocations: ['EU']
        },
        priority: 100,
        isActive: true,
        updatedAt: new Date()
      }
    ];
  }

  async evaluate(context: ComplianceContext): Promise<PolicyResult> {
    const { user, resource } = context;

    if (!resource || !resource.location) {
      return {
        decision: 'ALLOW',
        engine: this.type,
        reason: 'No resource location specified',
        timestamp: new Date()
      };
    }

    // Check if user region matches allowed provider locations
    const applicableRule = this.rules.find(rule => 
      rule.isActive && 
      rule.config.userRegion === user.region
    );

    if (applicableRule) {
      const allowedLocations = applicableRule.config.allowedProviderLocations;
      
      if (!allowedLocations.includes(resource.location)) {
        return {
          decision: 'DENY',
          engine: this.type,
          reason: `Data residency violation: User region '${user.region}' cannot store data in '${resource.location}'. Allowed: ${allowedLocations.join(', ')}`,
          metadata: {
            userRegion: user.region,
            requestedLocation: resource.location,
            allowedLocations
          },
          timestamp: new Date()
        };
      }
    }

    // Check if location is in blocked list
    if (this.config.blockedCountries.includes(resource.location)) {
      return {
        decision: 'DENY',
        engine: this.type,
        reason: `Location '${resource.location}' is blocked by compliance policy`,
        timestamp: new Date()
      };
    }

    return {
      decision: 'ALLOW',
      engine: this.type,
      reason: 'Data residency requirements satisfied',
      metadata: {
        userRegion: user.region,
        resourceLocation: resource.location
      },
      timestamp: new Date()
    };
  }

  reloadRules(config: Record<string, any>): void {
    if (config.allowedRegions) {
      this.config.allowedRegions = config.allowedRegions;
    }
    if (config.blockedCountries) {
      this.config.blockedCountries = config.blockedCountries;
    }
    if (config.exceptions) {
      this.config.exceptions = config.exceptions;
    }
    console.log('[DataResidencyEngine] Rules hot-reloaded');
  }

  getRules(): ComplianceRule[] {
    return this.rules;
  }

  // Admin can update allowed regions
  updateAllowedRegions(regions: string[]) {
    this.config.allowedRegions = regions as any[];
    console.log('[DataResidencyEngine] Allowed regions updated:', regions);
  }
}
