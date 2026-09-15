// ═══════════════════════════════════════════════════════════
// EVENT PUBLISHER
// Wrapper for publishing events with dedup keys
// ═══════════════════════════════════════════════════════════

import { JetStreamClient, StringCodec, headers } from 'nats';
import { natsConnection } from './nats.connection';

export interface PublishOptions {
  eventId?: string;
  correlationId?: string;
  sourceContext?: string;
  timestamp?: Date;
  metadata?: Record<string, any>;
}

export interface EventPayload<T = any> {
  eventId: string;
  eventType: string;
  timestamp: string;
  payload: T;
  metadata?: {
    correlationId?: string;
    sourceContext?: string;
    [key: string]: any;
  };
}

export class EventBusUnavailableError extends Error {
  constructor(message: string = 'Event bus is unavailable') {
    super(message);
    this.name = 'EventBusUnavailableError';
  }
}

export class EventPublisher {
  private js!: JetStreamClient;
  private sc = StringCodec();

  async initialize(): Promise<void> {
    const connection = await natsConnection.connect();
    this.js = connection.jetstream();
  }

  async publish<T>(
    stream: string,
    subject: string,
    payload: T,
    options: PublishOptions = {}
  ): Promise<string> {
    if (!this.js) {
      await this.initialize();
    }

    const eventId = options.eventId || this.generateEventId();
    const correlationId = options.correlationId || this.generateCorrelationId();
    const timestamp = options.timestamp || new Date();

    const event: EventPayload<T> = {
      eventId,
      eventType: subject,
      timestamp: timestamp.toISOString(),
      payload,
      metadata: {
        correlationId,
        sourceContext: options.sourceContext,
        ...options.metadata
      }
    };

    try {
      // Create headers for deduplication
      const hdrs = headers();
      hdrs.set('Nats-Msg-Id', eventId);
      hdrs.set('X-Correlation-Id', correlationId);
      hdrs.set('X-Source-Context', options.sourceContext || 'unknown');
      hdrs.set('X-Event-Type', subject);

      // Publish to JetStream
      const pa = await this.js.publish(subject, this.sc.encode(JSON.stringify(event)), {
        headers: hdrs
      });

      console.log(`[EventPublisher] Published event ${eventId} to ${subject} (seq: ${pa.seq})`);

      return eventId;

    } catch (error) {
      console.error(`[EventPublisher] Failed to publish event to ${subject}:`, error);
      throw new EventBusUnavailableError(`Failed to publish event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async publishToStream<T>(
    stream: string,
    subject: string,
    payload: T,
    options: PublishOptions = {}
  ): Promise<string> {
    // For JetStream, the stream is determined by subject mapping
    // We just publish to the subject and NATS routes it to the correct stream
    return this.publish(stream, subject, payload, options);
  }

  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateCorrelationId(): string {
    return `corr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const eventPublisher = new EventPublisher();
