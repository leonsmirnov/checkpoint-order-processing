import { Schema, model, Document } from 'mongoose';

export interface IOrders extends Document {
  _id: string;
  productId: string;
  quantity: number;
  totalAmount: number;
  status: string;
  orderDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ordersSchema = new Schema<IOrders>({
  productId: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending Shipment', 'shipped', 'delivered'],
    default: 'Pending Shipment',
    index: true
  },
  orderDate: {
    type: Date,
    required: true,
    index: true
  }
}, {
  timestamps: true
});

export const Orders = model<IOrders>('Orders', ordersSchema);