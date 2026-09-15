// ═══════════════════════════════════════════════════════════
// ORDERING CONTEXT - Domain Layer
// Entities & Value Objects
// ═══════════════════════════════════════════════════════════

export type OrderStatus = 'pending' | 'processing' | 'active' | 'cancelled' | 'completed';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type BillingCycle = 'hourly' | 'monthly' | 'yearly';

// ═══════════════════════════════════════════════════════════
// ENTITIES
// ═══════════════════════════════════════════════════════════

export interface Product {
  id: string;
  name: string;
  category: 'cloud' | 'vps' | 'ai' | 'storage' | 'network' | 'database' | 'enterprise';
  description: string;
  specs: Record<string, any>;
  pricing: Pricing;
  providerType: 'internal' | 'local' | 'international';
  isActive: boolean;
  createdAt: Date;
}

export interface Pricing {
  hourly: number;
  monthly: number;
  yearly: number;
  currency: string;
}

export interface Order {
  id: string;
  userId: string;
  tenantId: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentStatus: PaymentStatus;
  billingCycle: BillingCycle;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specs: Record<string, any>;
}

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  addedAt: Date;
}

export interface Invoice {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'draft' | 'issued' | 'paid' | 'overdue' | 'cancelled';
  issuedAt: Date;
  dueAt: Date;
  paidAt?: Date;
}

// ═══════════════════════════════════════════════════════════
// VALUE OBJECTS
// ═══════════════════════════════════════════════════════════

export interface Money {
  amount: number;
  currency: string;
  add(other: Money): Money;
  subtract(other: Money): Money;
}

export interface OrderId {
  value: string;
  toString(): string;
}
