const mysql = require('mysql');
const inquirer = require("inquirer");
const cTable = require("console.table");

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