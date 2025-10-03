import { Database } from '../src/config/database';

beforeAll(async () => {
  // Connect to test database
  const database = Database.getInstance();
  const testDbUri = process.env.TEST_MONGODB_URI || 'mongodb://admin:password123@localhost:27017/checkpoint_order_processing_test?authSource=admin';
  await database.connect(testDbUri);
});

afterAll(async () => {
  // Disconnect from database
  const database = Database.getInstance();
  await database.disconnect();
});