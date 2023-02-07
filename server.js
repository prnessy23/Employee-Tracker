const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

require('dotenv').config()

const connection = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: process.env.user,
    password: process.env.password,
    database: process.env.db_
});

connection.connect((err) => {
    if (err) throw err;
    console.log("connected as id" + connection.threadId);
    promptUser()
});

function promptUser() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'choices',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Update an employee manager',
                'View employees by department',
                'Delete a department',
                'Delete a role',
                'Delete an employee',
                'View department budgets',
                'No Action',
            ]
        }
    ])
        .then((answers) => {
            const { choices } = answers;

            if (choices === "View all departments") {
                showDepartments();
            }
            else if (choices === "View all roles") {
                showRoles();
            }
            else if (choices === "View all employees") {
                showEmployees();
            }
            else if (choices === "Add a department") {
                addDepartment();
            }
            else if (choices === "Add a role") {
                addRole();
            }
            else if (choices === "Add an employee") {
                addEmployee();
            }
            else if (choices === "Update an employee role") {
                updateEmployee();
            }
            else if (choices === "Update an employee manager") {
                updateManager();
            }
            else if (choices === "View employees by department") {
                employeeDepartment();
            }
            else if (choices === "Delete a department") {
                deleteDepartment();
            }
            else if (choices === "Delete a role") {
                deleteRole();
            }
            else if (choices === "Delete an employee") {
                deleteEmployee();
            }
            else if (choices === "View department budgets") {
                viewBudget();
            }
            else {
                connection.end()
            };
        });
};
// creating function to show all departments

function showDepartments() {
    console.log("Showing all departments...\n");

    const sql = `SELECT department.id AS id, department.name AS department FROM department`;

    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    })
};
function showRoles() {
    console.log("Showing all roles...\n");

    const sql = `SELECT role.id, role.title, department.name AS department 
            FROM role
             INNER JOIN department ON role.department_id = department.id`;

    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    })
};
function showEmployees() {
    console.log("Showing all employees...\n");
    const sql = `Select employee.id,
                employee.first_name,
                employee.last_name,
                role.title,
                department.name AS department,
                role.salary,
                CONCAT (manager.first_name," ",manager.last_name) AS manager
                FROM employee
                    LEFT JOIN role ON employee.role_id = role.id
                    LEFT JOIN department ON role.department_id = department.id
                    LEFT JOIN employee manager ON employee.manager_id = manager.id`;

    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};
// Add department function
function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'addDept',
            message: "What department do you want to add?",
            validate: addDept => {
                if (addDept) {
                    return true;
                } else {
                    console.log("Please enter a department");
                    return false;
                }
            }
        }
    ])
        .then(answer => {
            const sql = `INSERT INTO department (name)
        VALUES (?)`;
            connection.query(sql, answer.addDept, (err, result) => {
                if (err) throw err;
                console.log('Added' + answer.addDept + 'to departments!');

                showDepartments();
            });
        });
};
// Adding role function
function addRole() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'role',
            message: "What role do you want to add?",
            validate: addRole => {
                if (addRole) {
                    return true;
                } else {
                    console.log("Please enter a role");
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'salary',
            message: "What is the salary of this role?",
            validate: addSalary => {
                if (isNaN(addSalary)) {
                    return false;
                } else {
                    console.log("Please enter a salary");
                    return true;
                }
            }
        }
    ])
        .then((answer) => {
            const params = [answer.role, answer.salary];

            const roleSql = `SELECT name, id FROM department`;

            connection.query(roleSql, (err, data) => {
                if (err) throw err;

                const dept = data.map(({ name, id }) => ({ name: name, value: id }));

                inquirer
                    .prompt([
                        {
                            type: "list",
                            name: "dept",
                            message: "What department is this role in?",
                            choices: dept
                        }
                    ])
                    .then((deptChoice) => {
                        const dept = deptChoice.dept;
                        params.push(dept);

                        const sql = `INSERT INTO role (title, salary,department_id)
                    VALUES (?,?,?)`;

                        connection.query(sql, params, (err, result) => {
                            if (err) throw err;
                            console.log('Added' + answer.role + 'to roles!');

                            showRoles();
                        });
                    });
            });
        });
};
function addEmployee() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "What is employee`s first name?",
            validate: addFirst => {
                if (addFirst) {
                    return true;
                } else {
                    console.log("Please enter a first name");
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What is the employee`s last name?",
            validate: addLast => {
                if (addLast) {
                    return true;
                } else {
                    console.log('Please enter a last name');
                    return false;
                }
            }
        }
    ])
        .then(answer => {
            const params = [answer.firstName, answer.lastName];

            const roleSql = `SELECT role.id, role.title FROM role`;

            connection.query(roleSql, (err, data) => {
                if (err) throw err;

                const roles = data.map(({ id, title }) => ({ name: title, value: id }));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: "What is the employee`s role?",
                        choices: roles,
                    }
                ])
                    .then((roleChoice) => {
                        const role = roleChoice.role;
                        params.push(role);

                        const managerSql = `SELECT * FROM employee`;

                        connection.query(managerSql, (err, data) => {
                            if (err) throw err;

                            const managers = data.map(({ id, first_name, last_name }) => ({
                                name: first_name + " " + last_name, value: id,
                            }));

                            inquirer.prompt([
                                {
                                    type: 'list',
                                    name: 'manager',
                                    message: "Who is the employee`s manager?",
                                    choices: managers
                                }
                            ])
                                .then(managerChoice => {
                                    const manager = managerChoice.manager;
                                    params.push(manager);

                                    const sql = ` INSERT INTO employee (first_name, last_name, role_id, manager_id)
                    VALUES (?,?,?,?)`;

                                    connection.query(sql, params, (err, result) => {
                                        if (err) throw err;
                                        console.log("Employee has been added!");
                                        showEmployees();
                                    });
                                });
                        });
                    });
            });
        });
};
function updateEmployee() {
    const employeeSql = `SELECT * FROM employee`;

    connection.query(employeeSql, (err, data) => {
        if (err) throw err;

        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id, }));

        inquirer.prompt([
            {
                type: "list",
                name: "employee",
                message: "Which employee would you like to update?",
                choices: employees
            }
        ])
            .then((empChoice) => {
                const employee = empChoice.name;
                const params = [];
                params.push(employee);

                const roleSql = `SELECT * FROM role`;

                connection.query(roleSql, (err, data) => {
                    if (err) throw err;

                    const roles = data.map(({ id, title }) => ({ name: title, value: id, }));

                    inquirer.prompt([
                        {
                            type: "list",
                            name: "role",
                            message: "What is employee`s new role?",
                            choices: roles
                        }
                    ])
                        .then(roleChoice => {
                            const role = roleChoice.role;
                            // const employee = roleChoice.employee
                            params.push(role);

                            let employee = params[0];
                            params[0] = role;
                            params[1] = employee;

                            console.log(params);

                            const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

                            connection.query(sql, params, (err, result) => {
                                if (err) throw err;
                                console.log("Employee has been updated!");

                                showEmployees();
                            });
                        });
                });
            });
    });
};

function updateManager() {
    const employeeSql = `SELECT * FROM employee`;

    connection.query(employeeSql, (err, data) => {
        if (err) throw err;

        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

        inquirer.prompt([{
            type: 'list',
            name: 'name',
            message: 'Which employee would you like to update?',
            choices: employees
        }

        ])
            .then(empChoice => {
                const employee = empChoice.name;
                const params = [];
                params.push(employee);

                const managerSql = `SELECT * FROM employee`;
                connection.query(managerSql, (err, data) => {
                    if (err) throw err;

                    const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'manager',
                            message: 'Who is the employee`s manager?',
                            choices: [
                                { name: 'None', value: null },
                                ...managers
                            ]
                        }
                    ])
                        .then(managerChoice => {
                            const manager = managerChoice.manager;
                            params.push(manager);

                            let employee = params[0]
                            params[0] = manager
                            params[1] = employee

                            const sql = `UPDATE employee SET manager_id = ? WHERE id =?`;

                            connection.query(sql, params, (err, result) => {
                                if (err) throw err;
                                console.log('Employee has been update!');

                                showEmployees();
                            });
                        });
                });
            });

    });
};

// creating function to view employee by department
function employeeDepartment() {
    console.log("Showing employee by departments...\n");
    const sql = `SELECT employee.first_name
                employee.last_name
                department.name AS department
                FROM employee
                LEFT JOIN role ON employee.role_id = role.id
                LEFT JOIN department ON role.department_id =department.id`;

    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};
// creating function to delete department
function deleteDepartment() {
    const deptSql = `SELECT * FROM department`;

    connection.query(deptSql, (err, data) => {
        if (err) throw err;

        const dept = data.map(({ name, id }) => ({ name: name, value: id }));

        inquirer
            .prompt([
                {
                    type: "list",
                    name: "dept",
                    message: "What department do you want to delete?",
                    choices: dept,
                },
            ])
            .then((deptChoice) => {
                const dept = deptChoice.dept;
                const sql = `DELETE FROM department WHERE id = ?`;

                connection.query(sql, dept, (err, result) => {
                    if (err) throw err;
                    console.log("Succesfully deleted!");

                    showDepartments();
                });
            });
    });
};

// creating function to delete roles
function deleteRole() {
    const roleSql = `SELECT * FROM role`;

    connection.query(roleSql, (err, data) => {
        if (err) throw err;

        const role = data.map(({ title, id }) => ({ name: title, value: id }));

        inquirer
            .prompt([
                {
                    type: "list",
                    name: "role",
                    message: "What role do you want to delete?",
                    choices: role,
                }
            ])
            .then((roleChoice) => {
                const role = roleChoice.role;
                const sql = `DELETE FROM role WHERE id = ?`;

                connection.query(sql, role, (err, result) => {
                    if (err) throw err;
                    console.log("Succesfully deleted!");

                    showRoles();
                });
            });
    });
};
function deleteEmployee() {
    const employeeSql = `SELECT * FROM employee`;

    connection.query(employeeSql, (err, data) => {
        if (err) throw err;

        const employees = data.map(({ id, first_name, last_name }) => ({
            name: first_name + " " + last_name,
            value: id,
        }));

        inquirer.prompt([
            {
                type: "list",
                name: "name",
                message: "Which employee do you want to delete?",
                choices: employees,
            }
        ])
            .then((empChoice) => {
                const employee = empChoice.name;
                const sql = `DELETE FROM employee WHERE id = ?`;

                connection.query(sql, employee, (err, result) => {
                    if (err) throw err;
                    console.log("Succesfully deleted!");

                    showEmployees();
                });
            });
    });
};
// creating function to view department budget
function viewBudget() {
    console.log("Showing budget by department...\n");

    const sql = `SELECT department_id AS id,
                department.name AS department,
                SUM(salary) AS budget
                FROM role
                JOIN department ON role.department_id =department.id GROUP BY department_id`;

    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);

        promptUser();
    });
};
