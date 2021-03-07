CREATE TABLE employee (
    id INTEGER auto_increment PRIMARY KEY NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role_id INTEGER,
    manager_id INTEGER NULL
);

CREATE TABLE department (
    id INTEGER auto_increment PRIMARY KEY NOT NULL,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE role (
    id INTEGER auto_increment PRIMARY KEY NOT NULL,
    title VARCHAR(50) NOT NULL,
    salary DECIMAL(9, 2) NOT NULL,
    department_id INTEGER NOT NULL
);