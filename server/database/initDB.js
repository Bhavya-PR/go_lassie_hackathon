const fs = require('fs');
const path = require('path');
const db = require('../config/db');

const schemaPath = path.join(__dirname, 'schema.sql');
const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

db.exec(schemaSQL, (err) => {
  if (err) {
    console.error('Error initializing database:', err.message);
  } else {
    console.log('Database initialized successfully');
  }
  db.close();
});
