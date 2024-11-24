<?php if ( ! defined('BASEPATH')) exit('No se permite el acceso directo al script');

class Printer_erp {
   var $params;
   var $zofra;
   var $sum;

   function header($params,$zofra){
   		
   		$_fecha_emision = date('d/m/Y');
		date_default_timezone_set("America/Lima");
		$_hora=date("H:i:s");  

		$header = "<div class='gato align-center'>".$params['company_name']."<br>";
		  		
      	$header .= "DIRECCION FISCAL :".$params['fiscal']."<br>";
      	$header .= $params['department']."</div>";
      	$header .= "SUC : ".$params['pto_venta']."<br>";
      	$header .= $params['department']."<br>";
      	$header .= "RUC: ".$params['ruc']."<br>";
   		$header .= str_pad('-', 65, "-", STR_PAD_BOTH)."<br>";
   		$header .= "<div id='columna1'>
					No Serie &nbsp;: ".$params['print_serie']."<br>
					Ticket No : ".str_pad($params['serie'], 3,'0',STR_PAD_LEFT)."-".str_pad($params['serial_number'], 6,'0',STR_PAD_LEFT)."
					</div><div id='columna2'>
					".$_fecha_emision."<br>
					".$_hora."
					</div>";
		$ruc = strlen($params['customer']['id_number']);
		$header .= "<div>
						<div id='columna3'>Nombre&nbsp;&nbsp;:</div>
						<div id='columna4'>".$params['customer']['full_name']."
					</div>";
		
		if($ruc > 8){
			$header .=	"<div>
						<div id='columna3'>RUC&nbsp;:</div>
						<div id='columna4'>".$params['customer']['id_number']."
					</div>";
		}
		
		$header .=	"<div>
						<div id='columna3'>Direccion:</div>
						<div id='columna4'>".$params['customer']['address']."
					</div>";
   		$header .= str_pad('-', 65, "-", STR_PAD_BOTH)."<br>";
    	return $header;
   }
   function footer($params,$zofra)
   {	
   		$footer = str_pad('-', 65, "-", STR_PAD_BOTH)."<br>";
   		if($zofra == TRUE){
	   		$footer .= "<p>VENTA EXONERADA DEL IGV-ISC-IPM.<br>PROHIBIDA LA VENTA FUERA DE LA ZONA COMERCIAL DE TACNA. Res. de Superintendencia N° 007-99/SUNAT Reglamento de Comprob. de Pago, D. Leg. N° 821, Art. 12 D.S. N° 112-97-EF.<br>EFECTUE SU DECLARACION JURADA ANTE ADUANAS</p><br>";
   		}else{
   			$footer .= "<p>RÉGIMEN GENERAL CON IMPUESTO PAGADO PARA TODA LA REPUBLICA DEL PERÚ INCLUIVO IGV<p><br>";
   		}
		$footer .= "NO HAY DEVOLUCION DE DINERO.<br>TODO CAMBIO DE MERCADERIA SE HARA DENTRO DE LAS 48 HORAS PREVIA PRESENTACION DEL COMPROBANTE Y VERIFICACION DE LA MISMA";
		return $footer;
   }

   function ticket($params,$zofra)
   {		/*print_r('</pre>');
			print_r($params);price
			print_r('</pre>');*/
		/*	print_r('</pre>');
			print_r($params);
			print_r('</pre>');*/
			extract($params);
			/*print_r('</pre>');
			print_r($sizes);
			print_r('</pre>');*/
   		$total = 400;
   		$sum = 0;
   		$ticket_imp = $this->header($params,$zofra);
   		
   		$ticket_imp .= "<table style='font-size: 11px'>
			<thead>
				<th colspan='4' width='350px'></th>
			</thead>";
			$n=count($products);
			for ($i=0;$i<$n;$i++) {
	   			$ticket_imp .= "<tr>
	   				<td>".$products[$i]['code']."</td>
					<td colspan='3' style='text-align:right'>";
				if($products[$i]['regime']=='ZOFRA'){
					$ticket_imp .= "D.S.".$products[$i]['output_statement']." ";
				}
				$ticket_imp .= $products[$i]['description']." (T.".$sizes[$i]['text'].")</td>
					</tr><tr class='line'>
					<td colspan='2'class='col1'>".$quantities[$i]." x ".number_format($price[$i], 2, ',', ' ')."</td>
					<td colspan='2'style='text-align:right'>".number_format($subtotal[$i], 2, ',', ' ')."</td>
				</tr>";
				$sum = $sum + $subtotal[$i];
				
   			}
		$ticket_imp .= "</table>";
		$ticket_imp .= "<div class='align-left'>Efectivo   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; S/".str_pad("".number_format($cash_amount, 2, ',', ' '), 20, "*", STR_PAD_LEFT)."<br>";
		$ticket_imp .= "Tarjeta   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; S/".str_pad("".number_format($credit_card_amount, 2, ',', ' '), 20, "*", STR_PAD_LEFT)."<br>";
		$ticket_imp .= "VALOR DE VENTA   &nbsp;&nbsp;&nbsp; S/".str_pad("".number_format($sum, 2, ',', ' '), 20, "*", STR_PAD_LEFT)."<br>";
		$ruc = strlen($params['customer']['id_number']);
		if($ruc > 8){
			$ticket_imp .= "IGV (18%)   &nbsp;&nbsp;&nbsp; S/".str_pad("".number_format($sum, 2, ',', ' '), 20, "*", STR_PAD_LEFT)."<br>";
		}
		$ticket_imp .= "</div>";
		$ticket_imp .= str_pad('-', 65, "-", STR_PAD_BOTH)."<br>";
		$ticket_imp .= "<div>Usted ha Ganado 11 puntos(s), Acum. 219 punto(s) LFA.</div>";
   		$ticket_imp .= $this->footer($params,$zofra);
   		return $ticket_imp;
   }
}
?>