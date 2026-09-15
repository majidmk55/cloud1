// ═══════════════════════════════════════════════════════════
// EVENT SUBSCRIBER
// Base class for pull-based subscribers with retry logic
// ═══════════════════════════════════════════════════════════

import { JetStreamClient, Consumer, JsMsg, StringCodec } from 'nats';
import { natsConnection } from './nats.connection';
import { IdempotencyGuard } from './idempotency.guard';
import { DLQHandler } from './dlq.handler';

export interface EventHandler<T = any> {
  (event: T, msg: JsMsg): Promise<void>;
}

export interface SubscriberConfig {
  stream: string;
  consumerName: string;
  batchSize?: number;
  expiresMs?: number;
  maxRetries?: number;
}

export abstract class BaseEventSubscriber<T = any> {
  protected js!: JetStreamClient;
  protected consumer!: Consumer;
  protected sc = StringCodec();
  protected isRunning = false;
  protected idempotencyGuard: IdempotencyGuard;
  protected dlqHandler: DLQHandler;

  constructor(
    protected config: SubscriberConfig,
    protected maxRetries: number = 5
  ) {
    this.idempotencyGuard = new IdempotencyGuard();
    this.dlqHandler = new DLQHandler();
  }

  async initialize(): Promise<void> {
    const connection = await natsConnection.connect();
    this.js = connection.jetstream();
    
    // Get or create consumer
    this.consumer = await this.js.consumers.get(
      this.config.stream,
      this.config.consumerName
    );

    console.log(`[EventSubscriber] Initialized consumer ${this.config.consumerName} on stream ${this.config.stream}`);
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      console.warn(`[EventSubscriber] Consumer ${this.config.consumerName} is already running`);
      return;
    }

    if (!this.consumer) {
      await this.initialize();
    }

    this.isRunning = true;
    console.log(`[EventSubscriber] Starting consumer ${this.config.consumerName}`);

    this.pullLoop();
  }

  private async pullLoop(): Promise<void> {
    while (this.isRunning) {
      try {
        const messages = await this.consumer.fetch({
          max_messages: this.config.batchSize || 10,
          expires: this.config.expiresMs || 5000
        });

        for await (const msg of messages) {
          await this.processMessage(msg);
        }

      } catch (error) {
        if (this.isRunning) {
          console.error(`[EventSubscriber] Error in pull loop for ${this.config.consumerName}:`, error);
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
  }

  private async processMessage(msg: JsMsg): Promise<void> {
    try {
      const eventData = JSON.parse(this.sc.decode(msg.data));
      const eventId = eventData.eventId || msg.headers?.get('Nats-Msg-Id');

      if (!eventId) {
        console.error('[EventSubscriber] Message missing eventId, moving to DLQ');
        await this.moveToDLQ(msg, eventData, new Error('Missing eventId'));
        msg.ack();
        return;
      }

      // Check idempotency
      const isDuplicate = await this.idempotencyGuard.isDuplicate(eventId);
      if (isDuplicate) {
        console.log(`[EventSubscriber] Duplicate event ${eventId}, acknowledging`);
        msg.ack();
        return;
      }

      // Process the event
      await this.handleEvent(eventData, msg);

      // Mark as processed
      await this.idempotencyGuard.markAsProcessed(eventId);

      // Acknowledge the message
      msg.ack();

      console.log(`[EventSubscriber] Successfully processed event ${eventId}`);

    } catch (error) {
      console.error(`[EventSubscriber] Error processing message:`, error);

      // Check retry count
      const retryCount = this.getRetryCount(msg);
      
      if (retryCount >= this.maxRetries) {
        console.error(`[EventSubscriber] Max retries (${this.maxRetries}) exceeded, moving to DLQ`);
        await this.moveToDLQ(msg, JSON.parse(this.sc.decode(msg.data)), error as Error);
        msg.ack();
      } else {
        // Negative acknowledge for redelivery
        console.log(`[EventSubscriber] NAK for redelivery (attempt ${retryCount + 1}/${this.maxRetries})`);
        msg.nak();
      }
    }
  }

  private getRetryCount(msg: JsMsg): number {
    // NATS JetStream tracks delivery count in message metadata
    // For simplicity, we'll use a basic counter
    return msg.info?.redelivered ? 1 : 0;
  }

  private async moveToDLQ(msg: JsMsg, eventData: any, error: Error): Promise<void> {
    try {
      await this.dlqHandler.moveToDLQ(
        this.config.stream,
        this.config.consumerName,
        eventData,
        error
      );
    } catch (dlqError) {
      console.error('[EventSubscriber] Failed to move message to DLQ:', dlqError);
    }
  }

  async stop(): Promise<void> {
    this.isRunning = false;
    console.log(`[EventSubscriber] Stopped consumer ${this.config.consumerName}`);
  }

  // Abstract method to be implemented by subclasses
  abstract handleEvent(event: T, msg: JsMsg): Promise<void>;
}

// ═══════════════════════════════════════════════════════════
// EXAMPLE SUBSCRIBERS
// ═══════════════════════════════════════════════════════════

export class ProvisioningSubscriber extends BaseEventSubscriber {
  constructor() {
    super({
      stream: 'ORDERS_EVENTS',
      consumerName: 'provisioning-worker-group',
      batchSize: 10,
      expiresMs: 5000
    }, 5);
  }

  async handleEvent(event: any, msg: JsMsg): Promise<void> {
    console.log('[ProvisioningSubscriber] Processing event:', event.eventType);
    
    // Implement provisioning logic here
    // This would call ProvisioningContext services
    
    switch (event.eventType) {
      case 'payment.received':
        await this.handlePaymentReceived(event.payload);
        break;
      default:
        console.log(`[ProvisioningSubscriber] Unhandled event type: ${event.eventType}`);
    }
  }

  private async handlePaymentReceived(payload: any): Promise<void> {
    console.log('[ProvisioningSubscriber] Payment received, provisioning resources...');
    // Call provisioning service
  }
}

export class ComplianceAuditorSubscriber extends BaseEventSubscriber {
  constructor() {
    super({
      stream: 'PROVISIONING_EVENTS',
      consumerName: 'compliance-auditor-group',
      batchSize: 10,
      expiresMs: 5000
    }, 5);
  }

  async handleEvent(event: any, msg: JsMsg): Promise<void> {
    console.log('[ComplianceAuditorSubscriber] Processing event:', event.eventType);
    
    switch (event.eventType) {
      case 'resource.provisioned':
        await this.handleResourceProvisioned(event.payload);
        break;
      default:
        console.log(`[ComplianceAuditorSubscriber] Unhandled event type: ${event.eventType}`);
    }
  }

  private async handleResourceProvisioned(payload: any): Promise<void> {
    console.log('[ComplianceAuditorSubscriber] Resource provisioned, running compliance checks...');
    // Call compliance orchestrator
  }
}

export class InventorySyncSubscriber extends BaseEventSubscriber {
  constructor() {
    super({
      stream: 'PROVISIONING_EVENTS',
      consumerName: 'inventory-sync-group',
      batchSize: 10,
      expiresMs: 5000
    }, 5);
  }

  async handleEvent(event: any, msg: JsMsg): Promise<void> {
    console.log('[InventorySyncSubscriber] Processing event:', event.eventType);
    
    switch (event.eventType) {
      case 'resource.provisioned':
      case 'resource.deleted':
      case 'resource.updated':
        await this.syncInventory(event);
        break;
      default:
        console.log(`[InventorySyncSubscriber] Unhandled event type: ${event.eventType}`);
    }
  }

  private async syncInventory(event: any): Promise<void> {
    console.log('[InventorySyncSubscriber] Syncing inventory...');
    // Call inventory service
  }
}
