// ═══════════════════════════════════════════════════════════
// ABRAN SYSTEM - Event Bus (DDD Event-Driven Communication)
// ═══════════════════════════════════════════════════════════

type EventHandler = (payload: any) => void;

interface EventSubscription {
  eventType: string;
  handler: EventHandler;
  context: string;
}

class EventBus {
  private subscribers: Map<string, EventSubscription[]> = new Map();
  private eventHistory: Array<{
    eventType: string;
    payload: any;
    timestamp: Date;
    sourceContext: string;
  }> = [];

  // Subscribe to an event
  subscribe(eventType: string, context: string, handler: EventHandler): () => void {
    const subscription: EventSubscription = { eventType, handler, context };
    
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }
    this.subscribers.get(eventType)!.push(subscription);

    // Return unsubscribe function
    return () => {
      const subs = this.subscribers.get(eventType);
      if (subs) {
        const index = subs.indexOf(subscription);
        if (index > -1) subs.splice(index, 1);
      }
    };
  }

  // Publish an event
  publish(eventType: string, payload: any, sourceContext: string): void {
    // Log event
    this.eventHistory.push({
      eventType,
      payload,
      timestamp: new Date(),
      sourceContext,
    });

    // Keep only last 100 events
    if (this.eventHistory.length > 100) {
      this.eventHistory.shift();
    }

    // Notify subscribers
    const subs = this.subscribers.get(eventType);
    if (subs) {
      subs.forEach(sub => {
        try {
          sub.handler(payload);
        } catch (error) {
          console.error(`[EventBus] Error in handler for ${eventType}:`, error);
        }
      });
    }
  }

  // Get event history
  getHistory(): typeof this.eventHistory {
    return [...this.eventHistory];
  }

  // Get subscriber count
  getSubscriberCount(eventType?: string): number {
    if (eventType) {
      return this.subscribers.get(eventType)?.length || 0;
    }
    let total = 0;
    this.subscribers.forEach(subs => { total += subs.length; });
    return total;
  }
}

// Singleton instance
export const eventBus = new EventBus();

// ═══════════════════════════════════════════════════════════
// Event Type Definitions
// ═══════════════════════════════════════════════════════════

// Identity Context Events
export const IDENTITY_EVENTS = {
  USER_CREATED: 'identity.user.created',
  USER_UPDATED: 'identity.user.updated',
  USER_DELETED: 'identity.user.deleted',
  ROLE_ASSIGNED: 'identity.role.assigned',
  MFA_ENABLED: 'identity.mfa.enabled',
  API_KEY_CREATED: 'identity.apikey.created',
  API_KEY_REVOKED: 'identity.apikey.revoked',
  LOGIN_SUCCESS: 'identity.auth.login_success',
  LOGIN_FAILED: 'identity.auth.login_failed',
} as const;

// Ordering Context Events
export const ORDERING_EVENTS = {
  ORDER_CREATED: 'ordering.order.created',
  ORDER_PAID: 'ordering.order.paid',
  ORDER_CANCELLED: 'ordering.order.cancelled',
  ORDER_COMPLETED: 'ordering.order.completed',
  CART_UPDATED: 'ordering.cart.updated',
  PAYMENT_RECEIVED: 'ordering.payment.received',
  PAYMENT_FAILED: 'ordering.payment.failed',
  COUPON_APPLIED: 'ordering.coupon.applied',
} as const;

// Provisioning Context Events
export const PROVISIONING_EVENTS = {
  RESOURCE_PROVISIONING_STARTED: 'provisioning.resource.starting',
  RESOURCE_PROVISIONED: 'provisioning.resource.provisioned',
  RESOURCE_FAILED: 'provisioning.resource.failed',
  RESOURCE_DELETED: 'provisioning.resource.deleted',
  RESOURCE_SUSPENDED: 'provisioning.resource.suspended',
  RESOURCE_RESUMED: 'provisioning.resource.resumed',
  MIGRATION_STARTED: 'provisioning.migration.started',
  MIGRATION_COMPLETED: 'provisioning.migration.completed',
} as const;

// Platform Ops Context Events
export const OPS_EVENTS = {
  WORKFLOW_STARTED: 'ops.workflow.started',
  WORKFLOW_COMPLETED: 'ops.workflow.completed',
  WORKFLOW_FAILED: 'ops.workflow.failed',
  HEALTH_CHECK_PASSED: 'ops.health.passed',
  HEALTH_CHECK_FAILED: 'ops.health.failed',
  NOTIFICATION_SENT: 'ops.notification.sent',
  SCHEDULED_TASK_EXECUTED: 'ops.scheduler.executed',
  AUDIT_LOG_CREATED: 'ops.audit.created',
} as const;

// Policy Context Events
export const POLICY_EVENTS = {
  POLICY_EVALUATED: 'policy.evaluated',
  POLICY_VIOLATED: 'policy.violated',
  QUOTA_EXCEEDED: 'policy.quota.exceeded',
  QUOTA_WARNING: 'policy.quota.warning',
  RATE_LIMIT_HIT: 'policy.ratelimit.hit',
  COMPLIANCE_FLAG: 'policy.compliance.flagged',
} as const;

// Config Context Events
export const CONFIG_EVENTS = {
  TEMPLATE_CREATED: 'config.template.created',
  TEMPLATE_UPDATED: 'config.template.updated',
  IMAGE_CREATED: 'config.image.created',
  SSH_KEY_ADDED: 'config.sshkey.added',
  SSH_KEY_REMOVED: 'config.sshkey.removed',
  CONFIG_UPDATED: 'config.parameter.updated',
} as const;

// Inventory Context Events
export const INVENTORY_EVENTS = {
  ITEM_ADDED: 'inventory.item.added',
  ITEM_UPDATED: 'inventory.item.updated',
  ITEM_REMOVED: 'inventory.item.removed',
  TOPOLOGY_UPDATED: 'inventory.topology.updated',
  SYNC_COMPLETED: 'inventory.sync.completed',
  DRIFT_DETECTED: 'inventory.drift.detected',
} as const;
