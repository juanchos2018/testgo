<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
//
class Sale_points extends MY_Controller {

	public function __construct()
	{
		parent::__construct();

		$this->load->model('sale_point_model');
	}
	
	public function index()
	{
		$data['records'] = $this->sale_point_model->get_list();
		
		$this->load->view('sale_points/index', $data);
	}

	public function add()
	{
		$this->load->model('company_model');

		$data['companies'] = $this->company_model->get_list();

		$this->load->view('sale_points/add', $data);
	}

	public function edit($id)
	{
		$this->load->model('ticket_printer_model');
		$this->load->model('company_model');

		$data['companies'] = $this->company_model->get_list();
		$data['record'] = $this->sale_point_model->get($id);
		$data['printers'] = $this->ticket_printer_model->get_by_sale_point($id);

		$this->load->view('sale_points/edit', $data);
	}

	public function save()
	{
		if (!empty($this->input->is_post())) {
			$this->load->model('branch_detail_model');
			$this->load->model('serie_model');
			$this->load->model('ticket_printer_model');

			$this->form_validation->set_rules('description', 'description', 'required|max_length[50]');

			if ($this->form_validation->run() !== FALSE) {
				$_POST['active'] = ($this->input->post('active') === 'true' ? 't' : 'f');

				$sale_point_id = $this->sale_point_model->save();

				if ($sale_point_id !== FALSE) {
					$branch_details = $this->branch_detail_model->get_for_sale_point();
					$printer_data = array();

					foreach ($this->input->post('printers') as $printer) {
						$company_id = $printer['company_id'];
						$ticket_serie = (empty($printer['ticket_serie']) ? NULL : $printer['ticket_serie']);
						$ticket_serial = (empty($printer['ticket_serial']) ? NULL : $printer['ticket_serial']);
						$printer_serial = (empty($printer['printer_serial']) ? NULL : $printer['printer_serial']);
						$printer_name = (empty($printer['printer_name']) ? NULL : $printer['printer_name']);

						if (isset($branch_details[$company_id])) {
							$branch_detail_id = $branch_details[$company_id]['id'];

							$serie_data = array(
								'serie' => $ticket_serie,
								'serial_number' => intval($ticket_serial),
								'voucher' => 'TICKET',
								'sale_point_id' => $sale_point_id,
								'branch_detail_id' => $branch_detail_id
							);

							$serie_id = $this->serie_model->save($serie_data);

							if ($serie_id !== FALSE) {
								$printer_data[] = array(
									'serie_id' => $serie_id,
									'printer_serial' => $printer_serial,
									'printer_name' => $printer_name
								);
							}

						}
					}
					
					if (count($printer_data)) {
						if ($this->ticket_printer_model->save($printer_data)) {
							$this->json_output(array( 'inserted' => $sale_point_id ));
						} else {
							$this->error_output('400', 'No se pudo registrar datos de las ticketeras');
						}
					} else {
						$this->error_output('400', 'No se encontraron datos de las ticketeras');
					}
				} else {
					$this->error_output('400', 'Ocurrió un error al guardar el punto de venta');
				}
			} else {
				$this->error_output('400', 'Ingrese la descripción del punto de venta');
			}
		} else {
			$this->error_output('400', 'No se recibieron datos');
		}
	}

	public function update()
	{
		if (!empty($this->input->is_post())) {
			$this->load->model('branch_detail_model');
			$this->load->model('serie_model');
			$this->load->model('ticket_printer_model');

			$this->form_validation->set_rules('description', 'description', 'required|max_length[50]');

			if ($this->form_validation->run() !== FALSE) {
				$_POST['active'] = ($this->input->post('active') === 'true' ? 't' : 'f');

				if ($this->sale_point_model->update()) {
					$sale_point_id = $this->input->post('id');
					$registered_series = $this->serie_model->get_for_update_sale_point($sale_point_id);
					$branch_details = $this->branch_detail_model->get_for_sale_point();

					$added_series = $this->input->post('printers');
					$added_printers = array(); // Se llena cuando se ingresen las nuevas series
					$update_series = array();
					$update_printers = array();
					$delete_series = array(); // Al eliminar las series, se eliminará en cascada la ticketera

					foreach ($registered_series as $serie) {
						$modified_printer = array();

						foreach ($added_series as $printer_index => $printer) {
							if ($printer['company_id'] == $serie->company_id) {
								$modified_printer = array_splice($added_series, $printer_index, 1);
								break;
							}
						}

						if (count($modified_printer)) {
							$modified_printer = current($modified_printer);

							$ticket_serie = (empty($modified_printer['ticket_serie']) ? NULL : $modified_printer['ticket_serie']);
							$ticket_serial = (empty($modified_printer['ticket_serial']) ? NULL : $modified_printer['ticket_serial']);

							array_push($update_series, array(
								'id' => $serie->serie_id,
								'serie' => intval($ticket_serie),
								'serial_number' => intval($ticket_serial)
							));

							$printer_serial = (empty($modified_printer['printer_serial']) ? NULL : $modified_printer['printer_serial']);
							$printer_name = (empty($modified_printer['printer_name']) ? NULL : $modified_printer['printer_name']);
							
							array_push($update_printers, array(
								'id' => $serie->ticket_printer_id,
								'printer_serial' => $printer_serial,
								'printer_name' => $printer_name
							));

						} else { // Esta serie/ticketera se removió (no se encontró asignada para la empresa)
							array_push($delete_series, $serie->serie_id);
						}
					}

					if (count($added_series)) {
						foreach ($added_series as $printer) {
							$company_id = $printer['company_id'];
							$ticket_serie = (empty($printer['ticket_serie']) ? NULL : $printer['ticket_serie']);
							$ticket_serial = (empty($printer['ticket_serial']) ? NULL : $printer['ticket_serial']);
							$printer_serial = (empty($printer['printer_serial']) ? NULL : $printer['printer_serial']);
							$printer_name = (empty($printer['printer_name']) ? NULL : $printer['printer_name']);

							if (isset($branch_details[$company_id])) {
								$branch_detail_id = $branch_details[$company_id]['id'];

								$serie_data = array(
									'serie' => intval($ticket_serie),
									'serial_number' => intval($ticket_serial),
									'voucher' => 'TICKET',
									'sale_point_id' => $sale_point_id,
									'branch_detail_id' => $branch_detail_id
								);

								$serie_id = $this->serie_model->save($serie_data);

								if ($serie_id !== FALSE) {
									$added_printers[] = array(
										'serie_id' => $serie_id,
										'printer_serial' => $printer_serial,
										'printer_name' => $printer_name
									);
								}

							}
						}
					}

					if (count($added_printers)) {
						$this->ticket_printer_model->save($added_printers);
					}

					if (count($update_series)) {
						$this->serie_model->update($update_series);
					}

					if (count($update_printers)) {
						$this->ticket_printer_model->update($update_printers);
					}

					if (count($delete_series)) {
						$this->serie_model->delete($delete_series);
					}

					$this->output->set_output('ok');

				} else {
					$this->error_output('400', 'Ocurrió un error al guardar el punto de venta');
				}
			} else {
				$this->error_output('400', 'Ingrese la descripción del punto de venta');
			}
		} else {
			$this->error_output('400', 'No se recibieron datos');
		}
	}

	public function activate()
	{
		if ($this->input->is_post()) {
			if ($this->sale_point_model->activate()) {
				$this->output->set_output('ok');
			} else {
				$this->error_output('400', 'No se pudo actualizar el estado');
			}
		} else {
			$this->error_output('400', 'No se recibieron datos');
		}
	}

	public function delete()
	{
		if ($this->input->is_post()) {
			if ($this->sale_point_model->delete()) {
				$this->output->set_output('ok');
			} else {
				$this->error_output('400', 'Ocurrió un error al intentar eliminar el registro');
			}
		} else {
			$this->error_output('400', 'No se recibieron datos');
		}
	}

}