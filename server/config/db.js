const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Get database connection string from environment variables
const dbConnectionString = process.env.DATABASE_URL;

// Create Sequelize instance
const sequelize = new Sequelize(dbConnectionString, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false  // Important for some hosted PostgreSQL providers
    }
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: false  // Set to console.log to see SQL queries in console
});

/**
 * Test database connection
 * @returns {Promise<boolean>} True if connected, false otherwise
 */
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
};

module.exports = sequelize;
module.exports.testConnection = testConnection;