const mysql = require('mysql2')
const inquirer = require('inquirer');
const cTable = require(console.table);

require('dotenv').config()

const connection = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: process.env.MYSQL_PASSWORD,
   database: 'employee_db' 
});

connection.connect(err => {
    if (err) throw err;
    console.log('connected as id' + connection.threadId);
    afterConnection();
});

afterConnection = () => {
    console.log ("************************")
    console.log ("*                      *")
    console.log ("*   EMPLOYEE MANAGER   *")
    console.log ("*                      *")
    console.log ("************************")
    promptUser();
};

const promptUser =() => {
inquirer.prompt ([
 { 
    type: 'list',
    name: 'choices',
    message: 'What would you like to do?',
    choices: ['View all departments',
              'View all roles',
              'View all employees',
              'Add a department',
              'Add a role',
              'Add an employee',
              'Update an employee role',
              'Update an employee mamager',
              'View employees by department',
              'Delete a department',
              'Delete a role',
              'Delete an employee',
              'View department budgets',
              'No Action']
}
])
.then ((answers))

}
    


