USE employee_db;

    INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Angela', 'Gates', 9, NULL),
    ('Bonnie', 'Perkins', 10, NULL),
    ('Joe', 'GEONI', 2, 2),
    ('Kimberly', 'Bissot', 11, NULL),
    ('Lisa', 'Landry', 4, 5),
    ('Frank', 'DELLING', 12, NULL),
    ('Michael', 'Markle', 6, NULL),
    ('Patrick', 'Mourgos', 7, 3),
    ('Rose', 'King', 3, 1),
    ('Todd', 'Hunold', 5, NULL);

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
    ('Risk Manager', 100000, 7),
    ('Operations Manager', 110000, 3),
    ('Senior Risk Management Specialist', 120000, 7),
    ('Customer Service Representative', 70000, 8),
    ('Manager', 130000, 4),
    ('Manager', 130000, 6),
    ('Manager', 130000, 5),
    ('Manager', 130000, 7);









