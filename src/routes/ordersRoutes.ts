import { Router } from 'express';
import { OrdersController } from '../controllers/OrdersController';

export function createOrdersRoutes(ordersController: OrdersController): Router {
  const router = Router();

  // Core order operations - status updates come from delivery events
  router.post('/', (req, res) => ordersController.create(req, res));
  router.get('/', (req, res) => ordersController.getAll(req, res));
  router.get('/:id', (req, res) => ordersController.getById(req, res));

  return router;
}