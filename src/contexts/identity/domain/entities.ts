// ═══════════════════════════════════════════════════════════
// IDENTITY CONTEXT - Domain Layer
// Entities & Value Objects
// ═══════════════════════════════════════════════════════════

export type UserRole = 'customer' | 'support' | 'ops' | 'admin';
export type AuthProvider = 'local' | 'google' | 'github';

// ═══════════════════════════════════════════════════════════
// ENTITIES
// ═══════════════════════════════════════════════════════════

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  authProvider: AuthProvider;
  mfaEnabled: boolean;
  tenantId: string;
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

export interface Role {
  id: string;
  name: UserRole;
  permissions: Permission[];
  description: string;
}

export interface Permission {
  id: string;
  resource: string;
  action: 'read' | 'write' | 'delete' | 'execute';
}

export interface Tenant {
  id: string;
  name: string;
  plan: 'free' | 'starter' | 'business' | 'enterprise';
  isActive: boolean;
  createdAt: Date;
}

export interface ApiKey {
  id: string;
  userId: string;
  name: string;
  keyHash: string;
  permissions: string[];
  expiresAt?: Date;
  createdAt: Date;
  lastUsed?: Date;
}

export interface MfaToken {
  id: string;
  userId: string;
  secret: string;
  isEnabled: boolean;
  createdAt: Date;
}

// ═══════════════════════════════════════════════════════════
// VALUE OBJECTS
// ═══════════════════════════════════════════════════════════

export interface Email {
  value: string;
  isValid(): boolean;
}

export interface Password {
  hash: string;
  verify(plain: string): boolean;
}

export interface ApiKeyPlain {
  value: string;
  mask(): string;
}
