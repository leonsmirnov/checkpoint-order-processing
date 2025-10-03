import { Product, IProduct } from '../models/Product';

export class ProductRepository {
  async create(productData: Partial<IProduct>): Promise<IProduct> {
    const product = new Product(productData);
    return await product.save();
  }

  async findAll(): Promise<IProduct[]> {
    return await Product.find().sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<IProduct | null> {
    return await Product.findById(id);
  }

  async findByCategory(category: string): Promise<IProduct[]> {
    return await Product.find({ category }).sort({ name: 1 });
  }

  async findInStockQuantity(): Promise<IProduct[]> {
    return await Product.find({ stockQuantity: { $gt: 0 } }).sort({ name: 1 });
  }

  async update(id: string, productData: Partial<IProduct>): Promise<IProduct | null> {
    return await Product.findByIdAndUpdate(
      id,
      productData,
      { new: true, runValidators: true }
    );
  }

  async updateStock(id: string, stockQuantity: number): Promise<IProduct | null> {
    return await Product.findByIdAndUpdate(
      id,
      { 
        stockQuantity,
        inStock: stockQuantity > 0 
      },
      { new: true, runValidators: true }
    );
  }

  async adjustStock(id: string, adjustment: number): Promise<IProduct | null> {
    const product = await Product.findById(id);
    if (!product) return null;

    const newQuantity = Math.max(0, product.stockQuantity + adjustment);
    return await this.updateStock(id, newQuantity);
  }

  async delete(id: string): Promise<boolean> {
    const result = await Product.findByIdAndDelete(id);
    return result !== null;
  }
}