// ═══════════════════════════════════════════════════════════
// ORDERING CONTEXT - Infrastructure Layer
// Repositories
// ═══════════════════════════════════════════════════════════

import { Order, Product } from '../domain/entities';

// ═══════════════════════════════════════════════════════════
// REPOSITORY INTERFACES
// ═══════════════════════════════════════════════════════════

export interface IOrderRepository {
  findById(id: string): Promise<Order | null>;
  findByUserId(userId: string): Promise<Order[]>;
  findByTenantId(tenantId: string): Promise<Order[]>;
  create(order: Omit<Order, 'id'>): Promise<Order>;
  update(id: string, data: Partial<Order>): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  findByCategory(category: string): Promise<Product[]>;
  findAll(): Promise<Product[]>;
  create(product: Omit<Product, 'id'>): Promise<Product>;
  update(id: string, data: Partial<Product>): Promise<void>;
}

// ═══════════════════════════════════════════════════════════
// REPOSITORY IMPLEMENTATIONS
// ═══════════════════════════════════════════════════════════

export class OrderRepository implements IOrderRepository {
  private orders: Map<string, Order> = new Map();

  async findById(id: string): Promise<Order | null> {
    return this.orders.get(id) || null;
  }

  async findByUserId(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(o => o.userId === userId);
  }

  async findByTenantId(tenantId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(o => o.tenantId === tenantId);
  }

  async create(order: Omit<Order, 'id'>): Promise<Order> {
    const newOrder: Order = {
      ...order,
      id: crypto.randomUUID(),
    };
    this.orders.set(newOrder.id, newOrder);
    return newOrder;
  }

  async update(id: string, data: Partial<Order>): Promise<void> {
    const order = this.orders.get(id);
    if (!order) throw new Error('Order not found');
    this.orders.set(id, { ...order, ...data });
  }

  async delete(id: string): Promise<void> {
    this.orders.delete(id);
  }
}

export class ProductRepository implements IProductRepository {
  private products: Map<string, Product> = new Map();

  async findById(id: string): Promise<Product | null> {
    return this.products.get(id) || null;
  }

  async findByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.category === category);
  }

  async findAll(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async create(product: Omit<Product, 'id'>): Promise<Product> {
    const newProduct: Product = {
      ...product,
      id: crypto.randomUUID(),
    };
    this.products.set(newProduct.id, newProduct);
    return newProduct;
  }

  async update(id: string, data: Partial<Product>): Promise<void> {
    const product = this.products.get(id);
    if (!product) throw new Error('Product not found');
    this.products.set(id, { ...product, ...data });
  }
}
