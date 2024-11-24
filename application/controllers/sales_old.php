<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
//
class Sales extends MY_Controller {

	public function __construct()
	{
		parent::__construct();

		$this->load->model('customer_model');
		$this->load->model('employee_model');
		$this->load->model('sale_model');
		$this->load->model('sale_detail_model');
		$this->load->model('size_model');
	}

	public function index()
	{
		$branch_id = $this->session->userdata('user_branch');
		$company_id = $this->session->userdata('user_company');
		$data['records'] = $this->sale_model->get_all($branch_id,$company_id);

		$this->load->view('sales/index.php',$data);
	}

	public function point()
	{
		$this->load->model('credit_card_type_model');
		$this->load->model('sale_point_model');
		$this->load->model('regime_model');
		$this->load->model('exchange_rate_model');
		$this->load->model('pack_model');
		$this->load->model('campaign_model');

		$data['card_types'] = $this->credit_card_type_model->get_list();
		$data['employees'] = $this->employee_model->get_salesman('employees.active = TRUE');
		$data['exchange_rates'] =  $this->exchange_rate_model->get_all();
		$data['taxes'] =  $this->regime_model->get_list();
		$data['available_campaigns'] =  $this->campaign_model->get_available();
		$data['available_packs'] =  $this->pack_model->get_available();
		
		$data['sale_points'] = $this->sale_point_model->get_list(NULL, "sale_points.active = 't'");
		
		$this->load->view('sales/point', $data);
	}
	
	public function add()
	{
		$this->load->model('credit_card_type_model');
		$this->load->model('sale_point_model');
		$this->load->model('regime_model');
		$this->load->model('exchange_rate_model');
		$this->load->model('refund_reason_model');

		$data['card_types'] = $this->credit_card_type_model->get_list();
		$data['employees'] = $this->employee_model->get_salesman();
		$data['exchange_rates'] =  $this->exchange_rate_model->get_all();
		$data['taxes'] =  $this->regime_model->get_list();
		$data['sale_points'] = $this->sale_point_model->get_list(NULL, "sale_points.active = 't'");
		$data['refund_reasons'] = $this->refund_reason_model->get_all();

		$this->load->view('sales/add', $data);
	}

	public function old_add()
	{
		$this->load->model('credit_card_type_model');
		$this->load->model('serie_model');
		$this->load->model('regime_model');

		$branch_id = $this->session->userdata('user_branch');

		$card_types = $this->credit_card_type_model->get_list();
		$employees = $this->employee_model->get_salesman();
		$regimes =  $this->regime_model->get_list();
		$series_boleta = $this->serie_model->get_list_for_sale('BOLETA', NULL, $branch_id);
		$series_factura = $this->serie_model->get_list_for_sale('FACTURA', NULL, $branch_id);

		if ($card_types === FALSE) {
			$this->error_output('400', 'card_types not found');
		} elseif ($employees === FALSE) {
			$this->error_output('400', 'employees not found');
		} elseif ($regimes === FALSE) {
			$this->error_output('400', 'regimes not found');
		} else {
			$data['card_types'] = $card_types;
			$data['employees'] = $employees;
			$data['regimes'] = $regimes;
			$data['series_boleta'] = $series_boleta;
			$data['series_factura'] = $series_factura;

			$this->load->view('sales/add',$data);
		}

	}
	
    public function cashout($type, $user_sale_point, $company, $date)
    {   
        //$user_sale_point = $this->session->userdata('user_sale_point');
        //$company_id
        $this->load->model('company_model');
        $this->load->model('sale_point_model');
        $this->load->model('ticket_printer_model');
        //$date = date('Y-m-d');

        //$user_branch = $this->session->userdata('user_branch');
        //$companies = $this->company_model->get_list($user_branch);
        //foreach ($companies as $companyr) {
            $data['sales_t'] = $this->sale_model->sumary($type, 'TICKET', $user_sale_point, $company, $date);
            $data['sales_b'] = $this->sale_model->sumary($type, 'BOLETA', $user_sale_point, $company, $date);
            $data['sales_f'] = $this->sale_model->sumary($type, 'FACTURA', $user_sale_point, $company, $date);
            $data['sales_n'] = $this->sale_model->sumary($type, 'NOTA DE CREDITO', $user_sale_point, $company, $date);
            $data['cards'] = $this->sale_model->sumary_cards($type, $user_sale_point, $company, $date);
           	$data['categories'] = $this->sale_model->sumary_by_category($type, $user_sale_point, $company, $date, 'TARJETAS');
            $data['info'] = $this->ticket_printer_model->get_by_sale_point($user_sale_point);
            $data['reg_ticket'] = $this->sale_model->list_sales_by_ticket($type, $user_sale_point, $company, $date);
     				
        //}
        //$data = $this->sale_model->sumary($user_sale_point,);

        if ($data !== FALSE) {
            //$sale_point = $this->session->userdata('user_sale_point');
            if($type == '1'){
            	$this->sale_point_model->change_state($user_sale_point, $company, 'CIERRE PARCIAL', $date);
            } elseif ($type == '2') {
            	$this->sale_point_model->change_state($user_sale_point, $company, 'CIERRE TOTAL', $date);
            }
            $this->json_output($data);
        } else {
            $this->error_output(400, 'Ocurrió un error');
        }
    }
    
	public function cashOut_old()
	{
		$this->load->model('company_model');
		$this->load->model('sale_point_model');
		$this->load->model('credit_card_model');

		$company_id = $this->session->userdata('user_company');
		$branch_id = $this->session->userdata('user_branch');
		$user_sale_point = $this->session->userdata('user_sale_point');

		$company = $this->company_model->get_for_sale($company_id);
		$sale_point = $this->sale_point_model->get_for_sale($branch_id);
		$cashier_id = $this->session->userdata('user_username');
		$credit_cards = $this->credit_card_model->sumary($user_sale_point);
		//$total = $this->sale_model->get_all($branch_id);
		//echo $user_sale_point;
		$data = $this->sale_model->sumary($user_sale_point,'TICKET');
		$boleta_data = $this->sale_model->sumary($user_sale_point,'BOLETA');
		$refunds_data = $this->sale_model->sumary_refunds($user_sale_point);
		$credit_cards_data = $this->sale_model->sumary_refunds($user_sale_point);
		//print_r($total);
		//$closed = $this->sale_model->close_sale_point($user_sale_point);

		echo json_encode(
			array(
			'company' => $company,
			'cashier_name' => $cashier_id,
			'sale_point' => $sale_point,
			'data' => $data,
			'boleta_data' => $boleta_data,
			'refunds_data' => $refunds_data,
			'credit_cards' => $credit_cards
			)
		);
		//return $total;
	}

	public function print_tickets()
	{
		//exit(var_dump($_POST));
		$config['fiscal'] = "Pje. Vigil Nro 53";
		$config['ruc'] = "20532437548";
		$config['print_serie'] = "FFGFXXXX";

		$this->load->library('Printer_erp');

		$data['ticket'] = $this->printer_erp->ticket($config,TRUE);

		$this->load->view('sales/ticket', $data);
	}

	public function old_save()
	{
		$this->load->model('serie_model');
		$this->load->model('stock_model');
		$this->load->model('credit_card_model');

		$this->load->model('product_model');
		$this->load->model('company_model');
		$this->load->model('sale_point_model');
		$this->load->model('branch_model');

		$sale_id = $this->sale_model->add();
		$this->serie_model->increase_by_voucher('TICKET');

		if ($sale_id) {
			$sale_detail_insertion = $this->sale_detail_model->add_by_product($sale_id);
			if ($this->input->post('card_type')) {
				$credit_card_insertion = $this->credit_card_model->add_sale($sale_id);
			}
			if ($sale_detail_insertion) {
				$branch_id = $this->session->userdata('user_branch');
				$products = $this->input->post('product');
        		$sizes = $this->input->post('size');
        		$quantities = $this->input->post('qty');
        		$price = $this->input->post('price');
        		$subtotal = $this->input->post('subtotal');
        		$type = $this->input->post('type');
        		$serie = $this->input->post('serie');
        		$serial_number = $this->input->post('serial_number');
        		$igv = $this->input->post('igv');
        		$customer_id = $this->input->post('customer_id');
        		$total_amount = $this->input->post('total_amount');
        		$cash_amount = $this->input->post('cash_amount');
        		$credit_card_amount = $this->input->post('credit_card_amount');

        		$company_id = $this->session->userdata('user_company');
				$branch_id = $this->session->userdata('user_branch');

				$company = $this->company_model->get_for_sale($company_id);
				$sale_point = $this->sale_point_model->get_for_sale($branch_id);
				$address_sale_point = $this->branch_model->get_list('id = '.$branch_id);

		        $this->stock_model->update_for_sale($branch_id, $products, $sizes, $quantities);
		 		//print_r($payments);
		        $config['company_name'] = $company['company_name'];
				$config['fiscal'] = $company['address'];
				$config['ruc'] = $company['ruc'];
				$config['department'] = $company['department']."  ".$company['province']."  ".$company['district'];
				$config['print_serie'] = $sale_point['printer_serial'];
				$config['pto_venta'] = $address_sale_point[0]['address'];
				$config['serie'] = $serie ;
				$config['serial_number'] = $serial_number;
				$config['cash_amount'] = $cash_amount;
				$config['credit_card_amount'] = $credit_card_amount;
				$n = count($products);
				for ($i=0; $i < $n; $i++) {
					$product[]=$this->product_model->get_for_sale($products[$i],'products.id');
					$sizex[]=$this->size_model->get_size("size.id = ".$sizes[$i]);
				}
				/*foreach ($products as $row) {
					$product[]=$this->product_model->get_for_sale($row,'products.id');
				}*/
				if($customer_id!=''){
					$config['customer']=$this->customer_model->get_for_sale2($customer_id,'customers.id');
				}else{
					$config['customer']['full_name']='&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
					$config['customer']['id_number']='&nbsp;&nbsp;&nbsp;';
					$config['customer']['address']='&nbsp;&nbsp;&nbsp;';
				}
				$config['products'] = $product;
				$config['sizes'] = $sizex;
				$config['quantities'] = $quantities;
				$config['price'] = $price;
				$config['subtotal'] = $subtotal;

				$this->load->library('Printer_erp');

				if($type == "ZOFRA"){
					$data['ticket'] = $this->printer_erp->ticket($config,TRUE);
				}else{
					$data['ticket'] = $this->printer_erp->ticket($config,FALSE);
				}


				$this->load->view('sales/ticket', $data);

			} else {
				exit('ERROR sale_detail_model');
			}
		} else {
			exit('ERROR sale_model');
		}

	}

	public function save()
	{
		if ($this->input->is_post()) {
			$single_record = $this->input->post('sales') ? FALSE : TRUE; // Indica si es una venta manual o si se guardan varios registros por ticketera
			$sale_data = $this->sale_model->save();

			if ( (!$single_record AND $sale_data !== FALSE) OR ($single_record AND $sale_data > 0) ) {
				if ($single_record) {
					$this->json_output(array(
						'ok' => true,
						'sale_id' => $sale_data
					));
				} else {
					$this->load->model('credit_card_model');
	
					$sale_info = json_decode($sale_data); // Array
	
					if ($this->sale_detail_model->save_all($sale_info) AND $this->credit_card_model->save_all($sale_info)) {
						$this->json_output($sale_info);
					} else {
						// OJO: Hay que eliminar la venta incompleta
						foreach ($sale_info as $sale) {
							$this->sale_model->undo_saved_sale($sale->id);
						}
	
						$this->error_output('400', 'Ocurrió un error al registrar el detalle o pagos');
					}
				}
			} else {
				$this->error_output('400', 'No se pudo registrar la venta');
			}
		} else {
			$this->error_output('400', 'No se recibieron datos');
		}
	}

	public function get_id_for_detail($voucher, $company_id, $serie, $serial_number)
	{
		$available_vouchers = array('TICKET', 'TICKET NOTA DE CREDITO', 'BOLETA', 'FACTURA', 'NOTA DE CREDITO');
		$voucher = urldecode($voucher);

		if (in_array($voucher, $available_vouchers) AND is_numeric($company_id) AND ($serie) AND is_numeric($serial_number)) {
			$data = $this->sale_model->get_id_for_detail($voucher, $serie, $serial_number, $company_id);

			if ($data !== FALSE) {
				// Se debe permitir ver el detalle de ventas ANULADAS $data[active]=f puesto que los vouchers pueden ser impresos aún
				$this->json_output(array(
					'ok' => true,
					'sale_id' => $data->id
				));
			} else {
				$this->json_output(array(
					'error' => true,
					'message' => 'No se encontró ningún registro'
				));
			}
		} else {
			$this->json_output(array(
				'error' => true,
				'message' => 'Los parámetros recibidos no son correctos'
			));
		}
	}

	public function manually_save()
	{
		$this->load->model('serie_model');
		$this->load->model('stock_model');
		$this->load->model('credit_card_model');

		$this->load->model('product_model');
		$this->load->model('company_model');
		$this->load->model('sale_point_model');
		$this->load->model('branch_model');

		$sale_id = $this->sale_model->add();
		$this->serie_model->increase_by_voucher(
			$this->input->post('voucher'),
			$this->session->userdata('user_branch'),
			$this->input->post('regime')
		);

		if ($sale_id) {
			$sale_detail_insertion = $this->sale_detail_model->add_by_product($sale_id);
			if ($this->input->post('card_type')) {
				$credit_card_insertion = $this->credit_card_model->add_sale($sale_id);
			}
			if ($sale_detail_insertion) {
				$this->output
				->set_content_type('application/json')
				->set_output(json_encode(array('success' => TRUE)));
			} else {
				$this->error_output('400', 'failed sale_detail_model');
			}
		} else {
			$this->error_output('400', 'failed sale_model');
		}

	}

	public function save_sale() // This gonna be called just "save"
	{
		$voucher = $this->input->post('voucher');

		if (!empty($voucher)) {
			$this->form_validation->set_rules('igv', 'IGV', 'required|numeric');
			$this->form_validation->set_rules('total_amount', 'Monto Total', 'required|numeric');
			$this->form_validation->set_rules('state', 'Estado', 'required|is_state_type');
			$this->form_validation->set_rules('voucher', 'Tipo de Documento', 'required|is_voucher_type');
			$this->form_validation->set_rules('serie', 'Serie', 'required|integer');
			$this->form_validation->set_rules('serial_number', 'Serial', 'required|integer');
			$this->form_validation->set_rules('sale_point_id', 'ID Punto de Venta', 'required|integer');
			$this->form_validation->set_rules('cash_amount', 'Monto en Efectivo', 'required|numeric');
			$this->form_validation->set_rules('credit_card_amount', 'Monto en Tarjeta', 'required|numeric');

			// For details:
			$this->form_validation->set_rules('product_detail', 'ID Detalle de Prod.', 'required|is_array');
			$this->form_validation->set_rules('quantity', 'Cantidades', 'required|is_array');
			$this->form_validation->set_rules('price', 'Precios', 'required|is_array');
			$this->form_validation->set_rules('subtotal', 'Subtotal', 'required|is_array');
			$this->form_validation->set_rules('cost', 'Costos', 'required|is_array');

			if ($this->form_validation->run() !== FALSE) {
				$this->load->model('serie_model');
				$this->load->model('stock_model');

				$sale_date = date('Y-m-d H:i:s');
				$sale_id = $this->sale_model->add(array(
					'sale_date' => $sale_date
				));

				if ($sale_id) {
					$this->serie_model->increase_by_voucher($voucher); // Busca por sale_point_id

					// Detail must have product_detail_id

					if ($this->sale_detail_model->add($sale_id)) {
						if ($this->stock_model->update('+')) { // Adds the refunded stock
							$this->json_output(array(
								'sale_id' => $sale_id,
								'sale_date' => $sale_date
							));
						} else {
							$this->error_output('500', 'could not update stock');
						}
					} else {
						$this->error_output('500', 'could not insert detail');
					}
				} else {
					$this->error_output('500', 'could not insert sale');
				}
			} else {
				$this->error_output('500', strip_tags(validation_errors('', ', ')));
			}
		} else {
			$this->error_output('500', 'voucher not found');
		}
	}

	public function get_pre_data($address)
	{
		$this->load->model('company_model');
		$this->load->model('sale_point_model');
		$this->load->model('serie_model');

		$company_id = $this->session->userdata('user_company');
		$branch_id = $this->session->userdata('user_branch');

		$company = $this->company_model->get_for_sale($company_id);
		$sale_point = $this->sale_point_model->get_for_sale($branch_id);
		$serie = $this->serie_model->get_for_ticket();

		if ($company !== FALSE AND $sale_point !== FALSE AND $serie !== FALSE) {
			$data = array(
				'company' => $company,
				'sale_point' => $sale_point,
				'series' => $serie
			);

			$this->output
				->set_content_type('application/json')
				->set_output(json_encode($data));
		} else {
			$this->error_output('400');
		}
	}

	public function settings()
	{
		$this->load->model('sale_point_model');
		$this->load->model('exchange_rate_model');

		$data['sale_points'] = $this->sale_point_model->get_list(NULL, "sale_points.active = 't'");
		$data['exchange_rates'] = $this->exchange_rate_model->get_all();

		$this->load->view('sales/settings', $data);
	}

	public function save_settings($id)
	{
		if ($this->input->is_post()) {
			if (is_numeric($this->input->post('cash_amount')) AND is_array($this->input->post('exchange_rates'))) {
				$this->load->model('sale_point_model');

				if ($this->sale_point_model->update_settings($id)) {
					$this->output->set_output('ok');
				} else {
					$this->error_output('400', 'Ocurrió un error al intentar actualizar los datos');
				}
			} else {
				$this->error_output('400', 'Los datos ingresados no son válidos');
			}
		} else {
			$this->error_output('400', 'No se recibieron datos');
		}
	}

	public function operations()
	{
		$this->load->view('sales/operations');
	}

	public function detail($id)
	{
		$this->load->model('credit_card_type_model');
		$this->load->model('credit_card_model');
		$this->load->model('sale_point_model');
		$this->load->model('regime_model');
		$this->load->model('serie_model');

		$data['card_types'] = $this->credit_card_type_model->get_list();
		//$data['employees'] = $this->employee_model->get_salesman();
		//$data['exchange_rates'] =  $this->exchange_rate_model->get_all();
		$data['taxes'] =  $this->regime_model->get_list();
		$data['sale_points'] = $this->sale_point_model->get_list(NULL, "sale_points.active = 't'");
		$data['sale'] = $this->sale_model->get($id);
		$data['sale_details'] = $this->sale_detail_model->get_by_sale($id);
		$data['sale_cards'] = $this->credit_card_model->get_by_sale($id);
		$data['serie'] = $this->serie_model->get_next('TICKET NOTA DE CREDITO', $data['sale']->company_id);
		$data['refunded_sale_details'] = $this->sale_detail_model->get_refunded_by_sale($id);

		$this->load->view('sales/detail', $data);
	}

	public function detail_for_operations($id)
	{
		$sale = $this->sale_model->get_for_operations($id);
		// details can be FALSE
		$details = $this->sale_detail_model->get_for_operations($id);

		if ($sale === FALSE) {
			$this->error_output('400', 'sale not found');
		} else {
			$this->json_output(array(
				'sale' => $sale,
				'details' => $details
			));
		}
	}

	public function list_for_operations($voucher = NULL)
	{
		$this->load->database();
        $this->load->library('SSP');

        $table = 'sales LEFT OUTER JOIN customers ON sales.customer_id = customers.id';
        $primaryKey = 'sales.id';
        $columns = array();
		$dt = 0;

		$columns[] = array( 'db' => 'sales.id', 'dt' => $dt++ );

		$columns[] = array( 'db' => "CONCAT(serie::TEXT, '-', serial_number::TEXT) AS quick_search", 'dt' => $dt++ );

		$columns[] = array( 'db' => "(SELECT COUNT(*) FROM sales s WHERE s.refund_origin_id = sales.id) AS refunded", 'dt' => $dt++ );

		$columns[] = array( 'db' => 'sales.voucher', 'dt' => $dt++, 'formatter' => function ($value, $data) {
			if ($data['refunded'] > 0) {
				return $value . ' &nbsp;<span class="label label-info">devolución</span>';
			} else {
				return $value;
			}
		} );

		$columns[] = array( 'db' => "CONCAT(LPAD(serie::TEXT, 3, '0'), '-', LPAD(serial_number::TEXT, 7, '0')) AS serie", 'dt' => $dt++ );

		$columns[] = array( 'db' => "CONCAT(customers.name, ' ', customers.last_name) AS customer", 'dt' => $dt++, 'formatter' => function ($value, $data) {
        	if (strlen(trim($value)) === 0) {
        		return '-- NO REGISTRADO --';
        	} else {
        		return $value;
        	}
        } );

		$columns[] = array( 'db' => 'sales.sale_date', 'dt' => $dt++, 'formatter' => function ($value, $data) {
        	return date('d/m/Y h:i A', strtotime($value));
        } );

		$columns[] = array( 'db' => 'sales.total_amount' ,'dt' => $dt++, 'formatter' => function ($value, $data) {
			if (intval($value) <= 0) {
        		return '<span class="text-danger">0.00</span>';
			} else {
        		return number_format($value, 2);
			}
        });

        $sql_details = array(
            'user' => $this->db->username,
            'pass' => $this->db->password,
            'db' => $this->db->database,
            'host' => $this->db->hostname
        );

        $where = "sales.active = 't'";

		if (!is_null($voucher)) {
			$voucher = urldecode($voucher);
			$where .= " AND sales.voucher = '$voucher'";
		}

        $this->output
            ->set_content_type('application/json')
            ->set_output(json_encode($this->ssp->simple( $_GET, $sql_details, $table, $primaryKey, $columns, $where )));
	}

	public function cancel_series()
	{
		$limit = $this->input->post('limit');

		if (!empty($limit)) {
			if ($this->sale_model->cancel_series()) {
				$this->output
	             ->set_content_type('text/plain')
	             ->set_output($limit);
			} else {
				$this->error_output('400', 'sales: error al cancelar series');
			}
		}
	}

	public function get_detail($id)
	{
		$detail = $this->sale_model->get_detail($id);

		$this->json_output($detail);
	}

	public function sunat()
	{	
		if ($this->input->is_post()) {
			$single_record = $this->input->post('sales') ? FALSE : TRUE; // Indica si es una venta manual o si se guardan varios registros por ticketera
			
			foreach ($this->input->post('invoices') as $invoice) {
            	/*print_r('<pre>');
           		print_r($invoice);
				print_r('</pre>');*/
				$detalle = [];
            	$cabecera = array(
            		'tipOperacion' => $invoice['operation_type'],
					'fecEmision' => $invoice['date'],
					'horEmision' => $invoice['time'],
					'fecVencimiento' => $invoice['date'],
					'codLocalEmisor' => $invoice['sucursal_id'],
					'tipDocUsuario' => $invoice['userDocType'],
					'numDocUsuario' => $invoice['idNumber'],
					'rznSocialUsuario' => $invoice['bussinessName'],
					'tipMoneda' => 'PEN',
					'sumTotTributos' => "{$invoice['igve']}",
					'sumTotValVenta' => "{$invoice['sumTotValVenta']}",
					'sumPrecioVenta' => "{$invoice['total_amount']}",
					'sumDescTotal' => '0.00',
					'sumOtrosCargos' => '0.00',
					'sumTotalAnticipos' => '0.00',
					'sumImpVenta' => "{$invoice['total_amount']}",
					'ublVersionId' => '2.1',
					'customizationId' => '2.0' 
            	);
				foreach($invoice['sale_details'] as $detail) {
					$detalle[] = array 
						(
							'codUnidadMedida' => 'NIU',
							'ctdUnidadItem' => $detail['quantity'],
							'codProducto' => $detail['code'],
							'codProductoSUNAT' => '-',
							'desItem' => "{$detail['des']}",
							'mtoValorUnitario' => ($detail['regime'] == 'ZOFRA') ? (string)$detail['price'] : (string)round(($detail['price']/1.18),2) ,
							'sumTotTributosItem' => ($detail['regime'] == 'ZOFRA') ? "0.00" : (string)round(((($detail['price']/1.18)*0.18) * $detail['quantity']),2),
							
							'codTriIGV' => ($detail['regime'] == 'ZOFRA') ? '9997' : '1000',
							'mtoIgvItem' => ($detail['regime'] == 'ZOFRA') ? '0.00' : (string)round(((($detail['price']/1.18)*0.18) * $detail['quantity']),2),
							'mtoBaseIgvItem' => ($detail['regime'] == 'ZOFRA') ? (string)($detail['price'] * $detail['quantity']) : (string)round((($detail['price']/1.18) * $detail['quantity']),2),
							'nomTributoIgvItem' => ($detail['regime'] == 'ZOFRA') ? 'EXO' : 'IGV',
							'codTipTributoIgvItem' => ($detail['regime'] == 'ZOFRA') ? 'VAT' : 'VAT',
							'tipAfeIGV' => ($detail['regime'] =='ZOFRA') ? '20' : '10',
							'porIgvItem' => '18.00',
							
							'codTriISC' => '-',
							'mtoIscItem' => '0.00',
							'mtoBaseIscItem' => '0.00',
							'nomTributoIscItem' => 'ISC',
							'codTipTributoIscItem' => 'EXC',
							'tipSisISC' => '1',
							'porIscItem' => '0.00',
							
							'mtoPrecioVentaUnitario' => "{$detail['price']}",
							'mtoValorVentaItem' => ($detail['regime'] == 'ZOFRA') ? (string)($detail['price'] * $detail['quantity']) : (string)round((($detail['price']/1.18) * $detail['quantity']),2),
							'mtoValorReferencialUnitario' => '0.00'
						);
				}
            	
            	$tributos = array(
					array(
						'ideTributo' => ($invoice['regime'] == 'ZOFRA') ? '9997' : '1000',
						'nomTributo' => ($invoice['regime'] == 'ZOFRA') ? 'EXO' : 'IGV',
						'codTipTributo' => ($invoice['regime'] == 'ZOFRA') ? 'VAT' : 'VAT',
						'mtoBaseImponible' => "{$invoice['sumTotValVenta']}",
						'mtoTributo' => "{$invoice['igve']}"
					)
				);
				
            	$leyendas = array(
					array(
						'codLeyenda' => '1000',
						'desLeyenda' => $invoice['letras']
					)
				);
				//
				
            	//if ($invoice['tipOperacion'] == '0202') {
				//	$archivo = array('cabecera' => $cabecera, 'detalle' => $detalle, 'adicionalDetalle' => $adicional_detalle,'leyendas' => $leyendas, 'tributos' => $tributos);
				//}else{
					$archivo = array('cabecera' => $cabecera, 'detalle' => $detalle,'leyendas' => $leyendas, 'tributos' => $tributos);
				//}

				$vouchertype = ($invoice['docType'] === 'PERSONA') ? "03" : "01";
				$serie = $invoice['serie'];
				$serial = str_pad($invoice['serial_number'] ,8, "0", STR_PAD_LEFT);
				//estableciendo ruta a guardar
				if($invoice['company_id'] == 1) {
				    // LFA
					$ruc = '20532437548';
					$file = '/opt/SFS_LFA/sunat_archivos/sfs/DATA/'.$ruc.'-'.$vouchertype.'-'.$serie.'-'.$serial.'.JSON';
				} else {
					// GAFCO
					$ruc = '20302573086';
					$file = '/opt/SFS_GAFCO/sunat_archivos/sfs/DATA/'.$ruc.'-'.$vouchertype.'-'.$serie.'-'.$serial.'.JSON';
				}
				
				//creando archivo
				$json_string = json_encode($archivo);
				file_put_contents($file, $json_string);
            }

			/*if ( (!$single_record AND $sale_data !== FALSE) OR ($single_record AND $sale_data > 0) ) {
				if ($single_record) {
					$this->json_output(array(
						'ok' => true,
						'sale_id' => $sale_data
					));
				} else {
					$this->load->model('credit_card_model');
		
					$sale_info = json_decode($sale_data); // Array
	
					if ($this->sale_detail_model->save_all($sale_info) AND $this->credit_card_model->save_all($sale_info)) {
						$this->json_output($sale_info);
					} else {
						// OJO: Hay que eliminar la venta incompleta
						foreach ($sale_info as $sale) {
							$this->sale_model->undo_saved_sale($sale->id);
						}
	
						$this->error_output('400', 'Ocurrió un error al registrar el detalle o pagos');
					}
				}
			} else {
				$this->error_output('400', 'No se pudo registrar la venta');
			}*/
		} else {
			$this->error_output('400', 'No se recibieron datos');
		}
	}

}
