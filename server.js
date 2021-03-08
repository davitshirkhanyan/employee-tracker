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
    database: 'employee_db'
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
                showEmployees();
                break;

            case 'Edit Employee Info':
                editEmployeeOptions();
                break;

            case 'View Departments':
                showDepartments();
                break;

            case 'Edit Departments':
                editDepartmentOptions();
                break;

            case 'View Roles':
                showRoles();
                break;

            case 'Edit Roles':
                editRoleOptions();
                break;
        }
    });
};

// Builds complete employee table
async function showEmployees() {
    console.log(' ');
    await db.query('SELECT e.id, e.first_name AS First_Name, e.last_name AS Last_Name, title AS Title, salary AS Salary, name AS Department, CONCAT(m.first_name, " ", m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id', (err, res) => {
        if (err) throw err;
        console.table(res);
        startServer();
    });
};

// Builds a table which shows existing departments
async function showDepartments() {
    console.log(' ');
    await db.query('SELECT id, name AS department FROM department', (err, res) => {
        if (err) throw err;
        console.table(res);
        startServer();
    });
};

// Builds a table which shows existing roles and their departments
async function showRoles() {
    console.log(' ');
    await db.query('SELECT r.id, title, salary, name AS department FROM role r LEFT JOIN department d ON department_id = d.id', (err, res) => {
        if (err) throw err;
        console.table(res);
        startServer();
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
        let departmentID = departments.find(obj => obj.name === answers.roleDepartment).id
        db.query("INSERT INTO role (title, salary, department_id) VALUES (?)", [[answers.roleName, answers.salary, departmentID]]);
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
            let employeeID = employees.find(obj => obj.name === answers.employeeName).id;
            let roleID = roles.find(obj => obj.title === answers.newRole).id;
            db.query("UPDATE employee SET role_id=? WHERE id=?", [roleID, employeeID]);
            console.log("\x1b[32m", `${answers.employeeName} new role is ${answers.newRole}`);
        }
        startServer();
    });
};

// Update a role
async function updateRole() {
    let roles = await db.query('SELECT id, title FROM role');
    roles.push(
        {
            id: null,
            title: "Cancel"
        });
    let departments = await db.query('SELECT id, name FROM department');

    inquirer.prompt([
        {
            name: "roleName",
            type: "list",
            message: "Which role do you want to update?",
            choices: roles.map(obj => obj.title)
        }
    ])
    .then(response => {
        if (response.roleName == "Cancel") {
            startServer();
            return;
        }
        inquirer.prompt([
            {
                name: "salary",
                type: "input",
                message: "Enter role's salary:",
                validate: salaryInput => {
                    if (!isNaN(salaryInput)) {
                        return true;
                    }
                    return "Please enter a valid number.";
                }
            },
            {
                name: "roleDepartment",
                type: "list",
                message: "Choose the role's department:",
                choices: departments.map(obj => obj.name)
            }
        ])
        .then(answers => {
            let departmentID = departments.find(obj => obj.name === answers.roleDepartment).id
            let roleID = roles.find(obj => obj.title === response.roleName).id
            db.query("UPDATE role SET title=?, salary=?, department_id=? WHERE id=?", [response.roleName, answers.salary, departmentID, roleID]);
            console.log("\x1b[32m", `${response.roleName} was updated.`);
            startServer();
        });
    });
};

// Options to make changes to employees specifically
const editEmployeeOptions = () => {
    inquirer.prompt({
        name: "editChoice",
        type: "list",
        message: "What would you like to update?",
        choices: [
            "Add A New Employee",
            "Change Employee Role",
            "Change Employee Manager",
            "Remove An Employee",
            "Return To Main Menu"
        ]
    })
    .then(response => {
        switch (response.editChoice) {
            case "Add A New Employee":
                addEmployee();
                break;
            case "Change Employee Role":
                updateEmployee();
                break;
            case "Change Employee Manager":
                updateManager();
                break;
            case "Remove An Employee":
                removeEmployee();
                break;
            case "Return To Main Menu":
                startServer();
                break;
        }
    });
};

// Options to make changes to roles
const editRoleOptions = () => {
    inquirer.prompt({
        name: "editRoles",
        type: "list",
        message: "What would you like to update?",
        choices: [
            "Add A New Role",
            "Update A Role",
            "Remove A Role",
            "Return To Main Menu"
        ]
    })
    .then(responses => {
        switch (responses.editRoles) {
            case "Add A New Role":
                addRole();
                break;
            case "Update A Role":
                updateRole();
                break;
            case "Remove A Role":
                removeRole();
                break;
            case "Return To Main Menu":
                startServer();
                break;
        }
    });
};

// Options to make changes to departments
const editDepartmentOptions = () => {
    inquirer.prompt({
        name: "editDeparments",
        type: "list",
        message: "What would you like to update?",
        choices: [
            "Add A New Department",
            "Remove A Department",
            "Return To Main Menu"
        ]
    }).then(responses => {
        switch (responses.editDeparments) {
            case "Add A New Department":
                addDepartment();
                break;
            case "Remove A Department":
                removeDepartment();
                break;
            case "Return To Main Menu":
                startServer();
                break;
        }
    });
};

startServer();