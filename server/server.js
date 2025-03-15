//Express Server for Dental Insurance Payer Processing System

const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Import database connection
const db = require('./config/db');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../client/build')));

// Import routes
const routes = require('./routes');

// Register API routes
app.use('/api', routes);

// For any request that doesn't match API routes, serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Test database connection before starting the server
(async () => {
  try {
    await db.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = app; // For testing purposes