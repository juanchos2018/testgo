CREATE TABLE roles
(
  id serial NOT NULL,
  description character varying(50),
  CONSTRAINT "PK_roles_id" PRIMARY KEY (id)
);

CREATE TABLE modules
(
  id serial NOT NULL,
  description character varying(50),
  CONSTRAINT "PK_modules_id" PRIMARY KEY (id)
);

CREATE TABLE actions
(
  id serial NOT NULL,
  description character varying(20),
  CONSTRAINT "PK_actions_id" PRIMARY KEY (id)
);

CREATE TABLE access_control
(
  id serial NOT NULL,
  role_id integer,
  module_id integer,
  action_id integer,
  CONSTRAINT "PK_access_control_id" PRIMARY KEY (id),
  CONSTRAINT "FK_access_control_action" FOREIGN KEY (action_id)
      REFERENCES actions (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "FK_access_control_module" FOREIGN KEY (module_id)
      REFERENCES modules (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "FK_access_control_role" FOREIGN KEY (role_id)
      REFERENCES roles (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);

INSERT INTO roles (description) VALUES ('Administrador'), ('Operador de Ventas');
INSERT INTO actions (description) VALUES ('view'), ('add'), ('edit'), ('remove'), ('delete');
INSERT INTO modules (description) VALUES ('users'), ('sales');
INSERT INTO access_control (role_id, module_id, action_id) VALUES (1, 1, 1);
INSERT INTO access_control (role_id, module_id, action_id) VALUES (1, 1, 2);
INSERT INTO access_control (role_id, module_id, action_id) VALUES (1, 1, 3);
INSERT INTO access_control (role_id, module_id, action_id) VALUES (1, 1, 4);
INSERT INTO access_control (role_id, module_id, action_id) VALUES (1, 1, 5);
INSERT INTO access_control (role_id, module_id, action_id) VALUES (1, 2, 1);
INSERT INTO access_control (role_id, module_id, action_id) VALUES (1, 2, 2);
INSERT INTO access_control (role_id, module_id, action_id) VALUES (1, 2, 3);
INSERT INTO access_control (role_id, module_id, action_id) VALUES (1, 2, 4);
INSERT INTO access_control (role_id, module_id, action_id) VALUES (1, 2, 5);

ALTER TABLE users ADD COLUMN role_id INTEGER;
ALTER TABLE users ADD CONSTRAINT fk_role_id FOREIGN KEY (role_id) REFERENCES roles(id);
UPDATE users SET role_id = 1;