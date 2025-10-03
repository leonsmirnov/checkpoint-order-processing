import { Orders, IOrders } from '../models/Orders';

export class OrdersRepository {
  async create(ordersData: Partial<IOrders>): Promise<IOrders> {
    const orders = new Orders(ordersData);
    return await orders.save();
  }

  async findAll(): Promise<IOrders[]> {
    return await Orders.find().sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<IOrders | null> {
    return await Orders.findById(id);
  }

  async findByCustomerId(customerId: string): Promise<IOrders[]> {
    return await Orders.find({ customerId }).sort({ orderDate: -1 });
  }

  async findByStatus(status: string): Promise<IOrders[]> {
    return await Orders.find({ status }).sort({ orderDate: -1 });
  }

  async update(id: string, ordersData: Partial<IOrders>): Promise<IOrders | null> {
    return await Orders.findByIdAndUpdate(
      id,
      ordersData,
      { new: true, runValidators: true }
    );
  }

  async updateStatus(id: string, status: string): Promise<IOrders | null> {
    return await Orders.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
  }

  async delete(id: string): Promise<boolean> {
    const result = await Orders.findByIdAndDelete(id);
    return result !== null;
  }

}