import mongoose from 'mongoose';

const connectionStr: string = 'mongodb://localhost:27017';

export class Database {
  private static instance: Database;
  private dbName: string = 'checkpoint_order_processing';
  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async connect(connectionString: string = connectionStr): Promise<void> {
    try { 
      await mongoose.connect(connectionString);
      console.log('Connected to MongoDB with Mongoose');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    } catch (error) {
      console.error('MongoDB disconnection error:', error);
      throw error;
    }
  }

  isConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }
}