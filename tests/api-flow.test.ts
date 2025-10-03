import request from 'supertest';

describe('Simplified Order Processing API Flow', () => {
  const baseURL = 'http://localhost:3000';
  let productId: string;
  let orderId: string;
  let deliveryStatusId: string;

  describe('Complete Order Processing Flow', () => {
    it('should complete the simplified order processing flow: create product → create order with stock validation → update delivery status with event propagation', async () => {
      console.log('\n=== Starting Simplified Order Processing Flow Test ===\n');

      // Step 1: Create a product for the order
      console.log('1. Creating product...');
      const productData = {
        name: 'Test Product',
        description: 'Product for testing',
        stockQuantity: 100
      };

      const productResponse = await request(baseURL)
        .post('/api/products')
        .send(productData)
        .expect(201);

      productId = productResponse.body._id;
      console.log(`Product created successfully with ID: ${productId}`);

      expect(productResponse.body).toHaveProperty('_id');
      expect(productResponse.body.name).toBe(productData.name);
      expect(productResponse.body.stockQuantity).toBe(productData.stockQuantity);

      // Step 2: Get product by ID (used by order service for validation)
      console.log('\n3. Getting product by ID...');
      const productByIdResponse = await request(baseURL)
        .get(`/api/products/${productId}`)
        .expect(200);

      expect(productByIdResponse.body._id).toBe(productId);

      // Step 3: Create order with simplified single-product structure
      console.log('\n4. Creating order...');
      const orderData = {
        productId: productId,
        quantity: 2,
        totalAmount: 500,
        orderDate: new Date().toISOString()
      };

      const orderResponse = await request(baseURL)
        .post('/api/orders')
        .send(orderData)
        .expect(201);

      orderId = orderResponse.body._id;
      console.log(`Order created successfully with ID: ${orderId}`);

      expect(orderResponse.body).toHaveProperty('_id');
      expect(orderResponse.body.productId).toBe(productId);
      expect(orderResponse.body.quantity).toBe(orderData.quantity);
      expect(orderResponse.body.totalAmount).toBe(orderData.totalAmount);
      expect(orderResponse.body.status).toBe('Pending Shipment'); // Default status

      // Step 4: Get order by ID
      console.log('\n6. Getting order by ID...');
      const orderByIdResponse = await request(baseURL)
        .get(`/api/orders/${orderId}`)
        .expect(200);

      expect(orderByIdResponse.body._id).toBe(orderId);

      // Step 5: Create delivery status
      console.log('\n7. Creating delivery status...');
      const deliveryData = {
        orderId: orderId,
        status: 'Pending Shipment'
      };

      const deliveryResponse = await request(baseURL)
        .post('/api/delivery-status')
        .send(deliveryData)
        .expect(201);

      deliveryStatusId = deliveryResponse.body._id;
      console.log(`Delivery status created successfully with ID: ${deliveryStatusId}`);

      expect(deliveryResponse.body).toHaveProperty('_id');
      expect(deliveryResponse.body.orderId).toBe(orderId);
      expect(deliveryResponse.body.status).toBe('Pending Shipment');

      const updateData = {
        status: 'shipped'
      };

      const shippedResponse = await request(baseURL)
        .put(`/api/delivery-status/${deliveryStatusId}`)
        .send(updateData)
        .expect(200);

      console.log(`Delivery status updated successfully`);

      expect(shippedResponse.body.status).toBe('shipped');

      // Step 6: Verify order status was updated
      console.log('\n9. Verifying order status updated');
      
      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 500));

      const orderAfterShipped = await request(baseURL)
        .get(`/api/orders/${orderId}`)
        .expect(200);

      expect(orderAfterShipped.body.status).toBe('shipped');

      // Step 7: Update status to 'delivered'
      console.log('\n10. Updating delivery status to delivered...');
      const deliveredUpdate = {
        status: 'delivered'
      };

      const deliveredResponse = await request(baseURL)
        .put(`/api/delivery-status/${deliveryStatusId}`)
        .send(deliveredUpdate)
        .expect(200);

      // Step 8: Verify final order status
      console.log('\n11. Verifying final order status...');
      
      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 500));

      const finalOrder = await request(baseURL)
        .get(`/api/orders/${orderId}`)
        .expect(200);

      expect(finalOrder.body.status).toBe('delivered');

    });
  });

  describe('Stock Validation', () => {
    it('should reject orders when product has insufficient stock', async () => {
      console.log('\n=== Testing Stock Validation ===\n');

      const lowStockProduct = {
        name: 'Low Stock Product',
        description: 'Product with limited stock for testing',
        stockQuantity: 1
      };

      const productResponse = await request(baseURL)
        .post('/api/products')
        .send(lowStockProduct)
        .expect(201);

      const lowStockProductId = productResponse.body._id;

      const orderData = {
        productId: lowStockProductId,
        quantity: 5, // only 1 is available 
        totalAmount: 500,
        orderDate: new Date().toISOString()
      };

      const orderResponse = await request(baseURL)
        .post('/api/orders')
        .send(orderData)
        .expect(500);

      expect(orderResponse.body).toHaveProperty('error');
    });
  });

});
