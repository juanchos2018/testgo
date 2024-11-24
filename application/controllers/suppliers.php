<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Suppliers extends MY_Controller {

	public function __construct()
	{
		parent::__construct();

		$this->load->model('supplier_model');
	}

    public function simple_list()
    {
        $data = $this->supplier_model->simple_list();

        $this->json_output($data);
    }

	public function save()
	{
		$this->form_validation->set_rules('id_number', 'RUC', 'required|is_unique[suppliers.id_number]');
		$this->form_validation->set_rules('name', 'Nombre', 'required');

		$this->form_validation->set_message('required', 'El campo %s es requerido');
		$this->form_validation->set_message('is_unique', 'Ya existe otro proveedor con el %s especificado');

		if ($this->form_validation->run() !== FALSE) {
			$insert_id = $this->supplier_model->save();

			if ($insert_id) {
				$this->json_output(array('ok' => TRUE, 'result' => $insert_id));
			} else {
				$this->json_output(array('error' => 'Ocurrió un error'));
			}
		} else {
			$errors = $this->form_validation->error_array();

			$message = array_shift($errors);

			$this->json_output(array('error' => $message));
		}
	}
}
