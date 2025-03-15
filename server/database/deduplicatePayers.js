const db = require('../config/db');

const normalizeName = (name) => {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
};

db.all(`SELECT id, payer_name FROM payer_details`, [], (err, rows) => {
  if (err) {
    console.error("Error fetching payers:", err.message);
    return;
  }

  rows.forEach(row => {
    const normalized = normalizeName(row.payer_name);
    db.run(`UPDATE payer_details SET normalized_name = ? WHERE id = ?`, 
      [normalized, row.id],
      (err) => {
        if (err) console.error(`Error updating ${row.payer_name}:`, err.message);
      }
    );
  });

  db.all(`SELECT DISTINCT normalized_name, payer_name FROM payer_details`, [], (err, rows) => {
    if (err) {
      console.error("Error fetching unique payers:", err.message);
      return;
    }

    rows.forEach(row => {
      db.run(`INSERT OR IGNORE INTO payers (name) VALUES (?)`, [row.payer_name], function(err) {
        if (err) {
          console.error(`Error inserting ${row.payer_name}:`, err.message);
          return;
        }

        const payerId = this.lastID;

        db.run(`UPDATE payer_details SET payer_id = ? WHERE normalized_name = ?`,
          [payerId, row.normalized_name],
          (err) => {
            if (err) console.error(`Error mapping ${row.payer_name}:`, err.message);
          }
        );
      });
    });

    db.close(() => {
      console.log("Deduplication complete!");
    });
  });
});
