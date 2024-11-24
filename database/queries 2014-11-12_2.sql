CREATE TABLE sale_points
(
  id serial NOT NULL,
  address character varying(15) NOT NULL,
  printer_serial character varying(10),
  cash real NOT NULL DEFAULT 0
);

INSERT INTO sale_points (address, printer_serial, cash) VALUES ('127.0.0.1', 'FFGFXXXX', 0);