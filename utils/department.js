// const inquirer = require('inquirer');
// const db = require('./Database');
// const startServer = require('../server');

// // Builds a table which shows existing departments
// async function showDepartments() {
//     console.log(' ');
//     await db.query('SELECT id, name AS department FROM department', (err, res) => {
//         if (err) throw err;
//         console.table(res);
//         startServer();
//     });
// };

// // add a new department
// async function addDepartment() {
//     inquirer.prompt([
//         {
//             name: 'departmentName',
//             type: 'input',
//             message: 'Enter a new department name(Required):',
//             validate: departmentInput => {
//                 if (departmentInput) {
//                     return true;
//                 } else {
//                     console.log('Please enter a new department name');
//                     return false;
//                 }
//             }
//         }
//     ])
//     .then(answers => {
//         db.query("INSERT INTO department (name) VALUES (?)", [answers.departmentName]);
//         console.log("\x1b[32m", `${answers.departmentName} was added to departments.`);
//         startServer();
//     });
// };

// // remove a department
// async function removeDepartment() {
//     let departments = await db.query('SELECT id, name FROM department');
//     departments.push(
//         {
//         id: null,
//         name: "Cancel"
//     });

//     inquirer.prompt([
//         {
//             name: "departmentName",
//             type: "list",
//             message: "Which dapartment do you want to remove?",
//             choices: departments.map(obj => obj.name)
//         }
//     ]).then(response => {
//         if (response.departmentName != "Cancel") {
//             let removedDepartment = departments.find(obj => obj.name === response.departmentName);
//             db.query("DELETE FROM department WHERE id=?", removedDepartment.id);
//             console.log("\x1b[32m", `${response.departmentName} was removed.`);
//         }
//         startServer();
//     });
// };

// // Options to make changes to departments
// const editDepartmentOptions = () => {
//     inquirer.prompt({
//         name: "editDeparments",
//         type: "list",
//         message: "What would you like to update?",
//         choices: [
//             "Add A New Department",
//             "Remove A Department",
//             "Return To Main Menu"
//         ]
//     }).then(responses => {
//         switch (responses.editDeparments) {
//             case "Add A New Department":
//                 addDepartment();
//                 break;
//             case "Remove A Department":
//                 removeDepartment();
//                 break;
//             case "Return To Main Menu":
//                 startServer();
//                 break;
//         }
//     });
// };

// module.exports = showDepartments;
// module.exports = editDepartmentOptions;