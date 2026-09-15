// ═══════════════════════════════════════════════════════════
// NATS CONNECTION MANAGER
// Singleton connection with cluster support, TLS, auto-reconnect
// ═══════════════════════════════════════════════════════════

import { connect, NatsConnection, ConnectionOptions, StringCodec, RetentionPolicy, StorageType, DeliverPolicy, AckPolicy, ReplayPolicy } from 'nats';
import { STREAM_CONFIGS, CONSUMER_CONFIGS } from './streams.config';

export class NatsConnectionManager {
  private static instance: NatsConnectionManager;
  private connection: NatsConnection | null = null;
  private isConnecting = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelay = 5000; // 5 seconds
  private healthCheckInterval: NodeJS.Timeout | null = null;

  private constructor() {}

  static getInstance(): NatsConnectionManager {
    if (!NatsConnectionManager.instance) {
      NatsConnectionManager.instance = new NatsConnectionManager();
    }
    return NatsConnectionManager.instance;
  }

  async connect(): Promise<NatsConnection> {
    if (this.connection && !this.connection.isClosed()) {
      return this.connection;
    }

    if (this.isConnecting) {
      throw new Error('Connection attempt already in progress');
    }

    this.isConnecting = true;

    try {
      const servers = this.getServers();
      
      const options: ConnectionOptions = {
        servers,
        name: 'abran-system-event-bus',
        reconnect: true,
        maxReconnectAttempts: this.maxReconnectAttempts,
        reconnectTimeWait: this.reconnectDelay,
        pingInterval: 20000, // 20 seconds
        maxPingOut: 2,
        timeout: 30000, // 30 seconds
        waitOnFirstConnect: true,
        debug: false,
        noEcho: false,
        noRandomize: false,
        pedantic: false,
        verbose: false,
        tls: this.getTlsConfig()
      };

      // Add authentication if configured
      if (process.env.NATS_USER && process.env.NATS_PASS) {
        options.user = process.env.NATS_USER;
        options.pass = process.env.NATS_PASS;
      }

      console.log('[NatsConnection] Connecting to NATS cluster:', servers.join(', '));

      this.connection = await connect(options);

      // Setup event handlers
      (async () => {
        if (!this.connection) return;
        
        for await (const status of this.connection.status()) {
          this.handleStatus(status);
        }
      })().catch(err => {
        console.error('[NatsConnection] Status handler error:', err);
      });

      this.isConnecting = false;
      this.reconnectAttempts = 0;

      console.log('[NatsConnection] Connected successfully to NATS cluster');

      // Start health check
      this.startHealthCheck();

      // Initialize streams and consumers
      await this.initializeStreams();

      return this.connection;

    } catch (error) {
      this.isConnecting = false;
      console.error('[NatsConnection] Connection failed:', error);
      
      // Retry logic
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        console.log(`[NatsConnection] Retrying connection in ${this.reconnectDelay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        
        await new Promise(resolve => setTimeout(resolve, this.reconnectDelay));
        return this.connect();
      }

      throw new Error(`Failed to connect to NATS after ${this.maxReconnectAttempts} attempts`);
    }
  }

  private getServers(): string[] {
    const urls = process.env.NATS_URLS || 'nats://localhost:4222';
    return urls.split(',').map(url => url.trim());
  }

  private getTlsConfig(): any {
    if (process.env.NATS_TLS_ENABLED === 'true') {
      return {
        certFile: process.env.NATS_TLS_CERT,
        keyFile: process.env.NATS_TLS_KEY,
        caFile: process.env.NATS_TLS_CA
      };
    }
    return undefined;
  }

  private handleStatus(status: any) {
    switch (status.type) {
      case 'disconnect':
        console.warn('[NatsConnection] Disconnected from server');
        break;
      case 'reconnect':
        console.log('[NatsConnection] Reconnected to server');
        this.reconnectAttempts = 0;
        break;
      case 'update':
        console.log('[NatsConnection] Server update received');
        break;
      case 'error':
        console.error('[NatsConnection] Error:', status.data);
        break;
    }
  }

  private startHealthCheck() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    this.healthCheckInterval = setInterval(() => {
      this.checkHealth().catch(err => {
        console.error('[NatsConnection] Health check failed:', err);
      });
    }, 30000); // Every 30 seconds
  }

  async checkHealth(): Promise<{ healthy: boolean; latency?: number; error?: string }> {
    if (!this.connection || this.connection.isClosed()) {
      return { healthy: false, error: 'Connection is closed' };
    }

    try {
      const start = Date.now();
      
      // Simple ping test
      const sc = StringCodec();
      const sub = this.connection.subscribe('_health.check', { max: 1 });
      
      await this.connection.publish('_health.check', sc.encode('ping'));
      
      const msg = await Promise.race([
        (async () => {
          for await (const m of sub) {
            return m;
          }
        })(),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Health check timeout')), 5000)
        )
      ]);

      const latency = Date.now() - start;

      return { healthy: true, latency };

    } catch (error) {
      return { 
        healthy: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  private async initializeStreams() {
    if (!this.connection) {
      throw new Error('Connection not established');
    }

    const jsm = await this.connection.jetstreamManager();

    console.log('[NatsConnection] Initializing streams...');

    // Create streams
    for (const config of STREAM_CONFIGS) {
      try {
        const streamInfo = await jsm.streams.info(config.name).catch(() => null);
        
        if (!streamInfo) {
          await jsm.streams.add({
            name: config.name,
            subjects: config.subjects,
            retention: config.retention,
            max_age: config.maxAge,
            storage: config.storage,
            num_replicas: config.replicas,
            duplicate_window: config.duplicateWindow,
            max_msgs: config.maxMsgs,
            max_bytes: config.maxBytes
          });
          console.log(`[NatsConnection] Stream created: ${config.name}`);
        } else {
          console.log(`[NatsConnection] Stream already exists: ${config.name}`);
        }
      } catch (error) {
        console.error(`[NatsConnection] Error creating stream ${config.name}:`, error);
      }
    }

    console.log('[NatsConnection] Initializing consumers...');

    // Create consumers
    for (const config of CONSUMER_CONFIGS) {
      try {
        const consumerInfo = await jsm.consumers.info(config.stream, config.name).catch(() => null);
        
        if (!consumerInfo) {
          await jsm.consumers.add(config.stream, {
            durable_name: config.name,
            filter_subject: config.filterSubject,
            deliver_policy: config.deliverPolicy,
            ack_policy: config.ackPolicy,
            ack_wait: config.ackWait,
            max_deliver: config.maxDeliver,
            max_ack_pending: config.maxAckPending,
            replay_policy: config.replayPolicy
          });
          console.log(`[NatsConnection] Consumer created: ${config.name} on stream ${config.stream}`);
        } else {
          console.log(`[NatsConnection] Consumer already exists: ${config.name}`);
        }
      } catch (error) {
        console.error(`[NatsConnection] Error creating consumer ${config.name}:`, error);
      }
    }

    console.log('[NatsConnection] Streams and consumers initialized');
  }

  async disconnect(): Promise<void> {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }

    if (this.connection) {
      await this.connection.drain();
      await this.connection.close();
      this.connection = null;
      console.log('[NatsConnection] Disconnected from NATS');
    }
  }

  getConnection(): NatsConnection {
    if (!this.connection || this.connection.isClosed()) {
      throw new Error('NATS connection not available');
    }
    return this.connection;
  }

  isConnected(): boolean {
    return this.connection !== null && !this.connection.isClosed();
  }
}

// Export singleton instance
export const natsConnection = NatsConnectionManager.getInstance();
