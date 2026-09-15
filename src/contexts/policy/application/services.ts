// ═══════════════════════════════════════════════════════════
// POLICY CONTEXT - Application Layer
// Policy Engine & Services
// ═══════════════════════════════════════════════════════════

import { Policy, Quota, PolicyEvaluationResult, QuotaCheckResult } from '../domain/entities';
import { IPolicyRepository, IQuotaRepository } from '../infrastructure/repositories';
import { eventBus, POLICY_EVENTS } from '../../../shared/events/EventBus';

// ═══════════════════════════════════════════════════════════
// POLICY ENGINE
// ═══════════════════════════════════════════════════════════

export class PolicyEngine {
  constructor(private policyRepo: IPolicyRepository) {}

  async evaluate(
    action: string,
    subject: { userId: string; tenantId: string; role: string },
    resource: { type: string; id?: string; data?: any }
  ): Promise<PolicyEvaluationResult> {
    // Fetch all active policies
    const policies = await this.policyRepo.findActive();

    // Sort by priority (higher priority first)
    policies.sort((a, b) => b.priority - a.priority);

    // Evaluate each policy
    for (const policy of policies) {
      const matches = this.evaluateCondition(policy.condition, {
        action,
        subject,
        resource,
      });

      if (matches) {
        if (policy.action === 'deny') {
          eventBus.publish(
            POLICY_EVENTS.POLICY_VIOLATED,
            { policyId: policy.id, action, subject, resource },
            'policy'
          );

          return {
            allowed: false,
            policyId: policy.id,
            reason: `Denied by policy: ${policy.name}`,
          };
        }

        if (policy.action === 'warn') {
          return {
            allowed: true,
            policyId: policy.id,
            warnings: [`Warning: ${policy.name}`],
          };
        }
      }
    }

    return { allowed: true };
  }

  private evaluateCondition(
    condition: any,
    context: { action: string; subject: any; resource: any }
  ): boolean {
    // Simple condition evaluation
    // In production, use a proper expression evaluator like OPA
    const { resource, operator, value } = condition;
    
    const actualValue = this.getNestedValue(context, resource);
    
    switch (operator) {
      case 'eq':
        return actualValue === value;
      case 'ne':
        return actualValue !== value;
      case 'gt':
        return actualValue > value;
      case 'lt':
        return actualValue < value;
      case 'gte':
        return actualValue >= value;
      case 'lte':
        return actualValue <= value;
      default:
        return false;
    }
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
}

// ═══════════════════════════════════════════════════════════
// QUOTA SERVICE
// ═══════════════════════════════════════════════════════════

export class QuotaService {
  constructor(private quotaRepo: IQuotaRepository) {}

  async checkQuota(
    tenantId: string,
    resourceType: string,
    requestedAmount: number
  ): Promise<QuotaCheckResult> {
    const quota = await this.quotaRepo.findByTenantAndType(tenantId, resourceType);
    
    if (!quota) {
      // No quota defined, allow
      return {
        withinLimit: true,
        currentUsage: 0,
        limit: Infinity,
        percentage: 0,
        warningTriggered: false,
      };
    }

    const newUsage = quota.used + requestedAmount;
    const percentage = (newUsage / quota.limit) * 100;
    const warningTriggered = percentage >= quota.warningThreshold;

    if (newUsage > quota.limit) {
      eventBus.publish(
        POLICY_EVENTS.QUOTA_EXCEEDED,
        { tenantId, resourceType, limit: quota.limit, requested: newUsage },
        'policy'
      );

      return {
        withinLimit: false,
        currentUsage: quota.used,
        limit: quota.limit,
        percentage,
        warningTriggered: true,
      };
    }

    if (warningTriggered) {
      eventBus.publish(
        POLICY_EVENTS.QUOTA_WARNING,
        { tenantId, resourceType, usage: newUsage, limit: quota.limit },
        'policy'
      );
    }

    return {
      withinLimit: true,
      currentUsage: newUsage,
      limit: quota.limit,
      percentage,
      warningTriggered,
    };
  }

  async updateUsage(
    tenantId: string,
    resourceType: string,
    delta: number
  ): Promise<void> {
    const quota = await this.quotaRepo.findByTenantAndType(tenantId, resourceType);
    if (!quota) return;

    await this.quotaRepo.update(quota.id, {
      used: quota.used + delta,
      updatedAt: new Date(),
    });
  }
}

// ═══════════════════════════════════════════════════════════
// POLICY MIDDLEWARE
// ═══════════════════════════════════════════════════════════

export function EnforcePolicy(resource: string, action: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const policyEngine = new PolicyEngine({} as any); // Should be injected
      
      const result = await policyEngine.evaluate(
        action,
        { userId: args[0]?.userId, tenantId: args[0]?.tenantId, role: 'customer' },
        { type: resource, data: args[0] }
      );

      if (!result.allowed) {
        throw new PolicyViolationError(result.reason || 'Policy violation');
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

export class PolicyViolationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PolicyViolationError';
  }
}
