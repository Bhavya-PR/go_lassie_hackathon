const Payer = require('../models/payerModel.js');

const getAllPayers = (callback) => {
  Payer.getAllPayers(callback);
};

const searchPayers = (query, callback) => {
  Payer.searchPayers(query, callback);
};

const deletePayer = (id, callback) => {
  Payer.deletePayer(id, callback);
};

const updatePayer = (id, updateData, callback) => {
  Payer.updatePayer(id, updateData, callback);
};

const addPayer = (payerData, callback) => {
  Payer.addPayer(payerData, callback);
};

module.exports = { getAllPayers, searchPayers, deletePayer, updatePayer, addPayer };
