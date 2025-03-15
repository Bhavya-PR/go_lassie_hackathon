/**
 * PayerGroup Model
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PayerGroup = sequelize.define('payer_group', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'payer_groups',
  timestamps: false  // No created_at or updated_at columns
});

module.exports = PayerGroup;