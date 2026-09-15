// ═══════════════════════════════════════════════════════════
// ORDERING CONTEXT - Application Layer
// Use Cases & Services
// ═══════════════════════════════════════════════════════════

import { Order, OrderItem, CartItem, Product } from '../domain/entities';
import { IOrderRepository, IProductRepository } from '../infrastructure/repositories';
import { eventBus, ORDERING_EVENTS } from '../../../shared/events/EventBus';

// ═══════════════════════════════════════════════════════════
// USE CASES
// ═══════════════════════════════════════════════════════════

export class CreateOrderUseCase {
  constructor(
    private orderRepo: IOrderRepository,
    private productRepo: IProductRepository
  ) {}

  async execute(input: {
    userId: string;
    tenantId: string;
    items: Array<{ productId: string; quantity: number }>;
    billingCycle: 'hourly' | 'monthly' | 'yearly';
  }): Promise<Order> {
    // Fetch products
    const products: Product[] = [];
    for (const item of input.items) {
      const product = await this.productRepo.findById(item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      products.push(product);
    }

    // Calculate totals
    const orderItems: OrderItem[] = products.map((product, index) => {
      const quantity = input.items[index].quantity;
      const unitPrice = product.pricing[input.billingCycle];
      return {
        id: crypto.randomUUID(),
        orderId: '', // Will be set after order creation
        productId: product.id,
        productName: product.name,
        quantity,
        unitPrice,
        totalPrice: unitPrice * quantity,
        specs: product.specs,
      };
    });

    const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const tax = subtotal * 0.09; // 9% tax
    const total = subtotal + tax;

    // Create order
    const order = await this.orderRepo.create({
      userId: input.userId,
      tenantId: input.tenantId,
      status: 'pending',
      items: orderItems,
      subtotal,
      discount: 0,
      tax,
      total,
      paymentStatus: 'pending',
      billingCycle: input.billingCycle,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Publish event
    eventBus.publish(
      ORDERING_EVENTS.ORDER_CREATED,
      { orderId: order.id, userId: order.userId, total: order.total },
      'ordering'
    );

    return order;
  }
}

export class ProcessPaymentUseCase {
  constructor(private orderRepo: IOrderRepository) {}

  async execute(orderId: string, paymentMethod: string): Promise<void> {
    const order = await this.orderRepo.findById(orderId);
    if (!order) throw new Error('Order not found');

    // Process payment (integrate with payment gateway)
    // For demo, assume payment succeeds
    const paymentSuccess = true;

    if (paymentSuccess) {
      await this.orderRepo.update(orderId, {
        paymentStatus: 'paid',
        status: 'processing',
        updatedAt: new Date(),
      });

      // Publish event - THIS TRIGGERS PROVISIONING
      eventBus.publish(
        ORDERING_EVENTS.PAYMENT_RECEIVED,
        { 
          orderId: order.id, 
          userId: order.userId, 
          items: order.items,
          billingCycle: order.billingCycle,
        },
        'ordering'
      );
    } else {
      await this.orderRepo.update(orderId, {
        paymentStatus: 'failed',
        updatedAt: new Date(),
      });

      eventBus.publish(
        ORDERING_EVENTS.PAYMENT_FAILED,
        { orderId: order.id, userId: order.userId },
        'ordering'
      );
    }
  }
}

export class CancelOrderUseCase {
  constructor(private orderRepo: IOrderRepository) {}

  async execute(orderId: string, reason: string): Promise<void> {
    const order = await this.orderRepo.findById(orderId);
    if (!order) throw new Error('Order not found');

    if (order.status === 'active') {
      throw new Error('Cannot cancel active order');
    }

    await this.orderRepo.update(orderId, {
      status: 'cancelled',
      updatedAt: new Date(),
    });

    eventBus.publish(
      ORDERING_EVENTS.ORDER_CANCELLED,
      { orderId, reason },
      'ordering'
    );
  }
}

// ═══════════════════════════════════════════════════════════
// SERVICES
// ═══════════════════════════════════════════════════════════

export class OrderingService {
  constructor(
    private orderRepo: IOrderRepository,
    private productRepo: IProductRepository
  ) {}

  async getOrderById(orderId: string): Promise<Order | null> {
    return this.orderRepo.findById(orderId);
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    return this.orderRepo.findByUserId(userId);
  }

  async getProductById(productId: string): Promise<Product | null> {
    return this.productRepo.findById(productId);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return this.productRepo.findByCategory(category);
  }
}
