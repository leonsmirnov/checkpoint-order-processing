import { Schema, model, Document } from 'mongoose';

export interface IDeliveryStatus extends Document {
  _id: string;
  orderId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const deliveryStatusSchema = new Schema<IDeliveryStatus>({
  orderId: {
    type: String,
    required: true,
    index: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending Shipment', 'shipped', 'delivered'],
    default: 'Pending Shipment',
    index: true
  }
}, {
  timestamps: true
});

export const DeliveryStatus = model<IDeliveryStatus>('DeliveryStatus', deliveryStatusSchema, 'delivery-status');