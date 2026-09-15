// ═══════════════════════════════════════════════════════════
// PROVISIONING CONTEXT - Infrastructure Layer
// Repositories & Provider Adapters
// ═══════════════════════════════════════════════════════════

import { Resource, ProviderAdapter } from '../domain/entities';

// ═══════════════════════════════════════════════════════════
// REPOSITORY INTERFACES
// ═══════════════════════════════════════════════════════════

export interface IResourceRepository {
  findById(id: string): Promise<Resource | null>;
  findByUserId(userId: string): Promise<Resource[]>;
  findByProviderId(providerId: string): Promise<Resource[]>;
  findByOrderId(orderId: string): Promise<Resource[]>;
  create(resource: Omit<Resource, 'id'>): Promise<Resource>;
  update(id: string, data: Partial<Resource>): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface IProviderAdapter {
  createInstance(input: { specs: any; name: string }): Promise<{
    externalId: string;
    ipAddress: string;
  }>;
  deleteInstance(externalId: string): Promise<void>;
  getInstanceStatus(externalId: string): Promise<string>;
  resizeInstance(externalId: string, specs: any): Promise<void>;
}

// ═══════════════════════════════════════════════════════════
// REPOSITORY IMPLEMENTATIONS
// ═══════════════════════════════════════════════════════════

export class ResourceRepository implements IResourceRepository {
  private resources: Map<string, Resource> = new Map();

  async findById(id: string): Promise<Resource | null> {
    return this.resources.get(id) || null;
  }

  async findByUserId(userId: string): Promise<Resource[]> {
    return Array.from(this.resources.values()).filter(r => r.userId === userId);
  }

  async findByProviderId(providerId: string): Promise<Resource[]> {
    return Array.from(this.resources.values()).filter(r => r.providerId === providerId);
  }

  async findByOrderId(orderId: string): Promise<Resource[]> {
    return Array.from(this.resources.values()).filter(r => r.orderId === orderId);
  }

  async create(resource: Omit<Resource, 'id'>): Promise<Resource> {
    const newResource: Resource = {
      ...resource,
      id: crypto.randomUUID(),
    };
    this.resources.set(newResource.id, newResource);
    return newResource;
  }

  async update(id: string, data: Partial<Resource>): Promise<void> {
    const resource = this.resources.get(id);
    if (!resource) throw new Error('Resource not found');
    this.resources.set(id, { ...resource, ...data });
  }

  async delete(id: string): Promise<void> {
    this.resources.delete(id);
  }
}

// ═══════════════════════════════════════════════════════════
// PROVIDER ADAPTERS
// ═══════════════════════════════════════════════════════════

export class InternalProviderAdapter implements IProviderAdapter {
  async createInstance(input: { specs: any; name: string }) {
    // Call internal API to create VM
    console.log('[InternalProvider] Creating instance:', input.name);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      externalId: `INT-${crypto.randomUUID().slice(0, 8)}`,
      ipAddress: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
    };
  }

  async deleteInstance(externalId: string) {
    console.log('[InternalProvider] Deleting instance:', externalId);
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  async getInstanceStatus(externalId: string) {
    return 'running';
  }

  async resizeInstance(externalId: string, specs: any) {
    console.log('[InternalProvider] Resizing instance:', externalId, specs);
  }
}

export class HetznerProviderAdapter implements IProviderAdapter {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async createInstance(input: { specs: any; name: string }) {
    // Call Hetzner API
    console.log('[HetznerProvider] Creating instance:', input.name);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      externalId: `HTZ-${crypto.randomUUID().slice(0, 8)}`,
      ipAddress: `88.99.${Math.floor(Math.random() * 254) + 1}.${Math.floor(Math.random() * 254) + 1}`,
    };
  }

  async deleteInstance(externalId: string) {
    console.log('[HetznerProvider] Deleting instance:', externalId);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  async getInstanceStatus(externalId: string) {
    return 'running';
  }

  async resizeInstance(externalId: string, specs: any) {
    console.log('[HetznerProvider] Resizing instance:', externalId, specs);
  }
}

export class AwsProviderAdapter implements IProviderAdapter {
  private accessKey: string;
  private secretKey: string;
  private region: string;

  constructor(accessKey: string, secretKey: string, region: string) {
    this.accessKey = accessKey;
    this.secretKey = secretKey;
    this.region = region;
  }

  async createInstance(input: { specs: any; name: string }) {
    // Call AWS API
    console.log('[AWSProvider] Creating instance:', input.name);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    return {
      externalId: `i-${crypto.randomUUID().slice(0, 17)}`,
      ipAddress: `13.250.${Math.floor(Math.random() * 254) + 1}.${Math.floor(Math.random() * 254) + 1}`,
    };
  }

  async deleteInstance(externalId: string) {
    console.log('[AWSProvider] Terminating instance:', externalId);
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  async getInstanceStatus(externalId: string) {
    return 'running';
  }

  async resizeInstance(externalId: string, specs: any) {
    console.log('[AWSProvider] Modifying instance:', externalId, specs);
  }
}
