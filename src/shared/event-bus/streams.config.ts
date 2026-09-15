// ═══════════════════════════════════════════════════════════
// STREAMS CONFIGURATION
// Define durable streams for each bounded context
// ═══════════════════════════════════════════════════════════

import { RetentionPolicy, StorageType, DeliverPolicy, AckPolicy, ReplayPolicy } from 'nats';

export const STREAMS = {
  ORDERING: 'ORDERS_EVENTS',
  PROVISIONING: 'PROVISIONING_EVENTS',
  COMPLIANCE: 'COMPLIANCE_EVENTS',
  OPS: 'OPS_AUDIT_EVENTS',
  INVENTORY: 'INVENTORY_EVENTS',
  IDENTITY: 'IDENTITY_EVENTS',
  DLQ: 'DEAD_LETTER_QUEUE'
} as const;

export const CONSUMERS = {
  PROVISIONING_WORKER: 'provisioning-worker-group',
  COMPLIANCE_AUDITOR: 'compliance-auditor-group',
  INVENTORY_SYNC: 'inventory-sync-group',
  OPS_AUDIT: 'ops-audit-group',
  ADMIN_NOTIFICATION: 'admin-notification-group',
  DLQ_MONITOR: 'dlq-monitor-group'
} as const;

export const SUBJECTS = {
  // Ordering Context
  ORDER_CREATED: 'order.created',
  ORDER_PAID: 'order.paid',
  ORDER_CANCELLED: 'order.cancelled',
  PAYMENT_RECEIVED: 'payment.received',
  PAYMENT_FAILED: 'payment.failed',
  
  // Provisioning Context
  RESOURCE_PROVISIONED: 'resource.provisioned',
  RESOURCE_FAILED: 'resource.failed',
  RESOURCE_DELETED: 'resource.deleted',
  RESOURCE_STARTED: 'resource.started',
  RESOURCE_STOPPED: 'resource.stopped',
  MIGRATION_STARTED: 'migration.started',
  MIGRATION_COMPLETED: 'migration.completed',
  
  // Compliance Context
  COMPLIANCE_CHECKED: 'compliance.checked',
  COMPLIANCE_VIOLATION: 'compliance.violation.detected',
  COMPLIANCE_RULE_UPDATED: 'compliance.rule.updated',
  
  // Identity Context
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  USER_DELETED: 'user.deleted',
  ROLE_ASSIGNED: 'role.assigned',
  
  // Inventory Context
  INVENTORY_UPDATED: 'inventory.updated',
  INVENTORY_SYNC_COMPLETED: 'inventory.sync.completed',
  
  // Ops Context
  AUDIT_LOG_CREATED: 'audit.log.created',
  WORKFLOW_STARTED: 'workflow.started',
  WORKFLOW_COMPLETED: 'workflow.completed',
  
  // DLQ
  DLQ_MESSAGE: 'dlq.message'
} as const;

export interface StreamConfig {
  name: string;
  subjects: string[];
  retention: RetentionPolicy;
  maxAge: number; // nanoseconds
  storage: StorageType;
  replicas: number;
  duplicateWindow: number; // nanoseconds
  maxMsgs: number;
  maxBytes: number;
}

export const STREAM_CONFIGS: StreamConfig[] = [
  {
    name: STREAMS.ORDERING,
    subjects: ['order.>', 'payment.>'],
    retention: RetentionPolicy.Limits,
    maxAge: 7 * 24 * 60 * 60 * 1_000_000_000, // 7 days in nanoseconds
    storage: StorageType.File,
    replicas: 3,
    duplicateWindow: 2 * 60 * 1_000_000_000, // 2 minutes
    maxMsgs: -1,
    maxBytes: -1
  },
  {
    name: STREAMS.PROVISIONING,
    subjects: ['resource.>', 'migration.>'],
    retention: RetentionPolicy.Limits,
    maxAge: 7 * 24 * 60 * 60 * 1_000_000_000,
    storage: StorageType.File,
    replicas: 3,
    duplicateWindow: 2 * 60 * 1_000_000_000,
    maxMsgs: -1,
    maxBytes: -1
  },
  {
    name: STREAMS.COMPLIANCE,
    subjects: ['compliance.>'],
    retention: RetentionPolicy.Limits,
    maxAge: 30 * 24 * 60 * 60 * 1_000_000_000, // 30 days
    storage: StorageType.File,
    replicas: 3,
    duplicateWindow: 2 * 60 * 1_000_000_000,
    maxMsgs: -1,
    maxBytes: -1
  },
  {
    name: STREAMS.OPS,
    subjects: ['audit.>', 'workflow.>'],
    retention: RetentionPolicy.Limits,
    maxAge: 90 * 24 * 60 * 60 * 1_000_000_000, // 90 days
    storage: StorageType.File,
    replicas: 3,
    duplicateWindow: 2 * 60 * 1_000_000_000,
    maxMsgs: -1,
    maxBytes: -1
  },
  {
    name: STREAMS.INVENTORY,
    subjects: ['inventory.>'],
    retention: RetentionPolicy.Limits,
    maxAge: 7 * 24 * 60 * 60 * 1_000_000_000,
    storage: StorageType.File,
    replicas: 3,
    duplicateWindow: 2 * 60 * 1_000_000_000,
    maxMsgs: -1,
    maxBytes: -1
  },
  {
    name: STREAMS.IDENTITY,
    subjects: ['user.>', 'role.>'],
    retention: RetentionPolicy.Limits,
    maxAge: 7 * 24 * 60 * 60 * 1_000_000_000,
    storage: StorageType.File,
    replicas: 3,
    duplicateWindow: 2 * 60 * 1_000_000_000,
    maxMsgs: -1,
    maxBytes: -1
  },
  {
    name: STREAMS.DLQ,
    subjects: ['dlq.>'],
    retention: RetentionPolicy.Limits,
    maxAge: 30 * 24 * 60 * 60 * 1_000_000_000, // 30 days
    storage: StorageType.File,
    replicas: 3,
    duplicateWindow: 2 * 60 * 1_000_000_000,
    maxMsgs: -1,
    maxBytes: -1
  }
];

export interface ConsumerConfig {
  name: string;
  stream: string;
  filterSubject?: string;
  deliverPolicy: DeliverPolicy;
  ackPolicy: AckPolicy;
  ackWait: number; // nanoseconds
  maxDeliver: number;
  maxAckPending: number;
  replayPolicy: ReplayPolicy;
}

export const CONSUMER_CONFIGS: ConsumerConfig[] = [
  {
    name: CONSUMERS.PROVISIONING_WORKER,
    stream: STREAMS.ORDERING,
    filterSubject: 'payment.received',
    deliverPolicy: DeliverPolicy.All,
    ackPolicy: AckPolicy.Explicit,
    ackWait: 30 * 1_000_000_000, // 30 seconds
    maxDeliver: 5,
    maxAckPending: 100,
    replayPolicy: ReplayPolicy.Instant
  },
  {
    name: CONSUMERS.COMPLIANCE_AUDITOR,
    stream: STREAMS.PROVISIONING,
    filterSubject: 'resource.provisioned',
    deliverPolicy: DeliverPolicy.All,
    ackPolicy: AckPolicy.Explicit,
    ackWait: 30 * 1_000_000_000,
    maxDeliver: 5,
    maxAckPending: 100,
    replayPolicy: ReplayPolicy.Instant
  },
  {
    name: CONSUMERS.INVENTORY_SYNC,
    stream: STREAMS.PROVISIONING,
    filterSubject: 'resource.>',
    deliverPolicy: DeliverPolicy.All,
    ackPolicy: AckPolicy.Explicit,
    ackWait: 30 * 1_000_000_000,
    maxDeliver: 5,
    maxAckPending: 100,
    replayPolicy: ReplayPolicy.Instant
  },
  {
    name: CONSUMERS.OPS_AUDIT,
    stream: STREAMS.OPS,
    filterSubject: 'audit.>',
    deliverPolicy: DeliverPolicy.All,
    ackPolicy: AckPolicy.Explicit,
    ackWait: 30 * 1_000_000_000,
    maxDeliver: 5,
    maxAckPending: 1000, // Higher for audit
    replayPolicy: ReplayPolicy.Instant
  },
  {
    name: CONSUMERS.ADMIN_NOTIFICATION,
    stream: STREAMS.COMPLIANCE,
    filterSubject: 'compliance.violation.>',
    deliverPolicy: DeliverPolicy.New,
    ackPolicy: AckPolicy.Explicit,
    ackWait: 30 * 1_000_000_000,
    maxDeliver: 3,
    maxAckPending: 50,
    replayPolicy: ReplayPolicy.Instant
  },
  {
    name: CONSUMERS.DLQ_MONITOR,
    stream: STREAMS.DLQ,
    deliverPolicy: DeliverPolicy.All,
    ackPolicy: AckPolicy.Explicit,
    ackWait: 60 * 1_000_000_000, // 60 seconds
    maxDeliver: 1,
    maxAckPending: 10,
    replayPolicy: ReplayPolicy.Instant
  }
];
