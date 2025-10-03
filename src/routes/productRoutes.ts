import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';

export function createProductRoutes(productController: ProductController): Router {
  const router = Router();

  // Core operations for inventory management
  router.post('/', (req, res) => productController.create(req, res));
  router.get('/', (req, res) => productController.getAll(req, res));
  router.get('/:id', (req, res) => productController.getById(req, res));

  return router;
}