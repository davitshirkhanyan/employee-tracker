DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;

CREATE TABLE employee (
    id INTEGER auto_increment PRIMARY KEY NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role_id INTEGER UNSIGNED,
    manager_id INTEGER UNSIGNED NULL
);

CREATE TABLE department (
    id INTEGER auto_increment PRIMARY KEY NOT NULL,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE role (
    id INTEGER auto_increment PRIMARY KEY NOT NULL,
    title VARCHAR(50) NOT NULL,
    salary DECIMAL(9, 2) NOT NULL,
    department_id INTEGER UNSIGNED NOT NULL
);