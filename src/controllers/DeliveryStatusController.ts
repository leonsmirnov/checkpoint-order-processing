import { Request, Response } from 'express';
import { DeliveryStatusService } from '../services/DeliveryStatusService';

export class DeliveryStatusController {
  private deliveryStatusService: DeliveryStatusService;

  constructor(deliveryStatusService: DeliveryStatusService) {
    this.deliveryStatusService = deliveryStatusService;
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const deliveryStatus = await this.deliveryStatusService.createDeliveryStatus(req.body);
      res.status(201).json(deliveryStatus);
    } catch (error) {
      console.error('Delivery status creation error:', error);
      res.status(500).json({ 
        error: 'Failed to create delivery status',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const deliveryStatus = await this.deliveryStatusService.updateDeliveryStatus(req.params.id, req.body);
      if (!deliveryStatus) {
        res.status(404).json({ error: 'Delivery status not found' });
        return;
      }
      res.json(deliveryStatus);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update delivery status' });
    }
  }
}