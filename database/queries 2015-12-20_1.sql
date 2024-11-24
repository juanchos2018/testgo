/* Crear el rol de desarrollador */
INSERT INTO roles
(description, all_branches_granted)
VALUES
('Desarrollador', true);

/* Crear el usuario para desarrollador (OJO: la contraseña es miau) */
INSERT INTO users
(email, password, username, role_id, avatar_mode, avatar, company_id)
VALUES
('renato.esis@gmail.com', '6HPpY6QL1eNnE', 'renato', (SELECT roles.id FROM roles WHERE roles.description = 'Desarrollador'), 8, 'images/avatar/8.png', 1);
