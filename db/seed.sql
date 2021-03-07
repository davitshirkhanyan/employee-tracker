USE employee_db;

    INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Angela', 'Gates', 2, NULL),
    ('Bonnie', 'Perkins', 1, NULL),
    ('Frank', 'DELLING', 3, 1),
    ('Joe', 'GEONI', 2, 2),
    ('Kimberly', 'Bissot', 4, NULL),
    ('Lisa', 'Landry', 1, 1),
    ('Michael', 'Markle', 6, NULL),
    ('Patrick', 'Mourgos', 7, 2),
    ('Rose', 'King', 5, NULL),
    ('Todd', 'Hunold', 5, 1);

    INSERT INTO department (name)
VALUES
    ('Marketing'),
    ('Human Resources'),
    ('Operations'),
    ('Finance'),
    ('Sales'),
    ('Technical Support'),
    ('Management'),
    ('Customer Service');

    INSERT INTO role (title, salary, department_id)
VALUES
    ('Marketing Manager', 100000, 1),
    ('Software Engineer', 125000, 6),
    ('Accountant', 125000, 4),
    ('Merchandiser', 97000, 5),
    ('Superviser', 130000, 2),
    ('Operations Manager', 110000, 3),
    ('Senior Risk Management Specialist', 120000, 7),
    ('Customer Service Representative', 70000, 8);








