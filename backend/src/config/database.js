const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  const connectionString = process.env.DB_URL;
  const maxRetries = 15;      // Max retry attempts
  let retries = 0;

  while (retries < maxRetries) {
    try {
      console.log(`Attempting MongoDB connection (${retries + 1}/${maxRetries})...`);

      await mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: false,
        connectTimeoutMS: 30000,
        serverSelectionTimeoutMS: 30000,
      });

      console.log('✅ MongoDB connected successfully!');
      return;
    } catch (err) {
      retries++;
      console.error(`❌ MongoDB connection failed (attempt ${retries}): ${err.message}`);
      console.log('⏳ Retrying in 5 seconds...');
      await new Promise((res) => setTimeout(res, 5000));
    }
  }

  throw new Error('MongoDB connection failed after maximum retries.');
};

module.exports = connectDB;
