import { Request, Response } from 'express';
import { OrdersService } from '../services/OrdersService';

export class OrdersController {
  private ordersService: OrdersService;

  constructor(ordersService: OrdersService) {
    this.ordersService = ordersService;
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const orders = await this.ordersService.createOrders(req.body);
      res.status(201).json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create orders' });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const orders = await this.ordersService.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const orders = await this.ordersService.getOrdersById(req.params.id);
      if (!orders) {
        res.status(404).json({ error: 'Orders not found' });
        return;
      }
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  }
}