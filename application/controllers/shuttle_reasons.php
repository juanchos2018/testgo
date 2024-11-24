<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Shuttle_reasons extends MY_Controller {

	public function __construct()
	{
		parent::__construct();

		$this->load->model('shuttle_reason_model');
	}

    public function simple_list()
    {
        $data = $this->shuttle_reason_model->simple_list();

        $this->json_output($data);
    }

	public function save()
	{
		$this->form_validation->set_rules('description', 'Descripcion', 'required|is_unique[shuttle_reasons.description]');

		$this->form_validation->set_message('required', 'El campo %s es requerido');
		$this->form_validation->set_message('is_unique', 'Ya existe otro Motivo con el %s especificado');

		if ($this->form_validation->run() !== FALSE) {
			$insert_id = $this->shuttle_reason_model->save();

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
