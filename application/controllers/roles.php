<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Roles extends MY_Controller {

	public function __construct()
	{
		parent::__construct();
        
        $this->load->model('role_model');
	}

	public function add()
	{
        if (!empty($this->input->post('description'))) {
            $insert = $this->role_model->add();
            
            if ($insert) {
                $this->output
                    ->set_content_type('application/json')
                    ->set_output(json_encode(array(
                        'id' => $insert,
                        'text' => $this->input->post('description')
                    )));
            } // else: mostrar algún JSON de error
            
        } else {
            // Mostrar el formulario para agregar empleados
        }
    }

}