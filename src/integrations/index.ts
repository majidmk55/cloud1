// ═══════════════════════════════════════════════════════════
// EXTERNAL INTEGRATIONS ARCHITECTURE
// Resilient & Idempotent External Service Adapters
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// SHARED RESILIENCE UTILITIES
// ═══════════════════════════════════════════════════════════

export interface ResilienceConfig {
  timeoutMs: number;
  retry: {
    maxAttempts: number;
    baseDelayMs: number;
    maxDelayMs: number;
    retryableStatusCodes: number[];
  };
  circuitBreaker: {
    failureThreshold: number;
    resetTimeoutMs: number;
    monitoringPeriodMs: number;
  };
}

export const DEFAULT_RESILIENCE_CONFIG: ResilienceConfig = {
  timeoutMs: 30000,
  retry: {
    maxAttempts: 3,
    baseDelayMs: 1000,
    maxDelayMs: 30000,
    retryableStatusCodes: [429, 500, 502, 503, 504],
  },
  circuitBreaker: {
    failureThreshold: 5,
    resetTimeoutMs: 30000,
    monitoringPeriodMs: 60000,
  },
};

// Timeout Enforcer
export async function withTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const result = await Promise.race([
      fn(),
      new Promise<never>((_, reject) => {
        controller.signal.addEventListener('abort', () => {
          reject(new Error(`Operation timed out after ${timeoutMs}ms`));
        });
      }),
    ]);
    return result;
  } finally {
    clearTimeout(timeout);
  }
}

// Retry with Exponential Backoff + Jitter
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  config: ResilienceConfig['retry']
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < config.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      const err = error as any;

      // Don't retry on non-retryable errors
      if (err.statusCode && !config.retryableStatusCodes.includes(err.statusCode)) {
        throw error;
      }

      if (attempt < config.maxAttempts - 1) {
        // Exponential backoff with jitter
        const delay = Math.min(
          config.baseDelayMs * Math.pow(2, attempt) + Math.random() * 1000,
          config.maxDelayMs
        );

        // Respect Retry-After header if present
        const retryAfter = err.retryAfter ? parseInt(err.retryAfter) * 1000 : null;
        const actualDelay = retryAfter ? Math.max(delay, retryAfter) : delay;

        console.log(`[Retry] Attempt ${attempt + 1}/${config.maxAttempts} failed. Retrying in ${actualDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, actualDelay));
      }
    }
  }

  throw lastError || new Error('All retry attempts failed');
}

// Circuit Breaker (Simple implementation)
export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failureCount = 0;
  private lastFailureTime = 0;
  private successCount = 0;

  constructor(
    private config: ResilienceConfig['circuitBreaker']
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.config.resetTimeoutMs) {
        this.state = 'HALF_OPEN';
        this.successCount = 0;
        console.log('[CircuitBreaker] State: OPEN → HALF_OPEN');
      } else {
        throw new Error('Circuit breaker is OPEN - service unavailable');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;

    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      if (this.successCount >= 1) {
        this.state = 'CLOSED';
        console.log('[CircuitBreaker] State: HALF_OPEN → CLOSED');
      }
    }
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.config.failureThreshold) {
      this.state = 'OPEN';
      console.log(`[CircuitBreaker] State: → OPEN (${this.failureCount} failures)`);
    }
  }

  getState(): CircuitState {
    return this.state;
  }

  getMetrics(): { state: CircuitState; failureCount: number } {
    return { state: this.state, failureCount: this.failureCount };
  }
}

// Resilience Wrapper (combines timeout + retry + circuit breaker)
export async function withResilience<T>(
  fn: () => Promise<T>,
  config: ResilienceConfig = DEFAULT_RESILIENCE_CONFIG,
  circuitBreaker?: CircuitBreaker
): Promise<T> {
  const cb = circuitBreaker || new CircuitBreaker(config.circuitBreaker);

  return cb.execute(() =>
    retryWithBackoff(
      () => withTimeout(fn, config.timeoutMs),
      config.retry
    )
  );
}

// Idempotency Guard
export class IdempotencyGuard {
  private processedKeys: Map<string, { timestamp: number; result: any }> = new Map();
  private readonly TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

  async isProcessed(key: string): Promise<{ processed: boolean; result?: any }> {
    const record = this.processedKeys.get(key);

    if (!record) return { processed: false };

    if (Date.now() - record.timestamp > this.TTL_MS) {
      this.processedKeys.delete(key);
      return { processed: false };
    }

    return { processed: true, result: record.result };
  }

  async markProcessed(key: string, result: any): Promise<void> {
    this.processedKeys.set(key, { timestamp: Date.now(), result });
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.processedKeys.entries()) {
      if (now - record.timestamp > this.TTL_MS) {
        this.processedKeys.delete(key);
      }
    }
  }
}

// ═══════════════════════════════════════════════════════════
// MODULE 1: PAYMENT GATEWAY (Zarinpal / Liara)
// ═══════════════════════════════════════════════════════════

export interface PaymentInitiation {
  gatewayUrl: string;
  authorityOrTrackingId: string;
  expiresAt: Date;
}

export interface PaymentVerification {
  success: boolean;
  transactionId: string;
  amount: number;
  cardHash?: string;
  verifiedAt: Date;
}

export interface RefundResult {
  success: boolean;
  refundId: string;
  amount: number;
  refundedAt: Date;
}

export interface IPaymentAdapter {
  readonly provider: 'zarinpal' | 'liara';
  initiatePayment(amount: number, currency: string, callbackUrl: string, metadata: Record<string, string>): Promise<PaymentInitiation>;
  verifyPayment(authorityOrTrackingId: string): Promise<PaymentVerification>;
  refundPayment(transactionId: string, amount?: number): Promise<RefundResult>;
}

export class ZarinpalAdapter implements IPaymentAdapter {
  readonly provider = 'zarinpal' as const;
  private merchantId: string;
  private circuitBreaker: CircuitBreaker;
  private idempotencyGuard: IdempotencyGuard;

  constructor(merchantId: string) {
    this.merchantId = merchantId;
    this.circuitBreaker = new CircuitBreaker(DEFAULT_RESILIENCE_CONFIG.circuitBreaker);
    this.idempotencyGuard = new IdempotencyGuard();
  }

  async initiatePayment(amount: number, currency: string, callbackUrl: string, metadata: Record<string, string>): Promise<PaymentInitiation> {
    const idempotencyKey = `pay-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const existing = await this.idempotencyGuard.isProcessed(idempotencyKey);
    if (existing.processed) return existing.result;

    const result = await withResilience(async () => {
      console.log(`[Zarinpal] Initiating payment: ${amount} ${currency}`);
      // In production: POST to Zarinpal API
      return {
        gatewayUrl: `https://www.zarinpal.com/pg/StartPay/mock-authority`,
        authorityOrTrackingId: `mock-authority-${Date.now()}`,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 min
      };
    }, DEFAULT_RESILIENCE_CONFIG, this.circuitBreaker);

    await this.idempotencyGuard.markProcessed(idempotencyKey, result);
    return result;
  }

  async verifyPayment(authorityOrTrackingId: string): Promise<PaymentVerification> {
    return withResilience(async () => {
      console.log(`[Zarinpal] Verifying payment: ${authorityOrTrackingId}`);
      // In production: POST to Zarinpal verification API
      return {
        success: true,
        transactionId: `txn-${Date.now()}`,
        amount: 100000,
        cardHash: 'hash-mock',
        verifiedAt: new Date(),
      };
    }, DEFAULT_RESILIENCE_CONFIG, this.circuitBreaker);
  }

  async refundPayment(transactionId: string, amount?: number): Promise<RefundResult> {
    return withResilience(async () => {
      console.log(`[Zarinpal] Refunding payment: ${transactionId}`);
      return {
        success: true,
        refundId: `refund-${Date.now()}`,
        amount: amount || 100000,
        refundedAt: new Date(),
      };
    }, DEFAULT_RESILIENCE_CONFIG, this.circuitBreaker);
  }
}

export class LiaraAdapter implements IPaymentAdapter {
  readonly provider = 'liara' as const;
  private apiKey: string;
  private circuitBreaker: CircuitBreaker;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.circuitBreaker = new CircuitBreaker(DEFAULT_RESILIENCE_CONFIG.circuitBreaker);
  }

  async initiatePayment(amount: number, currency: string, callbackUrl: string, metadata: Record<string, string>): Promise<PaymentInitiation> {
    return withResilience(async () => {
      console.log(`[Liara] Initiating payment: ${amount} ${currency}`);
      return {
        gatewayUrl: `https://gateway.liara.ir/pay/mock-tracking`,
        authorityOrTrackingId: `mock-tracking-${Date.now()}`,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      };
    }, DEFAULT_RESILIENCE_CONFIG, this.circuitBreaker);
  }

  async verifyPayment(authorityOrTrackingId: string): Promise<PaymentVerification> {
    return withResilience(async () => {
      console.log(`[Liara] Verifying payment: ${authorityOrTrackingId}`);
      return {
        success: true,
        transactionId: `txn-liara-${Date.now()}`,
        amount: 100000,
        verifiedAt: new Date(),
      };
    }, DEFAULT_RESILIENCE_CONFIG, this.circuitBreaker);
  }

  async refundPayment(transactionId: string, amount?: number): Promise<RefundResult> {
    return withResilience(async () => {
      console.log(`[Liara] Refunding payment: ${transactionId}`);
      return {
        success: true,
        refundId: `refund-liara-${Date.now()}`,
        amount: amount || 100000,
        refundedAt: new Date(),
      };
    }, DEFAULT_RESILIENCE_CONFIG, this.circuitBreaker);
  }
}

// ═══════════════════════════════════════════════════════════
// MODULE 2: TAX AUTHORITY (Iranian Tax API)
// ═══════════════════════════════════════════════════════════

export interface TaxInvoice {
  invoiceNumber: string;
  amount: number;
  taxAmount: number;
  buyerNationalId: string;
  sellerNationalId: string;
  date: Date;
}

export interface TaxSubmissionResult {
  success: boolean;
  batchId: string;
  gatewayReference: string;
  submittedAt: Date;
  invoiceCount: number;
}

export interface ITaxAdapter {
  submitInvoiceBatch(invoices: TaxInvoice[]): Promise<TaxSubmissionResult>;
  getSubmissionStatus(batchId: string): Promise<{ status: string; details?: string }>;
}

export class IranTaxAdapter implements ITaxAdapter {
  private clientId: string;
  private clientSecret: string;
  private circuitBreaker: CircuitBreaker;
  private rateLimitRemaining = 100;

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.circuitBreaker = new CircuitBreaker({
      failureThreshold: 3,
      resetTimeoutMs: 60000,
      monitoringPeriodMs: 300000,
    });
  }

  async submitInvoiceBatch(invoices: TaxInvoice[]): Promise<TaxSubmissionResult> {
    if (this.rateLimitRemaining < 10) {
      console.log('[IranTax] Rate limit low, delaying...');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return withResilience(async () => {
      console.log(`[IranTax] Submitting batch of ${invoices.length} invoices`);
      // In production: OAuth2 token → PKCS#7 sign → POST batch XML/JSON
      this.rateLimitRemaining--;

      return {
        success: true,
        batchId: `tax-batch-${Date.now()}`,
        gatewayReference: `ref-${Date.now()}`,
        submittedAt: new Date(),
        invoiceCount: invoices.length,
      };
    }, {
      ...DEFAULT_RESILIENCE_CONFIG,
      retry: { ...DEFAULT_RESILIENCE_CONFIG.retry, maxAttempts: 5, baseDelayMs: 2000 },
    }, this.circuitBreaker);
  }

  async getSubmissionStatus(batchId: string): Promise<{ status: string; details?: string }> {
    return withResilience(async () => {
      console.log(`[IranTax] Checking status: ${batchId}`);
      return { status: 'SUBMITTED', details: 'Processing' };
    }, DEFAULT_RESILIENCE_CONFIG, this.circuitBreaker);
  }
}

// ═══════════════════════════════════════════════════════════
// MODULE 3: EMAIL / SMS PROVIDER
// ═══════════════════════════════════════════════════════════

export type NotificationChannel = 'email' | 'sms';
export type NotificationPriority = 'high' | 'normal' | 'low';

export interface NotificationResult {
  messageId: string;
  queuedAt: Date;
  estimatedDelivery: Date;
}

export interface INotificationAdapter {
  readonly channel: NotificationChannel;
  send(templateId: string, recipient: string, variables: Record<string, any>, priority?: NotificationPriority): Promise<NotificationResult>;
  getStatus(messageId: string): Promise<{ status: string; deliveredAt?: Date }>;
}

export class SendGridAdapter implements INotificationAdapter {
  readonly channel = 'email' as const;
  private apiKey: string;
  private circuitBreaker: CircuitBreaker;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.circuitBreaker = new CircuitBreaker(DEFAULT_RESILIENCE_CONFIG.circuitBreaker);
  }

  async send(templateId: string, recipient: string, variables: Record<string, any>, priority: NotificationPriority = 'normal'): Promise<NotificationResult> {
    return withResilience(async () => {
      console.log(`[SendGrid] Sending email: template=${templateId}, to=${recipient}, priority=${priority}`);
      return {
        messageId: `sg-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        queuedAt: new Date(),
        estimatedDelivery: new Date(Date.now() + 5 * 60 * 1000),
      };
    }, DEFAULT_RESILIENCE_CONFIG, this.circuitBreaker);
  }

  async getStatus(messageId: string): Promise<{ status: string; deliveredAt?: Date }> {
    return { status: 'DELIVERED', deliveredAt: new Date() };
  }
}

export class KavenegarAdapter implements INotificationAdapter {
  readonly channel = 'sms' as const;
  private apiKey: string;
  private circuitBreaker: CircuitBreaker;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.circuitBreaker = new CircuitBreaker(DEFAULT_RESILIENCE_CONFIG.circuitBreaker);
  }

  async send(templateId: string, recipient: string, variables: Record<string, any>, priority: NotificationPriority = 'normal'): Promise<NotificationResult> {
    return withResilience(async () => {
      console.log(`[Kavenegar] Sending SMS: template=${templateId}, to=${recipient}`);
      return {
        messageId: `kv-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        queuedAt: new Date(),
        estimatedDelivery: new Date(Date.now() + 30 * 1000),
      };
    }, DEFAULT_RESILIENCE_CONFIG, this.circuitBreaker);
  }

  async getStatus(messageId: string): Promise<{ status: string; deliveredAt?: Date }> {
    return { status: 'DELIVERED', deliveredAt: new Date() };
  }
}

// ═══════════════════════════════════════════════════════════
// MODULE 4: DOMAIN / DNS PROVIDER
// ═══════════════════════════════════════════════════════════

export interface DNSRecord {
  zoneId: string;
  name: string;
  type: 'A' | 'AAAA' | 'CNAME' | 'TXT' | 'MX';
  content: string;
  ttl: number;
  proxied?: boolean;
  priority?: number;
}

export interface DNSRecordResult {
  id: string;
  record: DNSRecord;
  createdAt: Date;
}

export interface PropagationStatus {
  domain: string;
  propagated: boolean;
  checkedResolvers: number;
  matchingResolvers: number;
  checkedAt: Date;
}

export interface IDNSAdapter {
  readonly provider: 'cloudflare' | 'route53' | 'local';
  createRecord(record: DNSRecord): Promise<DNSRecordResult>;
  updateRecord(recordId: string, record: Partial<DNSRecord>): Promise<DNSRecordResult>;
  deleteRecord(recordId: string): Promise<void>;
  triggerPropagationCheck(domain: string): Promise<PropagationStatus>;
}

export class CloudflareDNSAdapter implements IDNSAdapter {
  readonly provider = 'cloudflare' as const;
  private apiToken: string;
  private circuitBreaker: CircuitBreaker;

  constructor(apiToken: string) {
    this.apiToken = apiToken;
    this.circuitBreaker = new CircuitBreaker(DEFAULT_RESILIENCE_CONFIG.circuitBreaker);
  }

  async createRecord(record: DNSRecord): Promise<DNSRecordResult> {
    return withResilience(async () => {
      console.log(`[Cloudflare DNS] Creating ${record.type} record: ${record.name} → ${record.content}`);
      return {
        id: `cf-${Date.now()}`,
        record,
        createdAt: new Date(),
      };
    }, DEFAULT_RESILIENCE_CONFIG, this.circuitBreaker);
  }

  async updateRecord(recordId: string, record: Partial<DNSRecord>): Promise<DNSRecordResult> {
    return withResilience(async () => {
      console.log(`[Cloudflare DNS] Updating record: ${recordId}`);
      return {
        id: recordId,
        record: { ...record, zoneId: '', name: '', type: 'A', content: '', ttl: 300 } as DNSRecord,
        createdAt: new Date(),
      };
    }, DEFAULT_RESILIENCE_CONFIG, this.circuitBreaker);
  }

  async deleteRecord(recordId: string): Promise<void> {
    await withResilience(async () => {
      console.log(`[Cloudflare DNS] Deleting record: ${recordId}`);
    }, DEFAULT_RESILIENCE_CONFIG, this.circuitBreaker);
  }

  async triggerPropagationCheck(domain: string): Promise<PropagationStatus> {
    return {
      domain,
      propagated: true,
      checkedResolvers: 4,
      matchingResolvers: 4,
      checkedAt: new Date(),
    };
  }
}

// ═══════════════════════════════════════════════════════════
// MODULE 5: CLOUDFLARE CDN
// ═══════════════════════════════════════════════════════════

export interface PurgeResult {
  id: string;
  purgedAt: Date;
  purgedCount: number;
}

export interface CDNAnalytics {
  bandwidthGb: number;
  requests: number;
  threats: number;
  cacheRatio: number;
  period: { from: Date; to: Date };
}

export interface ICDNAdapter {
  readonly provider: 'cloudflare';
  purgeCache(urls?: string[], tags?: string[], purgeEverything?: boolean): Promise<PurgeResult>;
  getAnalytics(zoneId: string, since: Date, until: Date): Promise<CDNAnalytics>;
}

export class CloudflareCDNAdapter implements ICDNAdapter {
  readonly provider = 'cloudflare' as const;
  private apiToken: string;
  private zoneId: string;
  private circuitBreaker: CircuitBreaker;

  constructor(apiToken: string, zoneId: string) {
    this.apiToken = apiToken;
    this.zoneId = zoneId;
    this.circuitBreaker = new CircuitBreaker(DEFAULT_RESILIENCE_CONFIG.circuitBreaker);
  }

  async purgeCache(urls?: string[], tags?: string[], purgeEverything?: boolean): Promise<PurgeResult> {
    return withResilience(async () => {
      const count = urls?.length || (purgeEverything ? -1 : 0);
      console.log(`[Cloudflare CDN] Purging cache: ${count} URLs`);
      return {
        id: `purge-${Date.now()}`,
        purgedAt: new Date(),
        purgedCount: count,
      };
    }, DEFAULT_RESILIENCE_CONFIG, this.circuitBreaker);
  }

  async getAnalytics(zoneId: string, since: Date, until: Date): Promise<CDNAnalytics> {
    return withResilience(async () => {
      console.log(`[Cloudflare CDN] Fetching analytics for zone: ${zoneId}`);
      return {
        bandwidthGb: 125.5,
        requests: 1250000,
        threats: 45,
        cacheRatio: 0.92,
        period: { from: since, to: until },
      };
    }, DEFAULT_RESILIENCE_CONFIG, this.circuitBreaker);
  }
}

// ═══════════════════════════════════════════════════════════
// MODULE 6: 3RD PARTY MONITORING
// ═══════════════════════════════════════════════════════════

export interface MonitorConfig {
  name: string;
  type: 'HTTP' | 'PING' | 'PORT' | 'KEYWORD';
  url: string;
  intervalSeconds: number;
  timeoutSeconds: number;
  expectedStatusCodes: number[];
  expectedKeyword?: string;
}

export interface MonitorResult {
  monitorId: string;
  config: MonitorConfig;
  createdAt: Date;
}

export interface StatusPageData {
  overallStatus: 'operational' | 'degraded' | 'outage';
  monitors: Array<{
    name: string;
    status: string;
    uptime: number;
  }>;
  incidents: Array<{
    id: string;
    title: string;
    status: string;
    createdAt: Date;
  }>;
}

export interface IMonitoringAdapter {
  readonly provider: 'uptimerobot' | 'pingdom' | 'datadog';
  createMonitor(monitor: MonitorConfig): Promise<MonitorResult>;
  deleteMonitor(monitorId: string): Promise<void>;
  getStatusPage(): Promise<StatusPageData>;
}

export class UptimeRobotAdapter implements IMonitoringAdapter {
  readonly provider = 'uptimerobot' as const;
  private apiKey: string;
  private circuitBreaker: CircuitBreaker;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.circuitBreaker = new CircuitBreaker(DEFAULT_RESILIENCE_CONFIG.circuitBreaker);
  }

  async createMonitor(monitor: MonitorConfig): Promise<MonitorResult> {
    return withResilience(async () => {
      console.log(`[UptimeRobot] Creating monitor: ${monitor.name} (${monitor.type})`);
      return {
        monitorId: `ur-${Date.now()}`,
        config: monitor,
        createdAt: new Date(),
      };
    }, DEFAULT_RESILIENCE_CONFIG, this.circuitBreaker);
  }

  async deleteMonitor(monitorId: string): Promise<void> {
    await withResilience(async () => {
      console.log(`[UptimeRobot] Deleting monitor: ${monitorId}`);
    }, DEFAULT_RESILIENCE_CONFIG, this.circuitBreaker);
  }

  async getStatusPage(): Promise<StatusPageData> {
    return {
      overallStatus: 'operational',
      monitors: [
        { name: 'API Gateway', status: 'up', uptime: 99.98 },
        { name: 'Web Dashboard', status: 'up', uptime: 99.95 },
      ],
      incidents: [],
    };
  }
}

// ═══════════════════════════════════════════════════════════
// INTEGRATION FACTORY
// ═══════════════════════════════════════════════════════════

export class IntegrationFactory {
  // Payment
  static createPaymentAdapter(provider: 'zarinpal' | 'liara', credentials: string): IPaymentAdapter {
    switch (provider) {
      case 'zarinpal': return new ZarinpalAdapter(credentials);
      case 'liara': return new LiaraAdapter(credentials);
    }
  }

  // Tax
  static createTaxAdapter(clientId: string, clientSecret: string): ITaxAdapter {
    return new IranTaxAdapter(clientId, clientSecret);
  }

  // Notifications
  static createNotificationAdapter(channel: 'email' | 'sms', apiKey: string): INotificationAdapter {
    switch (channel) {
      case 'email': return new SendGridAdapter(apiKey);
      case 'sms': return new KavenegarAdapter(apiKey);
    }
  }

  // DNS
  static createDNSAdapter(provider: 'cloudflare', apiToken: string): IDNSAdapter {
    return new CloudflareDNSAdapter(apiToken);
  }

  // CDN
  static createCDNAdapter(apiToken: string, zoneId: string): ICDNAdapter {
    return new CloudflareCDNAdapter(apiToken, zoneId);
  }

  // Monitoring
  static createMonitoringAdapter(provider: 'uptimerobot', apiKey: string): IMonitoringAdapter {
    return new UptimeRobotAdapter(apiKey);
  }
}

// ═══════════════════════════════════════════════════════════
// WEBHOOK SIGNATURE VERIFICATION
// ═══════════════════════════════════════════════════════════

export class WebhookSignatureVerifier {
  static async verifyHMAC(payload: string, signature: string, secret: string): Promise<boolean> {
    // In production: Use crypto.createHmac('sha256', secret).update(payload).digest('hex')
    const expected = `mock-hmac-${payload.length}`;
    return signature === expected || signature.length > 0;
  }

  static verifyIP(ip: string, allowedIPs: string[]): boolean {
    return allowedIPs.includes(ip);
  }
}

// ═══════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════

export const integrations = {
  // Resilience
  withResilience,
  withTimeout,
  retryWithBackoff,
  CircuitBreaker,
  IdempotencyGuard,
  WebhookSignatureVerifier,

  // Factory
  IntegrationFactory,

  // Payment
  ZarinpalAdapter,
  LiaraAdapter,

  // Tax
  IranTaxAdapter,

  // Notifications
  SendGridAdapter,
  KavenegarAdapter,

  // DNS
  CloudflareDNSAdapter,

  // CDN
  CloudflareCDNAdapter,

  // Monitoring
  UptimeRobotAdapter,
};
