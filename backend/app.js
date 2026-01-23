require('module-alias/register');
require('./src/models/models');

const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./src/config/database');

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Basic middleware first
app.use(express.json());
app.use(cors());

// Serve static files
const staticDirs = [
  'cdn'
];
staticDirs.forEach(dir => {
  app.use(`/${dir}`, express.static(path.join(__dirname, dir)));
});

// Swagger only for local environment
if (process.env.NODE_ENV === 'local') {
  require('./swagger')(app);
}

// No changes needed
const startServer = async () => {
  try {
    await connectDB(); // retry logic handles initial Mongo delays
    await new Promise(res => setTimeout(res, 2000)); // <-- ensures Mongo is ready

    const logRequest = require('@middleware/logrequest');
    app.use(logRequest);

    app.use(require('./src/routes'));

    const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server running on port ${PORT} (${process.env.NODE_ENV})`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
