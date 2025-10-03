import express from 'express';
import { Database } from './config/database';
import { OrdersRepository } from './repositories/OrdersRepository';
import { DeliveryStatusRepository } from './repositories/DeliveryStatusRepository';
import { ProductRepository } from './repositories/ProductRepository';
import { OrdersService } from './services/OrdersService';
import { DeliveryStatusService } from './services/DeliveryStatusService';
import { ProductService } from './services/ProductService';
import { OrdersController } from './controllers/OrdersController';
import { DeliveryStatusController } from './controllers/DeliveryStatusController';
import { ProductController } from './controllers/ProductController';
import { createOrdersRoutes } from './routes/ordersRoutes';
import { createDeliveryStatusRoutes } from './routes/deliveryStatusRoutes';
import { createProductRoutes } from './routes/productRoutes';

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';

// Middleware
app.use(express.json());

async function initializeApp() {
  try {
    // Connect to database
    const database = Database.getInstance();
    await database.connect(MONGODB_URI);

    // Initialize repositories (no need to pass db instance with Mongoose)
    const ordersRepository = new OrdersRepository();
    const deliveryStatusRepository = new DeliveryStatusRepository();
    const productRepository = new ProductRepository();

    // Initialize services
    const productService = new ProductService(productRepository);
    const ordersService = new OrdersService(ordersRepository, productService);
    const deliveryStatusService = new DeliveryStatusService(deliveryStatusRepository);

    // Initialize controllers
    const ordersController = new OrdersController(ordersService);
    const deliveryStatusController = new DeliveryStatusController(deliveryStatusService);
    const productController = new ProductController(productService);

    // Setup routes
    app.use('/api/orders', createOrdersRoutes(ordersController));
    app.use('/api/delivery-status', createDeliveryStatusRoutes(deliveryStatusController));
    app.use('/api/products', createProductRoutes(productController));

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        database: database.isConnected() ? 'connected' : 'disconnected'
      });
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Health check available at http://localhost:${PORT}/health`);
    });

  } catch (error) {
    console.error('Failed to initialize app:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  const database = Database.getInstance();
  await database.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  const database = Database.getInstance();
  await database.disconnect();
  process.exit(0);
});

initializeApp();