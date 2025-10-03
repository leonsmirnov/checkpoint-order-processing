import { DeliveryStatusRepository } from '../repositories/DeliveryStatusRepository';
import { EventService } from './EventService';
import { IDeliveryStatus } from '../models/DeliveryStatus';

export class DeliveryStatusService {
  private deliveryStatusRepository: DeliveryStatusRepository;
  private eventService: EventService;

  constructor(deliveryStatusRepository: DeliveryStatusRepository) {
    this.deliveryStatusRepository = deliveryStatusRepository;
    this.eventService = EventService.getInstance();
  }

  async createDeliveryStatus(deliveryStatusData: Partial<IDeliveryStatus>): Promise<IDeliveryStatus> {
    // Validate required fields
    if (!deliveryStatusData.orderId || !deliveryStatusData.status) {
      throw new Error('Missing required fields: orderId, status');
    }

    // Validate status - match the model enum
    const validStatuses = ['Pending Shipment', 'shipped', 'delivered'];
    if (!validStatuses.includes(deliveryStatusData.status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    return await this.deliveryStatusRepository.create(deliveryStatusData);
  }

  async getDeliveryStatusByOrderId(orderId: string): Promise<IDeliveryStatus[]> {
    return await this.deliveryStatusRepository.findByOrderId(orderId);
  }

  async updateDeliveryStatus(id: string, deliveryStatusData: Partial<IDeliveryStatus>): Promise<IDeliveryStatus | null> {
    // Validate status if provided
    if (deliveryStatusData.status) {
      const validStatuses = ['Pending Shipment', 'shipped', 'delivered'];
      if (!validStatuses.includes(deliveryStatusData.status)) {
        throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      }
    }

    // Get current status before update
    const currentDeliveryStatus = await this.deliveryStatusRepository.findById(id);
    const oldStatus = currentDeliveryStatus?.status || 'unknown';

    const updatedDeliveryStatus = await this.deliveryStatusRepository.update(id, deliveryStatusData);
    
    // Emit event for status changes to be propagated reliably and promptly
    if (updatedDeliveryStatus && deliveryStatusData.status && deliveryStatusData.status !== oldStatus) {
      this.eventService.emitDeliveryStatusChanged({
        deliveryStatusId: id,
        orderId: updatedDeliveryStatus.orderId,
        oldStatus,
        newStatus: deliveryStatusData.status,
        timestamp: new Date()
      });
    }

    return updatedDeliveryStatus;
  }

  async updateStatus(id: string, status: string): Promise<IDeliveryStatus | null> {
    const validStatuses = ['Pending Shipment', 'shipped', 'delivered'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    // Get current status before update
    const currentDeliveryStatus = await this.deliveryStatusRepository.findById(id);
    const oldStatus = currentDeliveryStatus?.status || 'unknown';

    const updatedDeliveryStatus = await this.deliveryStatusRepository.updateStatus(id, status);
    
    // Emit event for status changes to be propagated reliably and promptly
    if (updatedDeliveryStatus && status !== oldStatus) {
      this.eventService.emitDeliveryStatusChanged({
        deliveryStatusId: id,
        orderId: updatedDeliveryStatus.orderId,
        oldStatus,
        newStatus: status,
        timestamp: new Date()
      });
    }

    return updatedDeliveryStatus;
  }
}