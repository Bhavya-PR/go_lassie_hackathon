/**
 * Payer Model
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Payer = sequelize.define('payer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  display_name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  payer_group_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'payer_groups',  // Refers to table name
      key: 'id'               // Refers to column name in referenced table
    }
  }
}, {
  tableName: 'payers',
  timestamps: false,  // No created_at or updated_at columns
  indexes: [
    {
      unique: true,
      fields: ['name', 'payer_group_id'],
      name: '_payer_group_uc'
    }
  ]
});

module.exports = Payer;