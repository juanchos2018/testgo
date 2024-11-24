<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Series extends MY_Controller {

	public function __construct()
	{
		parent::__construct();

		$this->load->model('serie_model');
	}

	public function index()
	{
		$data['records'] = $this->serie_model->get_list();

		$this->load->view('series/index', $data);
	}

	public function add()
	{
		$this->load->model('company_model');

		$data['companies'] = $this->company_model->get_list();

		$this->load->view('series/add', $data);
	}

	public function edit($id)
	{
		$this->load->model('company_model');

		$data['companies'] = $this->company_model->get_list();
		$data['record'] = $this->serie_model->get($id);

		$this->load->view('series/edit', $data);
	}

	public function save()
	{
		if ($this->input->is_post()) {
			$this->form_validation->set_rules('company_id', 'empresa', 'required|integer');
			$this->form_validation->set_rules('voucher', 'voucher', 'required');
			$this->form_validation->set_rules('serie', 'nro. de serie', 'required');
			$this->form_validation->set_rules('serial_number', 'nro. correlativo', 'required|integer');

			$this->form_validation->set_message('required', 'El campo %s es requerido');
			$this->form_validation->set_message('integer', 'El campo %s no es un entero');

			if ($this->form_validation->run() !== FALSE) {
				$this->load->model('branch_detail_model');

				$branch_details = $this->branch_detail_model->get_for_sale_point();
				$company_id = $this->input->post('company_id');

				if (isset($branch_details[$company_id])) {
					$_POST['branch_detail_id'] = $branch_details[$company_id]['id'];

					if ($this->serie_model->save()) {
						$this->output->set_output('ok');
					} else {
						$this->error_output('400', 'No se pudo guardar el registro');
					}
				} else {
					$this->error_output('400', 'No se encontró la empresa especificada');
				}

			} else {
				$errors = $this->form_validation->error_array();

				if (count($errors)) {
					$this->error_output('400', current($errors));
				} else {
					$this->error_output('400', 'Los datos ingresados no son correctos');
				}
			}
		} else {
			$this->error_output('400', 'No se recibieron datos');
		}
	}

	public function update_subsidiary()
	{
		if ($this->input->is_post()) {
			if ($this->serie_model->update_subsidiary()) {
				$this->output->set_output('ok');
			} else {
				$this->error_output('400', 'No se pudo actualizar el subdiario');
			}
		} else {
			$this->error_output('400', 'No se recibieron datos');
		}
	}

	public function update()
	{
		if ($this->input->is_post()) {
			$this->form_validation->set_rules('company_id', 'empresa', 'required|integer');
			$this->form_validation->set_rules('voucher', 'voucher', 'required');
			$this->form_validation->set_rules('serie', 'nro. de serie', 'required|integer');
			$this->form_validation->set_rules('serial_number', 'nro. correlativo', 'required|integer');

			$this->form_validation->set_message('required', 'El campo %s es requerido');
			$this->form_validation->set_message('integer', 'El campo %s no es un entero');

			if ($this->form_validation->run() !== FALSE) {
				$this->load->model('branch_detail_model');

				$branch_details = $this->branch_detail_model->get_for_sale_point();
				$company_id = $this->input->post('company_id');

				if (isset($branch_details[$company_id])) {
					$_POST['branch_detail_id'] = $branch_details[$company_id]['id'];

					if ($this->serie_model->update()) {
						$this->output->set_output('ok');
					} else {
						$this->error_output('400', 'No se pudo guardar el registro');
					}
				} else {
					$this->error_output('400', 'No se encontró la empresa especificada');
				}

			} else {
				$errors = $this->form_validation->error_array();

				if (count($errors)) {
					$this->error_output('400', current($errors));
				} else {
					$this->error_output('400', 'Los datos ingresados no son correctos');
				}
			}
		} else {
			$this->error_output('400', 'No se recibieron datos');
		}
	}

	public function delete()
	{
		if ($this->input->is_post()) {
			if ($this->serie_model->delete()) {
				$this->output->set_output('ok');
			} else {
				$this->error_output('400', 'Ocurrió un error al intentar eliminar el registro');
			}
		} else {
			$this->error_output('400', 'No se recibieron datos');
		}
	}

	public function get_for_sale($voucher, $company_id, $reference_type = NULL, $reference_serie = NULL, $reference_serial = NULL)
	{
		$error = FALSE;
		$output = array();
		$voucher = urldecode($voucher);
		$reference_type = urldecode($reference_type);

		if (!is_null($reference_type) AND !is_null($reference_serie) AND !is_null($reference_serial)) {
			$this->load->model('sale_model');

			$reference = $this->sale_model->get_for_refund($company_id, $reference_type, $reference_serie, $reference_serial);

			if ($reference === FALSE) {
				$output['error'] = TRUE;
				$output['message'] = 'No se pudo encontrar la venta de referencia, por favor revise los datos ingresados.';

				$error = TRUE;
			} else {
				if ($reference['active'] !== 't') {
					$output['error'] = TRUE;
					$output['message'] = 'La venta de referencia ha sido anulada previamente.';

					$error = TRUE;
				} else {
					$this->load->model('sale_detail_model');
					$this->load->model('credit_card_model');

					$sale_id = $reference['id'];

					$output['reference'] = $this->sale_model->get($sale_id);
					$output['reference']->sale_details = $this->sale_detail_model->get_by_sale($sale_id);
					$output['reference']->sale_cards = $this->credit_card_model->get_by_sale($sale_id);
					$output['reference']->refunded_sale_details = $this->sale_detail_model->get_refunded_by_sale($sale_id);
				}
			}
		}

		if (!$error) {
			// $reference_type viene a ser régimen en caso de que se trate de BOLETA o FACTURA
			$next_serie = $this->serie_model->get_next($voucher, $company_id, $reference_type);

			if ($next_serie !== FALSE) {
				$output['serie'] = $next_serie['serie'];
				$output['serial_number'] = $next_serie['serial_number'];
			} else {
				$output['serie'] = 0;
				$output['serial_number'] = 0;
			}

			$output['ok'] = TRUE;
		}

		$this->json_output($output);
	}
}
