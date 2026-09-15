// ═══════════════════════════════════════════════════════════
// IDENTITY CONTEXT - Application Layer
// Use Cases & Services
// ═══════════════════════════════════════════════════════════

import { User, UserRole, ApiKey } from '../domain/entities';
import { IUserRepository } from '../infrastructure/repositories';
import { eventBus, IDENTITY_EVENTS } from '../../../shared/events/EventBus';

// ═══════════════════════════════════════════════════════════
// USE CASES
// ═══════════════════════════════════════════════════════════

export class RegisterUserUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(input: {
    email: string;
    name: string;
    password: string;
    role: UserRole;
    tenantId: string;
  }): Promise<User> {
    // Check if user exists
    const existing = await this.userRepo.findByEmail(input.email);
    if (existing) {
      throw new Error('User already exists');
    }

    // Create user
    const user = await this.userRepo.create({
      email: input.email,
      name: input.name,
      role: input.role,
      tenantId: input.tenantId,
      authProvider: 'local',
      mfaEnabled: false,
      isActive: true,
      createdAt: new Date(),
    });

    // Publish event
    eventBus.publish(
      IDENTITY_EVENTS.USER_CREATED,
      { userId: user.id, email: user.email, role: user.role },
      'identity'
    );

    return user;
  }
}

export class VerifyTokenUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(token: string): Promise<User | null> {
    // Verify JWT token
    // Return user if valid
    return null; // Placeholder
  }
}

export class AssignRoleUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(userId: string, role: UserRole): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    await this.userRepo.update(userId, { role });

    // Publish event
    eventBus.publish(
      IDENTITY_EVENTS.ROLE_ASSIGNED,
      { userId, newRole: role },
      'identity'
    );
  }
}

export class GenerateApiKeyUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(userId: string, name: string, permissions: string[]): Promise<ApiKey> {
    const apiKey: ApiKey = {
      id: crypto.randomUUID(),
      userId,
      name,
      keyHash: 'hashed_key', // Should hash actual key
      permissions,
      createdAt: new Date(),
    };

    await this.userRepo.addApiKey(apiKey);

    eventBus.publish(
      IDENTITY_EVENTS.API_KEY_CREATED,
      { userId, apiKeyId: apiKey.id },
      'identity'
    );

    return apiKey;
  }
}

// ═══════════════════════════════════════════════════════════
// SERVICES
// ═══════════════════════════════════════════════════════════

export class IdentityService {
  constructor(private userRepo: IUserRepository) {}

  async getUserById(userId: string): Promise<User | null> {
    return this.userRepo.findById(userId);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepo.findByEmail(email);
  }

  async verifyToken(token: string): Promise<User | null> {
    // JWT verification logic
    return null;
  }

  async checkPermission(userId: string, resource: string, action: string): Promise<boolean> {
    const user = await this.userRepo.findById(userId);
    if (!user) return false;

    // Check role-based permissions
    // Return true/false
    return true;
  }
}
