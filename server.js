const mysql = require('mysql');
const inquirer = require("inquirer");
const cTable = require("console.table");

// create Database class
class Database {
    constructor(config) {
        this.connection = mysql.createConnection(config);
    }

    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
    };

    close() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    };
};

const db = new Database({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Dav1234',
    databas: 'employee_db'
});

// add function to start the app
const startServer = () => {
    inquirer.prompt({
        name: 'menu',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View all Employees',
            'Edit Employee Info',
            'View Departments',
            'Edit Departments',
            'View Roles',
            'Edit Roles'
        ]
    })
    .then(responses => {
        switch (responses.menu) {
            case 'View all Employees':

                break;

            case 'Edit Employee Info':

                break;

            case 'View Departments':

                break;

            case 'Edit Departments':

                break;

            case 'View Roles':

                break;

            case 'Edit Roles':

                break;
        }
    });
};

startServer();