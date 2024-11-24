/*Produccion - SalePoints*/
INSERT INTO sale_points (address,printer_serial,branch_detail_id,description,active) VALUES 
('MDAtMDAtMDAtMDAtMDAtMDA=','FFGF211892','1','LFA-LEGUIA','t'),
('MDAtMDAtMDAtMDAtMDAtMDA=','FFCF262628','1','GAFCO-LEGUIA','t');

/*Produccion - Series*/
INSERT INTO series (serie,serial_number,voucher,sale_point_id,branch_detail_id,subsidiary_journal) VALUES 
('1','33775','TICKET','1','1','07'),/*Leguia LFA*/
('1','1','TICKET','2','2','07'),/*Leguia GAFCO*/
('5','30000','BOLETA',NULL,'1','08'),/*Leguia LFA*/
('4','40000','BOLETA',NULL,'1','09'),/*Leguia LFA*/
('1','33775','NOTA DE CREDITO',1,'1','03'),/*Leguia LFA*/
('1','10000','BOLETA',NULL,'3','06'),/*Vigil LFA*/
('2','20000','BOLETA',NULL,'3','04'),/*Vigil LFA*/
('3','30000','BOLETA',NULL,'3','05');/*Vigil LFA*/