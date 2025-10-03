import { Schema, model, Document } from 'mongoose';

export interface IProduct extends Document {
  _id: string;
  name: string;
  description: string;
  stockQuantity: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  stockQuantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
}, {
  timestamps: true
});

export const Product = model<IProduct>('Product', productSchema);