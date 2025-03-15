const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// Import DB connection
const { sequelize, testConnection } = require('./server/config/db');

// Import models
const models = require('./server/models');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Define routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API is running' });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Import route files
const payersRoutes = require('./server/routes/payers');
const payerGroupsRoutes = require('./server/routes/payerGroups');
const uploadsRoutes = require('./server/routes/uploads');

// Use routes
app.use('/api/payers', payersRoutes);
app.use('/api/groups', payerGroupsRoutes);
app.use('/api/uploads', uploadsRoutes);

// Setting port
const PORT = process.env.PORT || 5000;

// Sync database and start server
const startServer = async () => {
  try {
    const isConnected = await testConnection();
    
    if (isConnected) {
      // Sync all models with database
      await sequelize.sync();
      console.log('Database synced successfully');
      
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    } else {
      console.error('Failed to connect to the database. Server not started.');
    }
  } catch (error) {
    console.error('Server startup error:', error);
  }
};

startServer();