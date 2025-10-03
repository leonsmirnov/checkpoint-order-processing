import { Router } from 'express';
import { DeliveryStatusController } from '../controllers/DeliveryStatusController';

export function createDeliveryStatusRoutes(deliveryStatusController: DeliveryStatusController): Router {
  const router = Router();

  // Core delivery operations - only creation and updates needed for event-driven workflow
  router.post('/', (req, res) => deliveryStatusController.create(req, res));
  router.put('/:id', (req, res) => deliveryStatusController.update(req, res));

  return router;
}