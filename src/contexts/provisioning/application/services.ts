// ═══════════════════════════════════════════════════════════
// PROVISIONING CONTEXT - Application Layer
// Use Cases & Services
// ═══════════════════════════════════════════════════════════

import { Resource, ProvisioningJob } from '../domain/entities';
import { IResourceRepository, IProviderAdapter } from '../infrastructure/repositories';
import { eventBus, PROVISIONING_EVENTS, ORDERING_EVENTS } from '../../../shared/events/EventBus';

// ═══════════════════════════════════════════════════════════
// USE CASES
// ═══════════════════════════════════════════════════════════

export class ProvisionResourceUseCase {
  constructor(
    private resourceRepo: IResourceRepository,
    private providerAdapter: IProviderAdapter
  ) {}

  async execute(input: {
    orderId: string;
    userId: string;
    tenantId: string;
    productId: string;
    providerId: string;
    specs: any;
  }): Promise<Resource> {
    // Create resource record
    const resource = await this.resourceRepo.create({
      orderId: input.orderId,
      userId: input.userId,
      tenantId: input.tenantId,
      productId: input.productId,
      providerId: input.providerId,
      providerType: 'internal', // Will be determined by provider
      name: `Resource-${input.orderId}`,
      type: 'vps',
      status: 'provisioning',
      specs: input.specs,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create provisioning job
    const job: ProvisioningJob = {
      id: crypto.randomUUID(),
      resourceId: resource.id,
      action: 'create',
      status: 'running',
      progress: 0,
      logs: ['Starting provisioning...'],
      startedAt: new Date(),
    };

    try {
      // Call provider API
      const providerResult = await this.providerAdapter.createInstance({
        specs: input.specs,
        name: resource.name,
      });

      // Update resource with provider details
      await this.resourceRepo.update(resource.id, {
        externalId: providerResult.externalId,
        ipAddress: providerResult.ipAddress,
        status: 'running',
        updatedAt: new Date(),
      });

      job.status = 'completed';
      job.progress = 100;
      job.completedAt = new Date();
      job.logs.push('Provisioning completed successfully');

      // Publish event
      eventBus.publish(
        PROVISIONING_EVENTS.RESOURCE_PROVISIONED,
        { 
          resourceId: resource.id, 
          orderId: input.orderId,
          userId: input.userId,
          providerId: input.providerId,
        },
        'provisioning'
      );

    } catch (error) {
      job.status = 'failed';
      job.error = error instanceof Error ? error.message : 'Unknown error';
      job.logs.push(`Provisioning failed: ${job.error}`);

      await this.resourceRepo.update(resource.id, {
        status: 'error',
        updatedAt: new Date(),
      });

      eventBus.publish(
        PROVISIONING_EVENTS.RESOURCE_FAILED,
        { resourceId: resource.id, error: job.error },
        'provisioning'
      );
    }

    return resource;
  }
}

export class DeleteResourceUseCase {
  constructor(
    private resourceRepo: IResourceRepository,
    private providerAdapter: IProviderAdapter
  ) {}

  async execute(resourceId: string): Promise<void> {
    const resource = await this.resourceRepo.findById(resourceId);
    if (!resource) throw new Error('Resource not found');

    await this.resourceRepo.update(resourceId, {
      status: 'deleting',
      updatedAt: new Date(),
    });

    try {
      await this.providerAdapter.deleteInstance(resource.externalId!);

      await this.resourceRepo.update(resourceId, {
        status: 'stopped',
        deletedAt: new Date(),
        updatedAt: new Date(),
      });

      eventBus.publish(
        PROVISIONING_EVENTS.RESOURCE_DELETED,
        { resourceId, userId: resource.userId },
        'provisioning'
      );
    } catch (error) {
      await this.resourceRepo.update(resourceId, {
        status: 'error',
        updatedAt: new Date(),
      });
      throw error;
    }
  }
}

// ═══════════════════════════════════════════════════════════
// EVENT SUBSCRIBERS
// ═══════════════════════════════════════════════════════════

export class ProvisioningEventSubscribers {
  constructor(
    private resourceRepo: IResourceRepository,
    private providerAdapter: IProviderAdapter
  ) {
    this.setupSubscriptions();
  }

  private setupSubscriptions() {
    // Subscribe to OrderPaid event from Ordering Context
    eventBus.subscribe(
      ORDERING_EVENTS.PAYMENT_RECEIVED,
      'provisioning',
      async (payload) => {
        console.log('[Provisioning] Received payment event:', payload);
        
        const useCase = new ProvisionResourceUseCase(
          this.resourceRepo,
          this.providerAdapter
        );

        // Provision each item in the order
        for (const item of payload.items) {
          await useCase.execute({
            orderId: payload.orderId,
            userId: payload.userId,
            tenantId: 'tenant-1', // Should come from payload
            productId: item.productId,
            providerId: 'provider-1', // Should be determined by logic
            specs: item.specs,
          });
        }
      }
    );
  }
}

// ═══════════════════════════════════════════════════════════
// SERVICES
// ═══════════════════════════════════════════════════════════

export class ProvisioningService {
  constructor(private resourceRepo: IResourceRepository) {}

  async getResourceById(resourceId: string): Promise<Resource | null> {
    return this.resourceRepo.findById(resourceId);
  }

  async getResourcesByUser(userId: string): Promise<Resource[]> {
    return this.resourceRepo.findByUserId(userId);
  }

  async getResourcesByProvider(providerId: string): Promise<Resource[]> {
    return this.resourceRepo.findByProviderId(providerId);
  }

  async startResource(resourceId: string): Promise<void> {
    await this.resourceRepo.update(resourceId, {
      status: 'running',
      updatedAt: new Date(),
    });
  }

  async stopResource(resourceId: string): Promise<void> {
    await this.resourceRepo.update(resourceId, {
      status: 'stopped',
      updatedAt: new Date(),
    });
  }
}
