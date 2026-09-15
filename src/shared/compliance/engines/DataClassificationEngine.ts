// ═══════════════════════════════════════════════════════════
// ENGINE 4: Data Classification Engine
// Tags and protects data based on sensitivity
// ═══════════════════════════════════════════════════════════

import { 
  IComplianceEngine, 
  ComplianceContext, 
  PolicyResult, 
  EngineType,
  ComplianceRule,
  ClassificationRuleConfig,
  Classification,
  EncryptionLevel,
  ResourceComplianceTag
} from '../types';

export class DataClassificationEngine implements IComplianceEngine {
  type: EngineType = 'CLASSIFICATION';
  private rules: ComplianceRule[] = [];
  private config: ClassificationRuleConfig = {
    piiFields: ['email', 'phone', 'national_id', 'passport', 'credit_card'],
    financialFields: ['bank_account', 'transaction', 'balance', 'invoice'],
    encryptionRequirements: {
      'PII': 'AES256',
      'FINANCIAL': 'AES256',
      'CONFIDENTIAL': 'AES128',
      'LOGS': 'NONE',
      'PUBLIC': 'NONE'
    },
    retentionPolicies: {
      'PII': 365,
      'FINANCIAL': 2555, // 7 years
      'LOGS': 90,
      'PUBLIC': 30,
      'CONFIDENTIAL': 180
    }
  };

  constructor() {
    this.loadDefaultRules();
  }

  private loadDefaultRules() {
    this.rules = [
      {
        id: 'classification-001',
        engineType: 'CLASSIFICATION',
        config: {
          autoClassify: true,
          requireEncryption: true
        },
        priority: 80,
        isActive: true,
        updatedAt: new Date()
      }
    ];
  }

  async evaluate(context: ComplianceContext): Promise<PolicyResult> {
    const { resource } = context;

    if (!resource) {
      return {
        decision: 'ALLOW',
        engine: this.type,
        reason: 'No resource to classify',
        timestamp: new Date()
      };
    }

    // Classify data based on fields
    const classification = this.classifyData(resource.dataFields || [], resource.dataType);
    const encryptionLevel = this.config.encryptionRequirements[classification];
    const retentionDays = this.config.retentionPolicies[classification];

    // Check if encryption is required but not specified
    if (encryptionLevel !== 'NONE' && !resource.sensitivityLevel) {
      return {
        decision: 'WARN',
        engine: this.type,
        reason: `Data classified as '${classification}' requires ${encryptionLevel} encryption`,
        warnings: [
          `Data contains ${classification} information`,
          `Encryption level ${encryptionLevel} recommended`,
          `Retention policy: ${retentionDays} days`
        ],
        metadata: {
          classification,
          encryptionLevel,
          retentionDays,
          detectedFields: this.detectSensitiveFields(resource.dataFields || [])
        },
        timestamp: new Date()
      };
    }

    return {
      decision: 'ALLOW',
      engine: this.type,
      reason: `Data classified as '${classification}'`,
      metadata: {
        classification,
        encryptionLevel,
        retentionDays,
        tags: this.generateTags(classification, encryptionLevel, retentionDays, resource.location)
      },
      timestamp: new Date()
    };
  }

  private classifyData(dataFields: string[], dataType?: string): Classification {
    // Check for PII
    const hasPII = dataFields.some(field => 
      this.config.piiFields.some(pii => field.toLowerCase().includes(pii))
    );
    if (hasPII) return 'PII';

    // Check for Financial
    const hasFinancial = dataFields.some(field => 
      this.config.financialFields.some(fin => field.toLowerCase().includes(fin))
    );
    if (hasFinancial) return 'FINANCIAL';

    // Check data type
    if (dataType?.toLowerCase().includes('log')) return 'LOGS';
    if (dataType?.toLowerCase().includes('public')) return 'PUBLIC';

    // Default to CONFIDENTIAL
    return 'CONFIDENTIAL';
  }

  private detectSensitiveFields(dataFields: string[]): string[] {
    return dataFields.filter(field => 
      [...this.config.piiFields, ...this.config.financialFields].some(sensitive => 
        field.toLowerCase().includes(sensitive)
      )
    );
  }

  private generateTags(
    classification: Classification,
    encryptionLevel: EncryptionLevel,
    retentionDays: number,
    location?: string
  ): ResourceComplianceTag {
    return {
      resourceId: '', // Will be set by caller
      residency: (location as any) || 'GLOBAL',
      classification,
      encryptionLevel,
      retentionDays,
      isCrossBorderAllowed: classification !== 'PII' && classification !== 'FINANCIAL',
      lastChecked: new Date()
    };
  }

  reloadRules(config: Record<string, any>): void {
    if (config.piiFields) {
      this.config.piiFields = config.piiFields;
    }
    if (config.financialFields) {
      this.config.financialFields = config.financialFields;
    }
    if (config.encryptionRequirements) {
      this.config.encryptionRequirements = config.encryptionRequirements;
    }
    if (config.retentionPolicies) {
      this.config.retentionPolicies = config.retentionPolicies;
    }
    console.log('[DataClassificationEngine] Rules hot-reloaded');
  }

  getRules(): ComplianceRule[] {
    return this.rules;
  }

  // Admin can define classification rules
  updateClassificationRules(piiFields: string[], financialFields: string[]) {
    this.config.piiFields = piiFields;
    this.config.financialFields = financialFields;
    console.log('[DataClassificationEngine] Classification rules updated');
  }

  // Get tags for a resource
  getClassificationTags(resource: { dataFields?: string[], dataType?: string, location?: string }): ResourceComplianceTag {
    const classification = this.classifyData(resource.dataFields || [], resource.dataType);
    const encryptionLevel = this.config.encryptionRequirements[classification];
    const retentionDays = this.config.retentionPolicies[classification];
    
    return this.generateTags(classification, encryptionLevel, retentionDays, resource.location);
  }
}
