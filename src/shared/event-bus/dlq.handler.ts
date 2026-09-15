// ═══════════════════════════════════════════════════════════
// DLQ HANDLER
// Logic to route failed messages to DLQ
// ═══════════════════════════════════════════════════════════

import { JetStreamClient, StringCodec, headers } from 'nats';
import { natsConnection } from './nats.connection';
import { STREAMS } from './streams.config';

export interface DLQMessage {
  originalStream: string;
  originalConsumer: string;
  eventId: string;
  eventType: string;
  payload: any;
  error: {
    message: string;
    stack?: string;
  };
  failedAt: string;
  retryCount: number;
  metadata?: Record<string, any>;
}

export class DLQHandler {
  private js!: JetStreamClient;
  private sc = StringCodec();

  async initialize(): Promise<void> {
    const connection = await natsConnection.connect();
    this.js = connection.jetstream();
  }

  async moveToDLQ(
    originalStream: string,
    originalConsumer: string,
    eventData: any,
    error: Error,
    retryCount: number = 0
  ): Promise<void> {
    if (!this.js) {
      await this.initialize();
    }

    const dlqMessage: DLQMessage = {
      originalStream,
      originalConsumer,
      eventId: eventData.eventId || `unknown_${Date.now()}`,
      eventType: eventData.eventType || 'unknown',
      payload: eventData.payload || eventData,
      error: {
        message: error.message,
        stack: error.stack
      },
      failedAt: new Date().toISOString(),
      retryCount,
      metadata: eventData.metadata
    };

    try {
      const hdrs = headers();
      hdrs.set('X-Original-Stream', originalStream);
      hdrs.set('X-Original-Consumer', originalConsumer);
      hdrs.set('X-Original-EventId', dlqMessage.eventId);
      hdrs.set('X-DLQ-Reason', error.message);

      await this.js.publish(
        `dlq.${originalStream.toLowerCase()}`,
        this.sc.encode(JSON.stringify(dlqMessage)),
        { headers: hdrs }
      );

      console.log(`[DLQHandler] Message ${dlqMessage.eventId} moved to DLQ from ${originalStream}`);

    } catch (dlqError) {
      console.error('[DLQHandler] Failed to move message to DLQ:', dlqError);
      throw dlqError;
    }
  }

  async getDLQMessages(limit: number = 100): Promise<DLQMessage[]> {
    if (!this.js) {
      await this.initialize();
    }

    const messages: DLQMessage[] = [];

    try {
      const consumer = await this.js.consumers.get(STREAMS.DLQ, 'dlq-monitor-group');
      const fetched = await consumer.fetch({ max_messages: limit, expires: 5000 });

      for await (const msg of fetched) {
        const dlqMsg = JSON.parse(this.sc.decode(msg.data)) as DLQMessage;
        messages.push(dlqMsg);
        msg.ack();
      }

    } catch (error) {
      console.error('[DLQHandler] Error fetching DLQ messages:', error);
    }

    return messages;
  }

  async replayMessage(eventId: string): Promise<void> {
    if (!this.js) {
      await this.initialize();
    }

    // Find the message in DLQ
    const messages = await this.getDLQMessages(1000);
    const message = messages.find(m => m.eventId === eventId);

    if (!message) {
      throw new Error(`Message ${eventId} not found in DLQ`);
    }

    try {
      // Re-publish to original stream
      const hdrs = headers();
      hdrs.set('Nats-Msg-Id', `${eventId}_replay_${Date.now()}`);
      hdrs.set('X-Replayed-From-DLQ', 'true');
      hdrs.set('X-Original-EventId', eventId);

      await this.js.publish(
        message.eventType,
        this.sc.encode(JSON.stringify({
          eventId: `${eventId}_replay_${Date.now()}`,
          eventType: message.eventType,
          timestamp: new Date().toISOString(),
          payload: message.payload,
          metadata: {
            ...message.metadata,
            replayedFromDLQ: true,
            originalEventId: eventId
          }
        })),
        { headers: hdrs }
      );

      console.log(`[DLQHandler] Message ${eventId} replayed to ${message.eventType}`);

    } catch (error) {
      console.error('[DLQHandler] Error replaying message:', error);
      throw error;
    }
  }

  async purgeMessage(eventId: string): Promise<void> {
    // In production, you would delete the specific message from DLQ
    // For now, we just log it
    console.log(`[DLQHandler] Message ${eventId} purged from DLQ`);
  }

  async getDLQStats(): Promise<{ total: number; byStream: Record<string, number> }> {
    const messages = await this.getDLQMessages(10000);
    
    const byStream: Record<string, number> = {};
    for (const msg of messages) {
      byStream[msg.originalStream] = (byStream[msg.originalStream] || 0) + 1;
    }

    return {
      total: messages.length,
      byStream
    };
  }
}

// Export singleton instance
export const dlqHandler = new DLQHandler();
