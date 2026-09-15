// ═══════════════════════════════════════════════════════════
// POLICY CONTEXT - Infrastructure Layer
// Repositories
// ═══════════════════════════════════════════════════════════

import { Policy, Quota, ComplianceRule, ComplianceFlag } from '../domain/entities';

// ═══════════════════════════════════════════════════════════
// REPOSITORY INTERFACES
// ═══════════════════════════════════════════════════════════

export interface IPolicyRepository {
  findById(id: string): Promise<Policy | null>;
  findActive(): Promise<Policy[]>;
  create(policy: Omit<Policy, 'id'>): Promise<Policy>;
  update(id: string, data: Partial<Policy>): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface IQuotaRepository {
  findById(id: string): Promise<Quota | null>;
  findByTenantAndType(tenantId: string, resourceType: string): Promise<Quota | null>;
  findByTenantId(tenantId: string): Promise<Quota[]>;
  create(quota: Omit<Quota, 'id'>): Promise<Quota>;
  update(id: string, data: Partial<Quota>): Promise<void>;
}

export interface IComplianceRepository {
  findActiveRules(): Promise<ComplianceRule[]>;
  createFlag(flag: Omit<ComplianceFlag, 'id'>): Promise<ComplianceFlag>;
  findFlagsByResource(resourceId: string): Promise<ComplianceFlag[]>;
  resolveFlag(id: string): Promise<void>;
}

// ═══════════════════════════════════════════════════════════
// REPOSITORY IMPLEMENTATIONS
// ═══════════════════════════════════════════════════════════

export class PolicyRepository implements IPolicyRepository {
  private policies: Map<string, Policy> = new Map();

  async findById(id: string): Promise<Policy | null> {
    return this.policies.get(id) || null;
  }

  async findActive(): Promise<Policy[]> {
    return Array.from(this.policies.values()).filter(p => p.isActive);
  }

  async create(policy: Omit<Policy, 'id'>): Promise<Policy> {
    const newPolicy: Policy = {
      ...policy,
      id: crypto.randomUUID(),
    };
    this.policies.set(newPolicy.id, newPolicy);
    return newPolicy;
  }

  async update(id: string, data: Partial<Policy>): Promise<void> {
    const policy = this.policies.get(id);
    if (!policy) throw new Error('Policy not found');
    this.policies.set(id, { ...policy, ...data });
  }

  async delete(id: string): Promise<void> {
    this.policies.delete(id);
  }
}

export class QuotaRepository implements IQuotaRepository {
  private quotas: Map<string, Quota> = new Map();

  async findById(id: string): Promise<Quota | null> {
    return this.quotas.get(id) || null;
  }

  async findByTenantAndType(tenantId: string, resourceType: string): Promise<Quota | null> {
    for (const quota of this.quotas.values()) {
      if (quota.tenantId === tenantId && quota.resourceType === resourceType) {
        return quota;
      }
    }
    return null;
  }

  async findByTenantId(tenantId: string): Promise<Quota[]> {
    return Array.from(this.quotas.values()).filter(q => q.tenantId === tenantId);
  }

  async create(quota: Omit<Quota, 'id'>): Promise<Quota> {
    const newQuota: Quota = {
      ...quota,
      id: crypto.randomUUID(),
    };
    this.quotas.set(newQuota.id, newQuota);
    return newQuota;
  }

  async update(id: string, data: Partial<Quota>): Promise<void> {
    const quota = this.quotas.get(id);
    if (!quota) throw new Error('Quota not found');
    this.quotas.set(id, { ...quota, ...data });
  }
}

export class ComplianceRepository implements IComplianceRepository {
  private rules: Map<string, ComplianceRule> = new Map();
  private flags: Map<string, ComplianceFlag> = new Map();

  async findActiveRules(): Promise<ComplianceRule[]> {
    return Array.from(this.rules.values()).filter(r => r.isActive);
  }

  async createFlag(flag: Omit<ComplianceFlag, 'id'>): Promise<ComplianceFlag> {
    const newFlag: ComplianceFlag = {
      ...flag,
      id: crypto.randomUUID(),
    };
    this.flags.set(newFlag.id, newFlag);
    return newFlag;
  }

  async findFlagsByResource(resourceId: string): Promise<ComplianceFlag[]> {
    return Array.from(this.flags.values()).filter(f => f.resourceId === resourceId);
  }

  async resolveFlag(id: string): Promise<void> {
    const flag = this.flags.get(id);
    if (!flag) throw new Error('Flag not found');
    this.flags.set(id, { ...flag, resolved: true, resolvedAt: new Date() });
  }
}
