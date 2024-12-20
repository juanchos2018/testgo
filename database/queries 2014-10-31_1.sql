﻿---- Reestructurando la tabla de tallas
ALTER TABLE size ALTER COLUMN description TYPE CHARACTER VARYING(15);
ALTER TABLE size ALTER COLUMN description2 TYPE CHARACTER VARYING(5);
ALTER TABLE size RENAME COLUMN description2 TO code;
---- Llenando con datos
INSERT INTO size (code, description) VALUES ('0', '0');
INSERT INTO size (code, description) VALUES ('1', '1');
INSERT INTO size (code, description) VALUES ('10', '10');
INSERT INTO size (code, description) VALUES ('11', '11');
INSERT INTO size (code, description) VALUES ('12', '12');
INSERT INTO size (code, description) VALUES ('13', '13.5');
INSERT INTO size (code, description) VALUES ('14', '13');
INSERT INTO size (code, description) VALUES ('15', '1.5');
INSERT INTO size (code, description) VALUES ('17', '17');
INSERT INTO size (code, description) VALUES ('18', '18');
INSERT INTO size (code, description) VALUES ('19', '19');
INSERT INTO size (code, description) VALUES ('2', '2');
INSERT INTO size (code, description) VALUES ('20', '20');
INSERT INTO size (code, description) VALUES ('21', '21');
INSERT INTO size (code, description) VALUES ('22', '22');
INSERT INTO size (code, description) VALUES ('23', '23');
INSERT INTO size (code, description) VALUES ('24', '24');
INSERT INTO size (code, description) VALUES ('25', '2.5');
INSERT INTO size (code, description) VALUES ('26', '26');
INSERT INTO size (code, description) VALUES ('27', '27');
INSERT INTO size (code, description) VALUES ('28', '28');
INSERT INTO size (code, description) VALUES ('29', '29');
INSERT INTO size (code, description) VALUES ('2X', '2XS');
INSERT INTO size (code, description) VALUES ('3', '3');
INSERT INTO size (code, description) VALUES ('30', '30');
INSERT INTO size (code, description) VALUES ('31', '31');
INSERT INTO size (code, description) VALUES ('32', '32');
INSERT INTO size (code, description) VALUES ('33', '33');
INSERT INTO size (code, description) VALUES ('34', '34');
INSERT INTO size (code, description) VALUES ('35', '3.5');
INSERT INTO size (code, description) VALUES ('36', '35');
INSERT INTO size (code, description) VALUES ('37', '37');
INSERT INTO size (code, description) VALUES ('38', '38');
INSERT INTO size (code, description) VALUES ('39', '39');
INSERT INTO size (code, description) VALUES ('3X', '3XS');
INSERT INTO size (code, description) VALUES ('4', '4');
INSERT INTO size (code, description) VALUES ('40', '40');
INSERT INTO size (code, description) VALUES ('41', '41');
INSERT INTO size (code, description) VALUES ('42', '42');
INSERT INTO size (code, description) VALUES ('43', '43');
INSERT INTO size (code, description) VALUES ('44', '44');
INSERT INTO size (code, description) VALUES ('45', '4.5');
INSERT INTO size (code, description) VALUES ('46', '45');
INSERT INTO size (code, description) VALUES ('4Y', '4Y');
INSERT INTO size (code, description) VALUES ('5', '5');
INSERT INTO size (code, description) VALUES ('51', '10.5');
INSERT INTO size (code, description) VALUES ('52', '11.5');
INSERT INTO size (code, description) VALUES ('53', '12.5');
INSERT INTO size (code, description) VALUES ('55', '5.5');
INSERT INTO size (code, description) VALUES ('57', '4T');
INSERT INTO size (code, description) VALUES ('58', '12M');
INSERT INTO size (code, description) VALUES ('5Y', '5Y');
INSERT INTO size (code, description) VALUES ('6', '6');
INSERT INTO size (code, description) VALUES ('65', '6.5');
INSERT INTO size (code, description) VALUES ('6Y', '6Y');
INSERT INTO size (code, description) VALUES ('7', '7');
INSERT INTO size (code, description) VALUES ('75', '7.5');
INSERT INTO size (code, description) VALUES ('78', '25');
INSERT INTO size (code, description) VALUES ('8', '8');
INSERT INTO size (code, description) VALUES ('81', '18M');
INSERT INTO size (code, description) VALUES ('82', '2T');
INSERT INTO size (code, description) VALUES ('85', '8.5');
INSERT INTO size (code, description) VALUES ('88', '46');
INSERT INTO size (code, description) VALUES ('8Y', '8Y');
INSERT INTO size (code, description) VALUES ('9', '9');
INSERT INTO size (code, description) VALUES ('95', '9.5');
INSERT INTO size (code, description) VALUES ('99', '36');
INSERT INTO size (code, description) VALUES ('DY', '10Y');
INSERT INTO size (code, description) VALUES ('L', 'L');
INSERT INTO size (code, description) VALUES ('M', 'M');
INSERT INTO size (code, description) VALUES ('NS', 'NO SIZE');
INSERT INTO size (code, description) VALUES ('S', 'S');
INSERT INTO size (code, description) VALUES ('ST', 'S/T');
INSERT INTO size (code, description) VALUES ('U', 'UNICA');
INSERT INTO size (code, description) VALUES ('XL', 'XL');
INSERT INTO size (code, description) VALUES ('XS', 'XS');
INSERT INTO size (code, description) VALUES ('XX', 'XXL');
