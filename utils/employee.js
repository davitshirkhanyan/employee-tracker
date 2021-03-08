// const inquirer = require('inquirer');
// const db = require('./Database');
// const startServer = require('../server');

// // Builds complete employee table
// async function showEmployees() {
//     console.log(' ');
//     await db.query('SELECT e.id, e.first_name AS First_Name, e.last_name AS Last_Name, title AS Title, salary AS Salary, name AS Department, CONCAT(m.first_name, " ", m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id', (err, res) => {
//         if (err) throw err;
//         console.table(res);
//         startServer();
//     });
// };

// // add a new employee
// async function addEmployee() {
//     let positions = await db.query(`SELECT id, title FROM role`);
//     let managers = await db.query(`SELECT id, CONCAT(first_name, ' ', last_name) AS Manager FROM employee`);
//     managers.unshift(
//     {
//         id: null, 
//         Manager: "None" 
//     });

//     inquirer.prompt([
//         {
//             name: 'firstName',
//             type: 'input',
//             message: 'Enter Employee\'s First name(Required):',
//             validate: firstNameInput => {
//                 if (firstNameInput) {
//                     return true;
//                 } else {
//                     console.log('Please enter Employee\'s First name');
//                     return false;
//                 }
//             }
//         },
//         {
//             name: 'lastName',
//             type: 'input',
//             message: 'Enter Employee\'s Last name(Required):',
//             validate: lastNameInput => {
//                 if (lastNameInput) {
//                     return true;
//                 } else {
//                     console.log('Please enter Employee\'s Last name');
//                     return false;
//                 }
//             }
//         },
//         {
//             name: 'role',
//             type: 'list',
//             message: 'Choose employee role:',
//             choices: positions.map(obj => obj.title)
//         },
//         {
//             name: 'manager',
//             type: 'list',
//             message: 'Choose employee\'s manager:',
//             choices: managers.map(obj => obj.Manager)
//         }
//     ])
//     .then(answers => {
//         let positionDetails = positions.find(obj => obj.title === answers.role);
//         let manager = managers.find(obj => obj.Manager = answers.manager);
//         db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?)`, [
//             [answers.firstName.trim(), answers.lastName.trim(), positionDetails.id, manager.id]
//         ]);
//         console.log("\x1b[32m", `${answers.firstName} was added to the employee database!`);
//         startServer();
//     });
// };

// // remove employee
// async function removeEmployee() {
//     let employees = await db.query(`SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee`);
//     employees.push(
//         {
//         id: null,
//         name: 'Cancel'
//     });

//     inquirer.prompt([
//         {
//         name: "employeeName",
//         type: "list",
//         message: "Which employee do you want to remove?",
//         choices: employees.map(obj => obj.name)
//     }
// ])
//     .then(response => {
//         if (response.employeeName != "Cancel") {
//             let removedEmployee = employees.find(obj => obj.name === response.employeeName);
//             db.query("DELETE FROM employee WHERE id=?", removedEmployee.id);
//             console.log("\x1b[32m", `${response.employeeName} was removed from the database`);
//         }
//         startServer();
//     });
// };

// // Change the employee's manager.
// async function updateManager() {
//     let employees = await db.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee');
//     employees.push(
//         {
//             id: null,
//             name: "Cancel"
//         });

//     inquirer.prompt([
//         {
//             name: "employeeName",
//             type: "list",
//             message: "Which employee do you want for?",
//             choices: employees.map(obj => obj.name)
//         }
//     ])
//     .then(employeeInfo => {
//         if (employeeInfo.employeeName == "Cancel") {
//             startServer();
//             return;
//         }
//         let managers = employees.filter(currEmployee => currEmployee.name != employeeInfo.employeeName);
//         for (i in managers) {
//             if (managers[i].name === "Cancel") {
//                 managers[i].name = "None";
//             }
//         };

//         inquirer.prompt([
//             {
//                 name: "managerName",
//                 type: "list",
//                 message: "Change the manager to:",
//                 choices: managers.map(obj => obj.name)
//             }
//         ])
//         .then(managerInfo => {
//             let employeeID = employees.find(obj => obj.name === employeeInfo.employeeName).id;
//             let managerID = managers.find(obj => obj.name === managerInfo.managerName).id;
//             db.query("UPDATE employee SET manager_id=? WHERE id=?", [managerID, employeeID]);
//             console.log("\x1b[32m", `${employeeInfo.employeeName} now reports to ${managerInfo.managerName}`);
//             startServer();
//         });
//     });
// };

// // Update the selected employee
// async function updateEmployee() {
//     let employees = await db.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee');
//     employees.push(
//         {
//             id: null, 
//             name: "Cancel"
//         });
//     let roles = await db.query('SELECT id, title FROM role');

//     inquirer.prompt([
//         {
//             name: "employeeName",
//             type: "list",
//             message: "Which employee do you want for?",
//             choices: employees.map(obj => obj.name)
//         },
//         {
//             name: "newRole",
//             type: "list",
//             message: "Change the role to:",
//             choices: roles.map(obj => obj.title)
//         }
//     ])
//     .then(answers => {
//         if (answers.empName != "Cancel") {
//             let employeeID = employees.find(obj => obj.name === answers.employeeName).id;
//             let roleID = roles.find(obj => obj.title === answers.newRole).id;
//             db.query("UPDATE employee SET role_id=? WHERE id=?", [roleID, employeeID]);
//             console.log("\x1b[32m", `${answers.employeeName} new role is ${answers.newRole}`);
//         }
//         startServer();
//     });
// };

// // Options to make changes to employees specifically
// const editEmployeeOptions = () => {
//     inquirer.prompt({
//         name: "editChoice",
//         type: "list",
//         message: "What would you like to update?",
//         choices: [
//             "Add A New Employee",
//             "Change Employee Role",
//             "Change Employee Manager",
//             "Remove An Employee",
//             "Return To Main Menu"
//         ]
//     })
//     .then(response => {
//         switch (response.editChoice) {
//             case "Add A New Employee":
//                 addEmployee();
//                 break;
//             case "Change Employee Role":
//                 updateEmployee();
//                 break;
//             case "Change Employee Manager":
//                 updateManager();
//                 break;
//             case "Remove An Employee":
//                 removeEmployee();
//                 break;
//             case "Return To Main Menu":
//                 startServer();
//                 break;
//         }
//     });
// };

// module.exports = showEmployees;
// module.exports = editEmployeeOptions;