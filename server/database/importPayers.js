const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const xlsx = require('xlsx');
require('dotenv').config();

const dbPath = path.join(__dirname, 'payerDB.sqlite');
const db = new sqlite3.Database(dbPath);
const filePath = path.join(__dirname, 'Payers.xlsx'); // Excel file path

// Load Excel file
const workbook = xlsx.readFile(filePath);

// Function to insert payer data into SQLite3
const insertPayerData = (sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    data.forEach(row => {
        const payerName = row["Payer Identification Information"];
        const payerNumber = row["Payer ID"];

        if (payerName && payerNumber) {
            db.run(
                `INSERT INTO payer_details (payer_name, payer_number) VALUES (?, ?)`,
                [payerName, payerNumber],
                (err) => {
                    if (err) console.error(`Error inserting ${payerName}:`, err.message);
                    else console.log(`Inserted ${payerName} (Payer Number: ${payerNumber})`);
                }
            );
        }
    });
};

// Process all sheets
const sheetNames = workbook.SheetNames;
sheetNames.forEach(sheet => {
    console.log(`Processing sheet: ${sheet}`);
    insertPayerData(sheet);
});

// Close database connection
db.close(() => {
    console.log("All data imported successfully!");
});
