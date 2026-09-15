// ═══════════════════════════════════════════════════════════
// PROVISIONING CONTEXT - Domain Layer
// Entities & Value Objects
// ═══════════════════════════════════════════════════════════

export type ResourceStatus = 'provisioning' | 'running' | 'stopped' | 'error' | 'deleting' | 'migrating';
export type ProviderType = 'internal' | 'local' | 'international';
export type ResourceType = 'vps' | 'gpu' | 'storage' | 'database' | 'network';

// ═══════════════════════════════════════════════════════════
// ENTITIES
// ═══════════════════════════════════════════════════════════

export interface Resource {
  id: string;
  orderId: string;
  userId: string;
  tenantId: string;
  productId: string;
  providerId: string;
  providerType: ProviderType;
  externalId?: string;
  name: string;
  type: ResourceType;
  status: ResourceStatus;
  specs: ResourceSpecs;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface ResourceSpecs {
  cpu?: number;
  ram?: number; // MB
  disk?: number; // GB
  gpu?: string;
  vram?: number; // GB
  network?: number; // Gbps
  os?: string;
}

export interface ProvisioningJob {
  id: string;
  resourceId: string;
  action: 'create' | 'delete' | 'migrate' | 'resize' | 'start' | 'stop';
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number; // 0-100
  logs: string[];
  startedAt: Date;
  completedAt?: Date;
  error?: string;
  metadata?: Record<string, any>;
}

export interface ProviderAdapter {
  id: string;
  name: string;
  type: ProviderType;
  apiConfig: Record<string, any>;
  isActive: boolean;
}

// ═══════════════════════════════════════════════════════════
// VALUE OBJECTS
// ═══════════════════════════════════════════════════════════

export interface ResourceId {
  value: string;
  toString(): string;
}

export interface IpAddress {
  value: string;
  isValid(): boolean;
}
