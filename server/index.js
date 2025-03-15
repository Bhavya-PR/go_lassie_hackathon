const express = require('express');
const cors = require('cors');
const db = require('./config/db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('GoLassie API is running (SQLite3 Version)');
});

// Get all payers
app.get('/payers', (req, res) => {
  db.all('SELECT * FROM payers', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Search payers by name or payer number
app.get('/payers/search', (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  const searchQuery = `%${query.toLowerCase()}%`;
  db.all(
    `SELECT p.id, p.name, pd.payer_number 
     FROM payers p 
     JOIN payer_details pd ON p.id = pd.payer_id 
     WHERE LOWER(p.name) LIKE ? OR LOWER(pd.payer_number) LIKE ?`,
    [searchQuery, searchQuery],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

// Get payer details by ID
app.get('/payers/:id', (req, res) => {
  const payerId = req.params.id;
  
  db.get('SELECT * FROM payers WHERE id = ?', [payerId], (err, payer) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!payer) {
      res.status(404).json({ error: "Payer not found" });
      return;
    }

    db.all('SELECT * FROM payer_details WHERE payer_id = ?', [payerId], (err, details) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ payer, details });
    });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
