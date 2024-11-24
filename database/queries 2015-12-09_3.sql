/* Cambiar el state de las ventas, separándolas para el cierre de caja */
UPDATE sales SET state = (CASE WHEN refund_origin_id IS NOT NULL OR refund_target_id IS NOT NULL THEN 'REFUNDED' ELSE 'SOLD' END)::state_type
WHERE active = TRUE;

/* OJO!!! queda pendiente actualizar en PRODUCCION los estados de venta que se originaron de NOTAS DE CREDITO como SOLD FROM REFUND
también no olvidar, asignar a esas ventas el refund_origin_id con el ID de la NOTA DE CREDITO que lo origina */



/* OJO!!! si ejecutamos esta consulta en producción ANTES de abrir caja o DESPUES de cerrarla, debemos poner el estado de cierre como CIERRE TOTAL */
UPDATE sales SET closing_state = 'CIERRE TOTAL';