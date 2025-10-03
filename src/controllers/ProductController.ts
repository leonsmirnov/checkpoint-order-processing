import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';

export class ProductController {
  private productService: ProductService;

  constructor(productService: ProductService) {
    this.productService = productService;
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const product = await this.productService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof Error && error.message === 'Product with this SKU already exists') {
        res.status(409).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to create product' });
      }
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      
      const products = await this.productService.getAllProducts();
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get all products' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const product = await this.productService.getProductById(req.params.id);
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  }
}