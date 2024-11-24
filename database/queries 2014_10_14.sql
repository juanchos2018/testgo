/* Queries de Migracion de la BD */
/* No ejecutar en la base de datos */
SET client_encoding TO LATIN1;
COPY customers(id_number,name,address) FROM 'E:/Bizagi/clientes.csv' USING DELIMITERS ';'

