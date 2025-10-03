import { OrdersRepository } from '../repositories/OrdersRepository';
import { ProductService } from './ProductService';
import { EventService, DeliveryStatusChangedEvent } from './EventService';
import { IOrders } from '../models/Orders';

export class OrdersService {
  private ordersRepository: OrdersRepository;
  private productService: ProductService;
  private eventService: EventService;

  constructor(ordersRepository: OrdersRepository, productService: ProductService) {
    this.ordersRepository = ordersRepository;
    this.productService = productService;
    this.eventService = EventService.getInstance();
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Listen for delivery status changes to update orders reliably and promptly
    this.eventService.on('deliveryStatusChanged', async (event: DeliveryStatusChangedEvent) => {
      try {
        const orderStatus = this.mapDeliveryStatusToOrderStatus(event.newStatus);
        await this.updateOrderStatus(event.orderId, orderStatus);
        console.log(`Order ${event.orderId} status updated to ${orderStatus} based on delivery status change from ${event.oldStatus} to ${event.newStatus}`);
      } catch (error) {
        console.error(`Failed to update order status for orderId ${event.orderId} based on delivery status change:`, error);
        // Consider implementing retry logic or dead letter queue for failed status updates
      }
    });
  }

  private mapDeliveryStatusToOrderStatus(deliveryStatus: string): string {
    // Map delivery statuses to order statuses
    switch (deliveryStatus) {
      case 'Pending Shipment':
        return 'Pending Shipment';
      case 'shipped':
        return 'shipped';
      case 'delivered':
        return 'delivered';
      default:
        return 'Pending Shipment';
    }
  }

  async createOrders(ordersData: Partial<IOrders>): Promise<IOrders> {
    // Validate required fields
    if (!ordersData.productId || !ordersData.quantity || !ordersData.totalAmount || !ordersData.orderDate) {
      throw new Error('Missing required fields: productId, quantity, totalAmount, orderDate');
    }

    if (ordersData.quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    if (ordersData.totalAmount <= 0) {
      throw new Error('Total amount must be greater than 0');
    }

    // Check if product exists and has enough stock
    const product = await this.productService.getProductById(ordersData.productId);
    if (!product) {
      throw new Error(`Product with ID ${ordersData.productId} not found`);
    }

    if (product.stockQuantity < ordersData.quantity) {
      throw new Error(`Not enough ${product.name} in stock. Available: ${product.stockQuantity}, Requested: ${ordersData.quantity}`);
    }

    return await this.ordersRepository.create(ordersData);
  }

  async getAllOrders(): Promise<IOrders[]> {
    return await this.ordersRepository.findAll();
  }

  async getOrdersById(id: string): Promise<IOrders | null> {
    return await this.ordersRepository.findById(id);
  }

  async updateOrderStatus(id: string, status: string): Promise<IOrders | null> {
    const validStatuses = ['Pending Shipment', 'shipped', 'delivered'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    return await this.ordersRepository.updateStatus(id, status);
  }
}