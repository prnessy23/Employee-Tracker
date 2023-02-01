INSERT INTO department (name)
VALUES
('IT'),
('Finance & Accounting'),
('Sales & Marketing'),
('Operations');

INSERT INTO role (title, salary, department_id)
VALUES
('Salesperson', 80000, 3),
('Lead Engineer', 150000, 1),
('Software Engineer', 120000, 1),
('Account Manager',160000, 3),
('Accountant', 125000, 2),
('Financial Analyst', 150000, 2),
('Legal Team Lead', 250000, 4)
('Lawyer', 190000 , 4);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES
('Ashley','Rodriguez',2, null),
('Kevin','Tupik',1,1),
('Kumal','Singh', 4, null),
('Malia','Brown',3,3),
('Dina','Ferrara',6, null),
('Eric','Minor',5,5),
('Sarah','Lourd',7,null),
('Tom','Allen',8,7);
