const db = require('../config/db');

const getAllPayers = (callback) => {
  db.all('SELECT * FROM payers', [], callback);
};

const searchPayers = (query, callback) => {
  const searchQuery = `%${query.toLowerCase()}%`;
  db.all(
    `SELECT p.id, p.name, pd.payer_number 
     FROM payers p 
     JOIN payer_details pd ON p.id = pd.payer_id 
     WHERE LOWER(p.name) LIKE ? OR LOWER(pd.payer_number) LIKE ?`,
    [searchQuery, searchQuery],
    callback
  );
};

module.exports = { getAllPayers, searchPayers };
