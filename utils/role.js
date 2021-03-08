// const inquirer = require('inquirer');
// const db = require('./Database');
// const startServer = require('../server');

// // Builds a table which shows existing roles and their departments
// async function showRoles() {
//     console.log(' ');
//     await db.query('SELECT r.id, title, salary, name AS department FROM role r LEFT JOIN department d ON department_id = d.id', (err, res) => {
//         if (err) throw err;
//         console.table(res);
//         startServer();
//     });
// };

// // add a new role
// async function addRole() {
//     let departments = await db.query('SELECT id, name FROM department');

//     inquirer.prompt([
//         {
//             name: "roleName",
//             type: "input",
//             message: "Enter new role title(Required):",
//             validate: roleInput => {
//                 if (roleInput) {
//                     return true;
//                 } else {
//                     console.log("Please enter a new role title");
//                     return false;
//                 }
//             }
//         },
//         {
//             name: "salary",
//             type: "input",
//             message: "Enter role's salary:",
//             validate: input => {
//                 if (!isNaN(input)) {
//                     return true;
//                 }
//                 return "Please enter a valid number."
//             }
//         },
//         {
//             name: "roleDepartment",
//             type: "list",
//             message: "Choose the role's department:",
//             choices: departments.map(obj => obj.name)
//         }
//     ]).then(answers => {
//         let departmentID = departments.find(obj => obj.name === answers.roleDepartment).id
//         db.query("INSERT INTO role (title, salary, department_id) VALUES (?)", [[answers.roleName, answers.salary, departmentID]]);
//         console.log("\x1b[32m", `${answers.roleName} was added. Department: ${answers.roleDepartment}`);
//         startServer();
//     });
// };

// // remove a role from the database
// async function removeRole() {
//     let roles = await db.query('SELECT id, title FROM role');
//     roles.push(
//         {
//             id: null, 
//             title: "Cancel"
//         });

//     inquirer.prompt([
//         {
//             name: "roleName",
//             type: "list",
//             message: "Which role do you want to remove?",
//             choices: roles.map(obj => obj.title)
//         }
//     ]).then(response => {
//         if (response.roleName != "Cancel") {
//             let removedRole = roles.find(obj => obj.title === response.roleName);
//             db.query("DELETE FROM role WHERE id=?", removedRole.id);
//             console.log("\x1b[32m", `${response.roleName} was removed.`);
//         }
//         startServer();
//     });
// };

// // Update a role
// async function updateRole() {
//     let roles = await db.query('SELECT id, title FROM role');
//     roles.push(
//         {
//             id: null,
//             title: "Cancel"
//         });
//     let departments = await db.query('SELECT id, name FROM department');

//     inquirer.prompt([
//         {
//             name: "roleName",
//             type: "list",
//             message: "Which role do you want to update?",
//             choices: roles.map(obj => obj.title)
//         }
//     ])
//     .then(response => {
//         if (response.roleName == "Cancel") {
//             startServer();
//             return;
//         }
//         inquirer.prompt([
//             {
//                 name: "salary",
//                 type: "input",
//                 message: "Enter role's salary:",
//                 validate: salaryInput => {
//                     if (!isNaN(salaryInput)) {
//                         return true;
//                     }
//                     return "Please enter a valid number.";
//                 }
//             },
//             {
//                 name: "roleDepartment",
//                 type: "list",
//                 message: "Choose the role's department:",
//                 choices: departments.map(obj => obj.name)
//             }
//         ])
//         .then(answers => {
//             let departmentID = departments.find(obj => obj.name === answers.roleDepartment).id
//             let roleID = roles.find(obj => obj.title === response.roleName).id
//             db.query("UPDATE role SET title=?, salary=?, department_id=? WHERE id=?", [response.roleName, answers.salary, departmentID, roleID]);
//             console.log("\x1b[32m", `${response.roleName} was updated.`);
//             startServer();
//         });
//     });
// };

// // Options to make changes to roles
// const editRoleOptions = () => {
//     inquirer.prompt({
//         name: "editRoles",
//         type: "list",
//         message: "What would you like to update?",
//         choices: [
//             "Add A New Role",
//             "Update A Role",
//             "Remove A Role",
//             "Return To Main Menu"
//         ]
//     })
//     .then(responses => {
//         switch (responses.editRoles) {
//             case "Add A New Role":
//                 addRole();
//                 break;
//             case "Update A Role":
//                 updateRole();
//                 break;
//             case "Remove A Role":
//                 removeRole();
//                 break;
//             case "Return To Main Menu":
//                 startServer();
//                 break;
//         }
//     });
// };

// module.exports = showRoles;
// module.exports = editRoleOptions;