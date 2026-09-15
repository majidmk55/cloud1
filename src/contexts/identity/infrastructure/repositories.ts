// ═══════════════════════════════════════════════════════════
// IDENTITY CONTEXT - Infrastructure Layer
// Repositories & External Integrations
// ═══════════════════════════════════════════════════════════

import { User, ApiKey } from '../domain/entities';

// ═══════════════════════════════════════════════════════════
// REPOSITORY INTERFACES
// ═══════════════════════════════════════════════════════════

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByTenantId(tenantId: string): Promise<User[]>;
  create(user: Omit<User, 'id'>): Promise<User>;
  update(id: string, data: Partial<User>): Promise<void>;
  delete(id: string): Promise<void>;
  addApiKey(apiKey: ApiKey): Promise<void>;
  revokeApiKey(apiKeyId: string): Promise<void>;
}

// ═══════════════════════════════════════════════════════════
// REPOSITORY IMPLEMENTATIONS (Prisma/TypeORM)
// ═══════════════════════════════════════════════════════════

export class UserRepository implements IUserRepository {
  // In real implementation, this would use Prisma/TypeORM
  // For now, using in-memory storage for demo

  private users: Map<string, User> = new Map();
  private apiKeys: Map<string, ApiKey> = new Map();

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) return user;
    }
    return null;
  }

  async findByTenantId(tenantId: string): Promise<User[]> {
    return Array.from(this.users.values()).filter(u => u.tenantId === tenantId);
  }

  async create(user: Omit<User, 'id'>): Promise<User> {
    const newUser: User = {
      ...user,
      id: crypto.randomUUID(),
    };
    this.users.set(newUser.id, newUser);
    return newUser;
  }

  async update(id: string, data: Partial<User>): Promise<void> {
    const user = this.users.get(id);
    if (!user) throw new Error('User not found');
    
    this.users.set(id, { ...user, ...data });
  }

  async delete(id: string): Promise<void> {
    this.users.delete(id);
  }

  async addApiKey(apiKey: ApiKey): Promise<void> {
    this.apiKeys.set(apiKey.id, apiKey);
  }

  async revokeApiKey(apiKeyId: string): Promise<void> {
    this.apiKeys.delete(apiKeyId);
  }
}

// ═══════════════════════════════════════════════════════════
// EXTERNAL INTEGRATIONS
// ═══════════════════════════════════════════════════════════

export class OAuthProvider {
  async verifyGoogleToken(token: string): Promise<{ email: string; name: string } | null> {
    // Verify Google OAuth token
    return null;
  }

  async verifyGitHubToken(token: string): Promise<{ email: string; name: string } | null> {
    // Verify GitHub OAuth token
    return null;
  }
}

export class MfaService {
  generateSecret(): string {
    // Generate TOTP secret
    return 'secret';
  }

  verifyCode(secret: string, code: string): boolean {
    // Verify TOTP code
    return true;
  }
}
