// ═══════════════════════════════════════════════════════════
// ABRAN SYSTEM - DDD Context Types
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// CONTEXT 1: IDENTITY CONTEXT
// ═══════════════════════════════════════════════════════════
export type UserRole = 'customer' | 'support' | 'ops' | 'admin';
export type AuthProvider = 'local' | 'google' | 'github';

export interface IdentityUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  authProvider: AuthProvider;
  mfaEnabled: boolean;
  tenantId: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface IdentityRole {
  id: string;
  name: string;
  permissions: string[];
  description: string;
}

export interface ApiKey {
  id: string;
  userId: string;
  name: string;
  key: string;
  permissions: string[];
  expiresAt?: string;
  createdAt: string;
  lastUsed?: string;
}

// ═══════════════════════════════════════════════════════════
// CONTEXT 2: ORDERING CONTEXT
// ═══════════════════════════════════════════════════════════
export type OrderStatus = 'pending' | 'processing' | 'active' | 'cancelled' | 'completed';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  hourlyPrice: number;
  monthlyPrice: number;
  specs: Record<string, any>;
  providerType: 'internal' | 'local' | 'international';
}

// ═══════════════════════════════════════════════════════════
// CONTEXT 3: PROVISIONING CONTEXT
// ═══════════════════════════════════════════════════════════
export type ResourceStatus = 'provisioning' | 'running' | 'stopped' | 'error' | 'deleting';
export type ProvisioningJobStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface ProvisioningResource {
  id: string;
  orderId: string;
  userId: string;
  productId: string;
  providerId: string;
  externalId?: string;
  status: ResourceStatus;
  specs: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ProvisioningJob {
  id: string;
  resourceId: string;
  action: 'create' | 'delete' | 'migrate' | 'resize';
  status: ProvisioningJobStatus;
  progress: number;
  logs: string[];
  startedAt: string;
  completedAt?: string;
  error?: string;
}

// ═══════════════════════════════════════════════════════════
// CONTEXT 4: PLATFORM OPS CONTEXT
// ═══════════════════════════════════════════════════════════
export type WorkflowStatus = 'pending' | 'running' | 'completed' | 'failed';
export type NotificationType = 'email' | 'sms' | 'webhook';

export interface Workflow {
  id: string;
  name: string;
  status: WorkflowStatus;
  steps: WorkflowStep[];
  currentStep: number;
  startedAt: string;
  completedAt?: string;
}

export interface WorkflowStep {
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt?: string;
  completedAt?: string;
}

export interface ScheduledTask {
  id: string;
  name: string;
  cronExpression: string;
  lastRun?: string;
  nextRun: string;
  isActive: boolean;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource?: string;
  details: Record<string, any>;
  ipAddress: string;
  timestamp: string;
}

// ═══════════════════════════════════════════════════════════
// CONTEXT 5: POLICY CONTEXT
// ═══════════════════════════════════════════════════════════
export interface Policy {
  id: string;
  name: string;
  description: string;
  condition: string;
  action: 'allow' | 'deny' | 'warn';
  isActive: boolean;
}

export interface Quota {
  id: string;
  userId: string;
  resourceType: string;
  limit: number;
  used: number;
  warningThreshold: number;
}

export interface ComplianceFlag {
  id: string;
  resourceId: string;
  rule: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  createdAt: string;
  resolved: boolean;
}

// ═══════════════════════════════════════════════════════════
// CONTEXT 6: CONFIG & TEMPLATE CONTEXT
// ═══════════════════════════════════════════════════════════
export interface Template {
  id: string;
  name: string;
  category: 'os' | 'app' | 'custom';
  description: string;
  version: string;
  config: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface SSHKey {
  id: string;
  userId: string;
  name: string;
  publicKey: string;
  fingerprint: string;
  createdAt: string;
}

export interface ConfigParameter {
  id: string;
  key: string;
  value: string;
  encrypted: boolean;
  description: string;
  updatedAt: string;
}

// ═══════════════════════════════════════════════════════════
// CONTEXT 7: INVENTORY (CMDB) CONTEXT
// ═══════════════════════════════════════════════════════════
export type AssetType = 'server' | 'vps' | 'gpu' | 'storage' | 'network' | 'ip';

export interface InventoryItem {
  id: string;
  type: AssetType;
  name: string;
  providerId: string;
  externalId?: string;
  specs: Record<string, any>;
  status: string;
  relationships: AssetRelationship[];
  createdAt: string;
  updatedAt: string;
}

export interface AssetRelationship {
  fromId: string;
  toId: string;
  type: 'runs_on' | 'uses_ip' | 'attached_to' | 'connected_to';
}

export interface HardwareAsset {
  id: string;
  type: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  warrantyEnd?: string;
  location: string;
  status: 'active' | 'maintenance' | 'retired';
}
