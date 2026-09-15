// ═══════════════════════════════════════════════════════════
// IDEMPOTENCY GUARD
// Middleware to check duplicate eventId
// ═══════════════════════════════════════════════════════════

export class IdempotencyGuard {
  private processedEvents: Map<string, { timestamp: number; ttl: number }> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;
  private defaultTTL = 2 * 60 * 1000; // 2 minutes in milliseconds

  constructor() {
    this.startCleanup();
  }

  async isDuplicate(eventId: string): Promise<boolean> {
    const record = this.processedEvents.get(eventId);
    
    if (!record) {
      return false;
    }

    // Check if TTL has expired
    const now = Date.now();
    if (now - record.timestamp > record.ttl) {
      this.processedEvents.delete(eventId);
      return false;
    }

    return true;
  }

  async markAsProcessed(eventId: string, ttl?: number): Promise<void> {
    this.processedEvents.set(eventId, {
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    });
  }

  async removeFromProcessed(eventId: string): Promise<void> {
    this.processedEvents.delete(eventId);
  }

  private startCleanup(): void {
    // Cleanup expired entries every minute
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      
      for (const [eventId, record] of this.processedEvents.entries()) {
        if (now - record.timestamp > record.ttl) {
          this.processedEvents.delete(eventId);
        }
      }
    }, 60 * 1000); // Every minute
  }

  async stop(): Promise<void> {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.processedEvents.clear();
  }

  getStats(): { totalProcessed: number; activeEntries: number } {
    return {
      totalProcessed: this.processedEvents.size,
      activeEntries: this.processedEvents.size
    };
  }
}

// Export singleton instance
export const idempotencyGuard = new IdempotencyGuard();
