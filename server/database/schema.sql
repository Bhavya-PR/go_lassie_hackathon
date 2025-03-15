CREATE TABLE payer_groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE payers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    payer_group_id INT REFERENCES payer_groups(id)
);

CREATE TABLE payer_details (
    id SERIAL PRIMARY KEY,
    payer_id INT REFERENCES payers(id),
    payer_name VARCHAR(255) NOT NULL,
    payer_number VARCHAR(50),
    ein VARCHAR(50)
);