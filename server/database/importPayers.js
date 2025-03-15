const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const xlsx = require('xlsx');

const dbPath = path.join(__dirname, 'payerDB.sqlite');
const db = new sqlite3.Database(dbPath);
const filePath = path.join(__dirname, 'Payers.xlsx');

const workbook = xlsx.readFile(filePath);

const insertPayerData = (sheetName) => {
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);

  data.forEach(row => {
    const payerName = row["Payer Identification Information"];
    const payerNumber = row["Payer ID"];

    if (payerName) {
      db.run(
        `INSERT INTO payer_details (payer_name, payer_number) VALUES (?, ?)`,
        [payerName, payerNumber || null],
        (err) => {
          if (err) console.error(`Error inserting ${payerName}:`, err.message);
          else console.log(`Inserted ${payerName}`);
        }
      );
    }
  });
};

workbook.SheetNames.forEach(sheet => {
  console.log(`Processing sheet: ${sheet}`);
  insertPayerData(sheet);
});

db.close(() => console.log("Data imported successfully!"));
