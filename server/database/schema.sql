CREATE TABLE IF NOT EXISTS payer_groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS payers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    payer_group_id INTEGER,
    FOREIGN KEY (payer_group_id) REFERENCES payer_groups(id)
);

CREATE TABLE IF NOT EXISTS payer_details (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    payer_id INTEGER,
    payer_name TEXT NOT NULL,
    payer_number TEXT,
    ein TEXT,
    FOREIGN KEY (payer_id) REFERENCES payers(id)
);

ALTER TABLE payer_details ADD COLUMN normalized_name TEXT;