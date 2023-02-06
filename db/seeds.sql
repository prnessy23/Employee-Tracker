INSERT INTO department (name)
VALUES
('IT'),
('Finance & Accounting'),
('Sales & Marketing'),
('Operations'),



INSERT INTO role (title, salary, department_id)
VALUES

('Lead Engineer', 150000, 1),
('Software Engineer', 120000, 1),
('Account Manager',160000, 2),
('Salesperson', 80000, 2),
('Accountant', 150000, 3),
('Financial Analyst', 125000, 3),
('Legal Team Lead', 250000, 4)
('Lawyer', 190000 , 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES

('Kevin','Tupik', 1, 1),
('Kumal','Singh', 3, null),
('Malia','Brown', 2 ,2),
('Ashley','Rodriguez',4, null),
('Dina','Ferrara',5 ,3 ),
('Eric','Minor', 7, null),
('Sarah','Lourd', 6, 4),
('Tom','Allen', 8, null);