const pool = require('../config/db');
const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

(async () => {
  try {
    await pool.query(schema);
    console.log('Database initialized successfully');
    process.exit();
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
})();
