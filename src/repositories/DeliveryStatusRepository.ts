import { DeliveryStatus, IDeliveryStatus } from '../models/DeliveryStatus';

export class DeliveryStatusRepository {
  async create(deliveryStatusData: Partial<IDeliveryStatus>): Promise<IDeliveryStatus> {
    const deliveryStatus = new DeliveryStatus(deliveryStatusData);
    return await deliveryStatus.save();
  }

  async findAll(): Promise<IDeliveryStatus[]> {
    return await DeliveryStatus.find().sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<IDeliveryStatus | null> {
    return await DeliveryStatus.findById(id);
  }

  async findByOrderId(orderId: string): Promise<IDeliveryStatus[]> {
    return await DeliveryStatus.find({ orderId }).sort({ createdAt: -1 });
  }

  async update(id: string, deliveryStatusData: Partial<IDeliveryStatus>): Promise<IDeliveryStatus | null> {
    return await DeliveryStatus.findByIdAndUpdate(
      id,
      deliveryStatusData,
      { new: true, runValidators: true }
    );
  }

  async updateStatus(id: string, status: string): Promise<IDeliveryStatus | null> {
    const updateData: any = { status };
    return await DeliveryStatus.findByIdAndUpdate(id, updateData);
  }
}