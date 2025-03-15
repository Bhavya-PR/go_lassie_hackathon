/**
 * Models Index
 */
const PayerGroup = require('./PayerGroup');
const Payer = require('./Payer');
const PayerDetail = require('./PayerDetail');

// Set up associations between models
PayerGroup.hasMany(Payer, {
  foreignKey: 'payer_group_id',
  as: 'payers',
  onDelete: 'CASCADE'
});

Payer.belongsTo(PayerGroup, {
  foreignKey: 'payer_group_id',
  as: 'payer_group'
});

Payer.hasMany(PayerDetail, {
  foreignKey: 'payer_id',
  as: 'payer_details',
  onDelete: 'CASCADE'
});

PayerDetail.belongsTo(Payer, {
  foreignKey: 'payer_id',
  as: 'payer'
});

// Export all models
module.exports = {
  PayerGroup,
  Payer,
  PayerDetail
};