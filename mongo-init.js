// MongoDB initialization script
db = db.getSiblingDB('checkpoint_order_processing');

// Create collections
db.createCollection('orders');
db.createCollection('delivery-status');
db.createCollection('products');

// Insert sample products data
db.products.insertMany([
  {
    name: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 200,
    stockQuantity: 25,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Smart Fitness Tracker",
    description: "Advanced fitness tracker with heart rate monitoring",
    stockQuantity: 15,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Organic Cotton T-Shirt",
    description: "100% organic cotton comfortable t-shirt",
    stockQuantity: 50,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Stainless Steel Water Bottle",
    description: "Insulated stainless steel water bottle, 32oz",
    price: 40,
    stockQuantity: 30,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Premium Coffee Beans",
    description: "Single-origin premium coffee beans, 1lb bag",
    price: 25,
    stockQuantity: 100,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Gaming Mechanical Keyboard",
    description: "RGB mechanical keyboard for gaming",
    price: 130,
    stockQuantity: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Insert sample orders data with simplified single-product structure
db.orders.insertMany([
  {
    productId: "6730b2c8d5e8f1234567890a", // Reference to first product
    quantity: 2,
    totalAmount: 400,
    status: "delivered",
    orderDate: new Date("2024-01-15"),
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15")
  },
  {
    productId: "6730b2c8d5e8f1234567890b", // Reference to second product  
    quantity: 1,
    totalAmount: 40,
    status: "Pending Shipment",
    orderDate: new Date("2024-01-16"),
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-16")
  }
]);

// Insert sample delivery status data
const sampleOrderId = new ObjectId();
db['delivery-status'].insertMany([
  {
    orderId: sampleOrderId.toString(),
    status: "shipped",
    createdAt: new Date("2024-01-17"),
    updatedAt: new Date("2024-01-17")
  }
]);

print('Database initialized successfully with sample data');
print('Sample data includes:');
print('- 6 Products (with various stock levels)');
print('- 2 Orders (single product each)');
print('- 1 Delivery status record');