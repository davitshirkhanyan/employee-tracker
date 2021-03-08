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
    managers.unshift(
        {
        id: null, 
        Manager: "None" 
    });

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
        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?), ${[
            [answers.firstName.trim(), answers.lastName.trim(), positionDetails.id, manager.id]
        ]}`);
        console.log("\x1b[32m", `${answers.firstName} was added to the employee database!`);
        startServer();
    });
};

// remove employee
async function removeEmployee() {
    let employees = await db.query(`SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee`);
    employees.push(
        {
        id: null,
        name: 'Cancel'
    });

    inquirer.prompt([
        {
        name: "employeeName",
        type: "list",
        message: "Which employee do you want to remove?",
        choices: employees.map(obj => obj.name)
    }
])
    .then(response => {
        if (response.employeeName != "Cancel") {
            let removedEmployee = employees.find(obj => obj.name === response.employeeName);
            db.query("DELETE FROM employee WHERE id=?", removedEmployee.id);
            console.log("\x1b[32m", `${response.employeeName} was removed from the database`);
        }
        startServer();
    });
};

// add a new department
async function addDepartment() {
    inquirer.prompt([
        {
            name: 'departmentName',
            type: 'input',
            message: 'Enter a new department name(Required):',
            validate: departmentInput => {
                if (departmentInput) {
                    return true;
                } else {
                    console.log('Please enter a new department name');
                    return false;
                }
            }
        }
    ])
    .then(answers => {
        db.query("INSERT INTO department (name) VALUES (?)", [answers.departmentName]);
        console.log("\x1b[32m", `${answers.departmentName} was added to departments.`);
        startServer();
    });
};

// remove a department
async function removeDepartment() {
    let departments = await db.query('SELECT id, name FROM department');
    departments.push(
        {
        id: null,
        name: "Cancel"
    });

    inquirer.prompt([
        {
            name: "departmentName",
            type: "list",
            message: "Which dapartment do you want to remove?",
            choices: departments.map(obj => obj.name)
        }
    ]).then(response => {
        if (response.departmentName != "Cancel") {
            let removedDepartment = departments.find(obj => obj.name === response.departmentName);
            db.query("DELETE FROM department WHERE id=?", removedDepartment.id);
            console.log("\x1b[32m", `${response.departmentName} was removed.`);
        }
        startServer();
    });
};

// add a new role
async function addRole() {
    let departments = await db.query('SELECT id, name FROM department');

    inquirer.prompt([
        {
            name: "roleName",
            type: "input",
            message: "Enter new role title(Required):",
            validate: roleInput => {
                if (roleInput) {
                    return true;
                } else {
                    console.log("Please enter a new role title");
                    return false;
                }
            }
        },
        {
            name: "salary",
            type: "input",
            message: "Enter role's salary:",
            validate: input => {
                if (!isNaN(input)) {
                    return true;
                }
                return "Please enter a valid number."
            }
        },
        {
            name: "roleDepartment",
            type: "list",
            message: "Choose the role's department:",
            choices: departments.map(obj => obj.name)
        }
    ]).then(answers => {
        let depID = departments.find(obj => obj.name === answers.roleDepartment).id
        db.query("INSERT INTO role (title, salary, department_id) VALUES (?)", [[answers.roleName, answers.salary, depID]]);
        console.log("\x1b[32m", `${answers.roleName} was added. Department: ${answers.roleDepartment}`);
        startServer();
    });
};

// remove a role from the database
async function removeRole() {
    let roles = await db.query('SELECT id, title FROM role');
    roles.push(
        {
            id: null, 
            title: "Cancel"
        });

    inquirer.prompt([
        {
            name: "roleName",
            type: "list",
            message: "Which role do you want to remove?",
            choices: roles.map(obj => obj.title)
        }
    ]).then(response => {
        if (response.roleName != "Cancel") {
            let removedRole = roles.find(obj => obj.title === response.roleName);
            db.query("DELETE FROM role WHERE id=?", removedRole.id);
            console.log("\x1b[32m", `${response.roleName} was removed.`);
        }
        startServer();
    });
};

// Change the employee's manager.
async function updateManager() {
    let employees = await db.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee');
    employees.push(
        {
            id: null,
            name: "Cancel"
        });

    inquirer.prompt([
        {
            name: "employeeName",
            type: "list",
            message: "Which employee do you want for?",
            choices: employees.map(obj => obj.name)
        }
    ])
    .then(employeeInfo => {
        if (employeeInfo.employeeName == "Cancel") {
            startServer();
            return;
        }
        let managers = employees.filter(currEmployee => currEmployee.name != employeeInfo.employeeName);
        for (i in managers) {
            if (managers[i].name === "Cancel") {
                managers[i].name = "None";
            }
        };

        inquirer.prompt([
            {
                name: "managerName",
                type: "list",
                message: "Change the manager to:",
                choices: managers.map(obj => obj.name)
            }
        ])
        .then(managerInfo => {
            let employeeID = employees.find(obj => obj.name === employeeInfo.employeeName).id;
            let managerID = managers.find(obj => obj.name === managerInfo.managerName).id;
            db.query("UPDATE employee SET manager_id=? WHERE id=?", [managerID, employeeID]);
            console.log("\x1b[32m", `${employeeInfo.employeeName} now reports to ${managerInfo.managerName}`);
            startServer();
        });
    });
};

// Update the selected employee
async function updateEmployee() {
    let employees = await db.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee');
    employees.push(
        {
            id: null, 
            name: "Cancel"
        });
    let roles = await db.query('SELECT id, title FROM role');

    inquirer.prompt([
        {
            name: "employeeName",
            type: "list",
            message: "Which employee do you want for?",
            choices: employees.map(obj => obj.name)
        },
        {
            name: "newRole",
            type: "list",
            message: "Change the role to:",
            choices: roles.map(obj => obj.title)
        }
    ])
    .then(answers => {
        if (answers.empName != "Cancel") {
            let employeeID = employees.find(obj => obj.name === answers.employeeName).id
            let roleID = roles.find(obj => obj.title === answers.newRole).id
            db.query("UPDATE employee SET role_id=? WHERE id=?", [roleID, employeeID]);
            console.log("\x1b[32m", `${answers.employeeName} new role is ${answers.newRole}`);
        }
        startServer();
    });
};

startServer();