// ═══════════════════════════════════════════════════════════
// ENGINE 2: Cross-Border Transfer Control
// Restricts data movement between jurisdictions
// ═══════════════════════════════════════════════════════════

import { 
  IComplianceEngine, 
  ComplianceContext, 
  PolicyResult, 
  EngineType,
  ComplianceRule 
} from '../types';

export class CrossBorderTransferEngine implements IComplianceEngine {
  type: EngineType = 'CROSS_BORDER';
  private rules: ComplianceRule[] = [];

  constructor() {
    this.loadDefaultRules();
  }

  private loadDefaultRules() {
    this.rules = [
      {
        id: 'cross-border-001',
        engineType: 'CROSS_BORDER',
        config: {
          sourceRegion: 'IR',
          destinationRegion: 'EU',
          requiresApproval: true
        },
        priority: 90,
        isActive: true,
        updatedAt: new Date()
      },
      {
        id: 'cross-border-002',
        engineType: 'CROSS_BORDER',
        config: {
          sourceRegion: 'EU',
          destinationRegion: 'US',
          requiresApproval: true
        },
        priority: 90,
        isActive: true,
        updatedAt: new Date()
      }
    ];
  }

  async evaluate(context: ComplianceContext): Promise<PolicyResult> {
    const { migration } = context;

    if (!migration) {
      return {
        decision: 'ALLOW',
        engine: this.type,
        reason: 'No migration context provided',
        timestamp: new Date()
      };
    }

    const { sourceLocation, destinationLocation, approvalFlag } = migration;

    // Check if this is a cross-border transfer
    if (sourceLocation === destinationLocation) {
      return {
        decision: 'ALLOW',
        engine: this.type,
        reason: 'Same region transfer - no cross-border restrictions',
        timestamp: new Date()
      };
    }

    // Find applicable rule
    const applicableRule = this.rules.find(rule => 
      rule.isActive &&
      rule.config.sourceRegion === sourceLocation &&
      rule.config.destinationRegion === destinationLocation
    );

    if (applicableRule && applicableRule.config.requiresApproval) {
      if (!approvalFlag) {
        return {
          decision: 'DENY',
          engine: this.type,
          reason: `Cross-border transfer from '${sourceLocation}' to '${destinationLocation}' requires approval. Set approvalFlag=true to proceed.`,
          warnings: [
            'This transfer crosses jurisdictional boundaries',
            'Data protection regulations may apply',
            'Administrative approval required'
          ],
          metadata: {
            source: sourceLocation,
            destination: destinationLocation,
            requiresApproval: true
          },
          timestamp: new Date()
        };
      }
    }

    // Check for high-risk transfers
    const highRiskPairs = [
      { from: 'IR', to: 'US' },
      { from: 'EU', to: 'IR' }
    ];

    const isHighRisk = highRiskPairs.some(pair => 
      pair.from === sourceLocation && pair.to === destinationLocation
    );

    if (isHighRisk) {
      return {
        decision: 'WARN',
        engine: this.type,
        reason: 'High-risk cross-border transfer detected',
        warnings: [
          'This transfer involves high-risk jurisdictions',
          'Additional monitoring will be applied',
          'Audit trail will be enhanced'
        ],
        metadata: {
          source: sourceLocation,
          destination: destinationLocation,
          riskLevel: 'HIGH'
        },
        timestamp: new Date()
      };
    }

    return {
      decision: 'ALLOW',
      engine: this.type,
      reason: 'Cross-border transfer approved',
      metadata: {
        source: sourceLocation,
        destination: destinationLocation
      },
      timestamp: new Date()
    };
  }

  reloadRules(config: Record<string, any>): void {
    console.log('[CrossBorderTransferEngine] Rules hot-reloaded');
  }

  getRules(): ComplianceRule[] {
    return this.rules;
  }

  // Admin can add new cross-border rules
  addCrossBorderRule(source: string, destination: string, requiresApproval: boolean) {
    this.rules.push({
      id: `cross-border-${Date.now()}`,
      engineType: 'CROSS_BORDER',
      config: {
        sourceRegion: source,
        destinationRegion: destination,
        requiresApproval
      },
      priority: 90,
      isActive: true,
      updatedAt: new Date()
    });
    console.log(`[CrossBorderTransferEngine] New rule added: ${source} -> ${destination}`);
  }
}
