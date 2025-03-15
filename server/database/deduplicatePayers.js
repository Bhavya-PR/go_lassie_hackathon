const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to SQLite3
const dbPath = path.join(__dirname, 'payerDB.sqlite');
const db = new sqlite3.Database(dbPath);

// Normalize payer names for deduplication
const normalizeName = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]/g, ''); // Remove spaces & special chars
};

// Step 1: Update `normalized_name` column in `payer_details`
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
                if (err) console.error(`Error updating normalized_name for ${row.payer_name}:`, err.message);
                else console.log(`Normalized ${row.payer_name} → ${normalized}`);
            }
        );
    });

    // Step 2: Insert unique payers into `payers` table
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

                // Get the inserted payer_id
                const payerId = this.lastID;

                // Step 3: Map `payer_details` to unique `payers`
                db.run(`UPDATE payer_details SET payer_id = ? WHERE normalized_name = ?`,
                    [payerId, row.normalized_name], 
                    (err) => {
                        if (err) console.error(`Error mapping ${row.payer_name}:`, err.message);
                        else console.log(`Mapped ${row.payer_name} → Payer ID ${payerId}`);
                    }
                );
            });
        });

        db.close(() => {
            console.log("Deduplication & mapping complete!");
        });
    });
});
