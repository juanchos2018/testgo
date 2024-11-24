<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Planning extends MY_Controller {

	public function __construct()
	{
		parent::__construct();
	}

	public function purchase_orders_list($supplier_id = -1)
	{
		$this->load->model('purchase_order_model');

		$data = $this->purchase_order_model->simple_list($supplier_id);

		$this->json_output($data);
	}

	public function process_purchase_order($n)
	{
		$data = array();

		if (isset($_FILES['file'])) {
			/*$this->load->library('SimpleXLSX', array($_FILES['file']['tmp_name']));
			$this->load->helper('simplexlsx');
			
			$rows = $this->simplexlsx->rows($n);

			if (count($rows) > 5) {
				if (count($rows[0]) > 27) {
					if ((isset($rows[3][1]) and $rows[3][1] === 'PRECIO TOTAL') or (isset($rows[4][1]) and $rows[4][1] === 'PRECIO TOTAL')) {
						if ($rows[3][1] === 'PRECIO TOTAL') {
							$col = 3;
						} else {
							$col = 4;
						}

						$header = array();

						for ($i = 1; $i < count($rows[$col]); $i++) {
							switch (strtolower($rows[$col][$i])) {
								case 'precio total':
									$header['total'] = $i;
									break;

								case 'articleno':
									$header['code'] = $i;
									break;

								case 'planseasondescription':
									$header['season'] = $i;
									break;

								case 'branddescription':
									$header['brand'] = $i;
									break;

								case 'salesintro':
									$header['intro'] = $i;
									break;

								case 'cantidad':
									$header['qty'] = $i;
									break;

								case 'curva':
									$header['curve'] = $i;
									break;

								case 'productgroup':
									$header['category'] = $i;
									break;

								case 'wsp':
									$header['price'] = $i;
									break;

								case 'gender':
									$header['gender'] = $i;
									break;

								case 'color':
									$header['color'] = $i;
									break;

								case 'modelname':
									$header['name'] = $i;
									break;
							}

							if (count($header) > 11) {
								break;
							}
						}

						for ($j = ++$col; $j < count($rows); $j++) {
							$qty = $rows[$j][$header['qty']];

							if (is_integer($qty) and $qty > 0) {
								$data[] = array(
									'total' 	=> +$rows[$j][$header['total']],
									'code' 		=> $rows[$j][$header['code']],
									'season' 	=> $rows[$j][$header['season']],
									'brand' 	=> $rows[$j][$header['brand']],
									'intro' 	=> xlsx_date($rows[$j][$header['intro']]),
									'qty' 		=> +$rows[$j][$header['qty']],
									'curve' 	=> $rows[$j][$header['curve']],
									'category' 	=> $rows[$j][$header['category']],
									'price' 	=> +$rows[$j][$header['price']],
									'gender' 	=> $rows[$j][$header['gender']],
									'color' 	=> $rows[$j][$header['color']],
									'name' 		=> $rows[$j][$header['name']],
									'selected' 	=> true
								);
							}
						}
					}
				}
			}*/
		}

		$this->output->set_content_type('application/json')->set_output(json_encode($data));
	}
}
