// ═══════════════════════════════════════════════════════════
// ENGINE 3: Sanctions & Export Control Policy Engine
// Blocks sanctioned entities/regions
// ═══════════════════════════════════════════════════════════

import { 
  IComplianceEngine, 
  ComplianceContext, 
  PolicyResult, 
  EngineType,
  ComplianceRule,
  SanctionsRuleConfig 
} from '../types';

export class SanctionsExportControlEngine implements IComplianceEngine {
  type: EngineType = 'SANCTIONS';
  private rules: ComplianceRule[] = [];
  private config: SanctionsRuleConfig = {
    blockedEntities: [],
    blockedCountries: ['KP', 'SY', 'CU'], // North Korea, Syria, Cuba
    blockedIPs: []
  };

  constructor() {
    this.loadDefaultRules();
  }

  private loadDefaultRules() {
    this.rules = [
      {
        id: 'sanctions-001',
        engineType: 'SANCTIONS',
        config: {
          checkBillingAddress: true,
          checkIPAddress: true,
          checkCompanyName: true
        },
        priority: 100,
        isActive: true,
        updatedAt: new Date()
      }
    ];
  }

  async evaluate(context: ComplianceContext): Promise<PolicyResult> {
    const { user } = context;

    // Check billing address country
    if (user.billingAddress?.country) {
      const countryCode = this.getCountryCode(user.billingAddress.country);
      
      if (this.config.blockedCountries.includes(countryCode)) {
        return {
          decision: 'DENY',
          engine: this.type,
          reason: `Sanctions violation: Billing address country '${user.billingAddress.country}' (${countryCode}) is sanctioned`,
          metadata: {
            violationType: 'SANCTIONED_COUNTRY',
            country: user.billingAddress.country,
            countryCode
          },
          timestamp: new Date()
        };
      }
    }

    // Check IP address
    if (user.ipAddress) {
      if (this.config.blockedIPs.includes(user.ipAddress)) {
        return {
          decision: 'DENY',
          engine: this.type,
          reason: `Sanctions violation: IP address '${user.ipAddress}' is blocked`,
          metadata: {
            violationType: 'BLOCKED_IP',
            ipAddress: user.ipAddress
          },
          timestamp: new Date()
        };
      }
    }

    // Check company name against blocked entities
    if (user.billingAddress?.city) {
      const companyName = user.billingAddress.city.toLowerCase();
      const matchedEntity = this.config.blockedEntities.find(entity => 
        companyName.includes(entity.toLowerCase())
      );

      if (matchedEntity) {
        return {
          decision: 'DENY',
          engine: this.type,
          reason: `Sanctions violation: Entity name matches sanctioned entity '${matchedEntity}'`,
          metadata: {
            violationType: 'SANCTIONED_ENTITY',
            matchedEntity
          },
          timestamp: new Date()
        };
      }
    }

    return {
      decision: 'ALLOW',
      engine: this.type,
      reason: 'No sanctions violations detected',
      timestamp: new Date()
    };
  }

  private getCountryCode(countryName: string): string {
    // Simplified country code mapping
    const mapping: Record<string, string> = {
      'iran': 'IR',
      'north korea': 'KP',
      'syria': 'SY',
      'cuba': 'CU',
      'russia': 'RU',
      'usa': 'US',
      'united states': 'US',
      'germany': 'DE',
      'france': 'FR'
    };
    return mapping[countryName.toLowerCase()] || countryName.toUpperCase().slice(0, 2);
  }

  reloadRules(config: Record<string, any>): void {
    if (config.blockedEntities) {
      this.config.blockedEntities = config.blockedEntities;
    }
    if (config.blockedCountries) {
      this.config.blockedCountries = config.blockedCountries;
    }
    if (config.blockedIPs) {
      this.config.blockedIPs = config.blockedIPs;
    }
    console.log('[SanctionsExportControlEngine] Rules hot-reloaded');
  }

  getRules(): ComplianceRule[] {
    return this.rules;
  }

  // Admin can upload sanctions list
  updateSanctionsList(entities: string[], countries: string[], ips: string[]) {
    this.config.blockedEntities = entities;
    this.config.blockedCountries = countries;
    this.config.blockedIPs = ips;
    console.log('[SanctionsExportControlEngine] Sanctions list updated');
  }

  // Add single entity to blocklist
  addToBlocklist(type: 'entity' | 'country' | 'ip', value: string) {
    switch (type) {
      case 'entity':
        this.config.blockedEntities.push(value);
        break;
      case 'country':
        this.config.blockedCountries.push(value);
        break;
      case 'ip':
        this.config.blockedIPs.push(value);
        break;
    }
    console.log(`[SanctionsExportControlEngine] Added to blocklist: ${type} = ${value}`);
  }
}
