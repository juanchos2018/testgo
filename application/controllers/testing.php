<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Testing extends MY_Controller {

	public function __construct()
	{
		parent::__construct();
	}

	public function index() {
		$this->load->view('testing/index');
	}

	public function datepicker() {
		$this->load->view('testing/datepicker');
	}

	public function migration() {
		$this->load->view('testing/migration');
	}

	public function purchase() {
		$this->load->model('purchase_order_model');
		$this->load->model('purchase_model');

		$data['next_id'] = $this->purchase_model->next_id();
		$data['purchase_orders'] = $this->purchase_order_model->get_list(array('active' => 't'));

		$this->load->view('testing/purchase', $data);
	}

	public function save_purchase()
	{
		$this->form_validation->set_rules('supplier_id', 'Proveedor', 'required|is_integer');
		$this->form_validation->set_rules('company_id', 'Empresa', 'required|is_integer');
		$this->form_validation->set_rules('input_date', 'Fecha de ingreso', 'required|is_date');
		$this->form_validation->set_rules('amount', 'Monto de compra', 'required|is_real');
		$this->form_validation->set_rules('utility', 'Utilidad', 'required|is_integer');
		$this->form_validation->set_rules('expenses', 'Gasto total', 'required|is_real');
		$this->form_validation->set_rules('igv', 'IGV', 'required|is_real');

		$this->form_validation->set_rules('details', 'Detalles de compra', 'required|is_array');
		$this->form_validation->set_rules('invoices', 'Facturas', 'required|is_array');

		$this->form_validation->set_message('required', 'El campo %s es requerido');
		$this->form_validation->set_message('exact_length', 'El campo %s no tiene un formato válido');
		$this->form_validation->set_message('is_integer', 'El campo %s no es un entero válido');
		$this->form_validation->set_message('is_real', 'El campo %s no es un número válido');
		$this->form_validation->set_message('is_array', 'El campo %s no tiene un formato válido');
		$this->form_validation->set_message('is_date', 'El campo %s no es una fecha válida');

		if ($this->form_validation->run() !== FALSE) {
			$this->load->model('testing_model');

			$inserted = $this->testing_model->save_purchase();

			if ($inserted !== FALSE) {
				$this->json_output(array(
					'ok' => TRUE,
					'id' => $inserted
				));
			} else {
				$this->json_output(array('error' => 'Ocurrió un error al guardar el registro'));
			}
		} else {
			$errors = $this->form_validation->error_array();
			$message = array_shift($errors);
			$this->json_output(array('error' => $message));
		}
	}

	public function customers() {
		$this->load->model('testing_model');

		$data = $this->testing_model->customers();

		$this->json_output($data);
	}

	public function sale() {
		$this->load->model('purchase_order_model');
		$this->load->model('purchase_model');

		$data['next_id'] = $this->purchase_model->next_id();
		$data['purchase_orders'] = $this->purchase_order_model->get_list(array('active' => 't'));

		$this->load->view('testing/purchase', $data);
	}

	public function transfer() {
	

		$this->load->model('transfer_model');
		$this->load->model('product_model');
		
		$single_tables = $this->product_model->get_single_tables();
	
		$data['next_id'] = $this->transfer_model->next_id();
		$data['sizes'] = $single_tables[6]['records'];

		$this->load->view('testing/transfer', $data);
		/*$this->load->view('transfers/add', $data);*/
	}

	public function save_transfer()
	{
		$this->form_validation->set_rules('company_origin_id', 'Empresa Origen', 'required|is_integer');
		$this->form_validation->set_rules('company_target_id', 'Empresa Destino', 'required|is_integer');

		$this->form_validation->set_rules('branch_origin_id', 'Sucursal Origen', 'required|is_integer');
		$this->form_validation->set_rules('branch_target_id', 'Sucursal Destino', 'required|is_integer');

		$this->form_validation->set_rules('transfer_date', 'Fecha de ingreso', 'required|is_date');
		$this->form_validation->set_rules('total_qty', 'total', 'required|is_real');
	

		$this->form_validation->set_rules('details', 'Detalles de movimiento', 'required|is_array');
		$this->form_validation->set_rules('guides', 'Guias', 'required|is_array');
	
		$this->form_validation->set_message('required', 'El campo %s es requerido');
		$this->form_validation->set_message('exact_length', 'El campo %s no tiene un formato válido');
		$this->form_validation->set_message('is_integer', 'El campo %s no es un entero válido');
		$this->form_validation->set_message('is_real', 'El campo %s no es un número válido');
		$this->form_validation->set_message('is_array', 'El campo %s no tiene un formato válido');
		$this->form_validation->set_message('is_date', 'El campo %s no es una fecha válida');


		if ($this->form_validation->run() !== FALSE) {
			$this->load->model('testing_model');

			$inserted = $this->testing_model->save_transfer();

			if ($inserted !== FALSE) {
				$this->json_output(array(
					'ok' => TRUE,
					'id' => $inserted
				));
			} else {
				$this->json_output(array('error' => 'Ocurrió un error al guardar el registro'));
			}
		} else {
			$errors = $this->form_validation->error_array();
			$message = array_shift($errors);
			$this->json_output(array('error' => $message));
		}
	}
}
