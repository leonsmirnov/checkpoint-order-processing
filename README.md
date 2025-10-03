# checkpoint-order-processing

## How to Build and Run the Project

### Prerequisites
- Node.js, tested on v22.18.0
- npm
- MongoDB (or use Docker Compose which includes MongoDB)

### Local Development
1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the TypeScript project:
   ```bash
   npm run build
   ```

3. Start the application:
   ```bash
   npm start
   ```

The API will be available at `http://localhost:3000`

## Docker Deployment

### Deploy with Docker Compose
The easiest way to run the entire application stack (API + MongoDB) is using Docker Compose:

```bash
# Build and start all services in detached mode
docker compose up -d --build

# View logs
docker compose logs -f

# Stop all services
docker compose down
```

This will:
- Build the Node.js application container
- Start MongoDB container
- Set up networking between containers
- Expose the API on `http://localhost:3000`

## API Endpoints

### Products
- `POST /api/products` - Create a new product
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID

### Orders
- `POST /api/orders` - Create a new order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID

### Delivery Status
- `POST /api/delivery-status` - Create delivery status
- `PUT /api/delivery-status/:id` - Update delivery status