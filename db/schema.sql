CREATE TABLE employee (
    id INTEGER auto_increment PRIMARY KEY NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role_id INTEGER,
    manager_id INTEGER NULL
);