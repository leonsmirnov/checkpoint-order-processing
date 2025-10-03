import { ProductRepository } from '../repositories/ProductRepository';
import { IProduct } from '../models/Product';

export class ProductService {
  private productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  async createProduct(productData: Partial<IProduct>): Promise<IProduct> {
    // Validate required fields
    if (!productData.name || !productData.stockQuantity) {
      throw new Error('Missing required fields: name, description, price, category, sku');
    }

    if (productData.stockQuantity !== undefined && productData.stockQuantity < 0) {
      throw new Error('Stock quantity cannot be negative');
    }

    return await this.productRepository.create(productData);
  }

  async getAllProducts(): Promise<IProduct[]> {
    return await this.productRepository.findAll();
  }

  async getProductById(id: string): Promise<IProduct | null> {
    return await this.productRepository.findById(id);
  }

  async updateProductStock(id: string, stockQuantity: number): Promise<IProduct | null> {
    if (stockQuantity < 0) {
      throw new Error('Stock quantity cannot be negative');
    }
    
    return await this.productRepository.updateStock(id, stockQuantity);
  }

  async adjustProductStock(id: string, adjustment: number): Promise<IProduct | null> {
    return await this.productRepository.adjustStock(id, adjustment);
  }
}