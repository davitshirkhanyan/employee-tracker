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

// add a new employee
async function addEmployee() {
    let positions = await db.query(`Select id, title FROM role`);
    let managers = await db.query(`SELECT id, CONCAT(first_name, ' ', last_name) AS Manager FROM employee`);
    managers.unshift({ id: null, Manager: "None" });

    inquirer.prompt([
        {
            name: 'firstName',
            type: 'input',
            message: 'Enter Employee\'s first name(Required):',
            validate: firstNameInput => {
                if (firstNameInput) {
                    return true;
                } else {
                    console.log('Please enter Employee\'s first name');
                    return false;
                }
            }
        },
        {
            name: 'lastName',
            type: 'input',
            message: 'Enter Employee\'s last name(Required):',
            validate: lastNameInput => {
                if (lastNameInput) {
                    return true;
                } else {
                    console.log('Please enter Employee\'s last name');
                    return false;
                }
            }
        },
        {
            name: 'role',
            type:'list',
            message: 'Choose employee role',
            choices: positions.map(obj => obj.title)
        },
        {
            name: 'manager',
            type:'list',
            message: 'Choose employee\'s manager',
            choices: positions.map(obj => obj.Manager)
        }
    ])
    .then(answers => {
        let positionDetails = positions.find(obj => obj.title === answers.role);
        let manager = managers.find(obj => obj.Manager = answers.manager);
        db.query(`INSERT ONTO employee (first_name, last_name, role_id, manager_id) VALUES (?), ${[
            [answers.firstName.trim(), answers.lastName.trim(), positionDetails.id, manager.id]
        ]}`);
        console.log("\x1b[32m", `${answers.firstName} was added to the employee database!`);
        startServer();
    });
};

startServer();