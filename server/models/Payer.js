const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Payer = sequelize.define('Payer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  payer_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  address_line_1: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address_line_2: {
    type: DataTypes.STRING,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true
  },
  zip: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true
  },
  source: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'The source of this payer data (e.g., file name)'
  }
}, {
  tableName: 'payers',
  timestamps: true,
  underscored: true
});

module.exports = Payer;