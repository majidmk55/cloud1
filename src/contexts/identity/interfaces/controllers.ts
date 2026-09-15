// ═══════════════════════════════════════════════════════════
// IDENTITY CONTEXT - Interfaces Layer
// API Controllers & Event Subscribers
// ═══════════════════════════════════════════════════════════

import { RegisterUserUseCase, AssignRoleUseCase, GenerateApiKeyUseCase } from '../application/services';
import { UserRepository } from '../infrastructure/repositories';
import { eventBus, IDENTITY_EVENTS } from '../../../shared/events/EventBus';

// ═══════════════════════════════════════════════════════════
// API CONTROLLERS
// ═══════════════════════════════════════════════════════════

export class IdentityController {
  private registerUserUseCase: RegisterUserUseCase;
  private assignRoleUseCase: AssignRoleUseCase;
  private generateApiKeyUseCase: GenerateApiKeyUseCase;

  constructor() {
    const userRepo = new UserRepository();
    this.registerUserUseCase = new RegisterUserUseCase(userRepo);
    this.assignRoleUseCase = new AssignRoleUseCase(userRepo);
    this.generateApiKeyUseCase = new GenerateApiKeyUseCase(userRepo);
  }

  async register(input: {
    email: string;
    name: string;
    password: string;
    role: 'customer' | 'support' | 'ops' | 'admin';
    tenantId: string;
  }) {
    return this.registerUserUseCase.execute(input);
  }

  async assignRole(userId: string, role: 'customer' | 'support' | 'ops' | 'admin') {
    return this.assignRoleUseCase.execute(userId, role);
  }

  async generateApiKey(userId: string, name: string, permissions: string[]) {
    return this.generateApiKeyUseCase.execute(userId, name, permissions);
  }
}

// ═══════════════════════════════════════════════════════════
// EVENT SUBSCRIBERS
// ═══════════════════════════════════════════════════════════

export class IdentityEventSubscribers {
  constructor() {
    this.setupSubscriptions();
  }

  private setupSubscriptions() {
    // Subscribe to external events if needed
    // For example, when a tenant is created, initialize default roles
  }
}

// ═══════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════

export function initializeIdentityContext() {
  const controller = new IdentityController();
  const subscribers = new IdentityEventSubscribers();
  
  return { controller, subscribers };
}
