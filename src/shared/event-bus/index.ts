// ═══════════════════════════════════════════════════════════
// EVENT BUS - MAIN EXPORT
// Central nervous system for all async communication
// ═══════════════════════════════════════════════════════════

export { natsConnection, NatsConnectionManager } from './nats.connection';
export { eventPublisher, EventPublisher, EventBusUnavailableError } from './event.publisher';
export type { PublishOptions, EventPayload } from './event.publisher';
export { BaseEventSubscriber, ProvisioningSubscriber, ComplianceAuditorSubscriber, InventorySyncSubscriber } from './event.subscriber';
export type { EventHandler, SubscriberConfig } from './event.subscriber';
export { idempotencyGuard, IdempotencyGuard } from './idempotency.guard';
export { dlqHandler, DLQHandler } from './dlq.handler';
export type { DLQMessage } from './dlq.handler';
export { STREAMS, CONSUMERS, SUBJECTS, STREAM_CONFIGS, CONSUMER_CONFIGS } from './streams.config';
export type { StreamConfig, ConsumerConfig } from './streams.config';

// ═══════════════════════════════════════════════════════════
// EVENT BUS FACADE
// Simplified API for publishing and subscribing to events
// ═══════════════════════════════════════════════════════════

import { eventPublisher, PublishOptions } from './event.publisher';
import { natsConnection } from './nats.connection';

class EventBusFacade {
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    await natsConnection.connect();
    await eventPublisher.initialize();
    
    this.initialized = true;
    console.log('[EventBus] Initialized successfully');
  }

  async publish<T>(
    stream: string,
    subject: string,
    payload: T,
    options?: PublishOptions
  ): Promise<string> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    return eventPublisher.publish(stream, subject, payload, options);
  }

  async publishToOrdering<T>(subject: string, payload: T, options?: PublishOptions): Promise<string> {
    return this.publish('ORDERS_EVENTS', subject, payload, options);
  }

  async publishToProvisioning<T>(subject: string, payload: T, options?: PublishOptions): Promise<string> {
    return this.publish('PROVISIONING_EVENTS', subject, payload, options);
  }

  async publishToCompliance<T>(subject: string, payload: T, options?: PublishOptions): Promise<string> {
    return this.publish('COMPLIANCE_EVENTS', subject, payload, options);
  }

  async publishToOps<T>(subject: string, payload: T, options?: PublishOptions): Promise<string> {
    return this.publish('OPS_AUDIT_EVENTS', subject, payload, options);
  }

  async publishToInventory<T>(subject: string, payload: T, options?: PublishOptions): Promise<string> {
    return this.publish('INVENTORY_EVENTS', subject, payload, options);
  }

  async publishToIdentity<T>(subject: string, payload: T, options?: PublishOptions): Promise<string> {
    return this.publish('IDENTITY_EVENTS', subject, payload, options);
  }

  async healthCheck(): Promise<{ healthy: boolean; latency?: number; error?: string }> {
    return natsConnection.checkHealth();
  }

  async shutdown(): Promise<void> {
    await natsConnection.disconnect();
    this.initialized = false;
    console.log('[EventBus] Shutdown complete');
  }
}

export const eventBus = new EventBusFacade();
