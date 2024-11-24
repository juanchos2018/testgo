<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Uses extends MY_Controller {

	public function __construct()
	{
		parent::__construct();

		$this->load->model('use_model', 'model');
	}

    public function simple_list($active = 't', $terms = NULL)
    {
        $terms = ($this->input->get('terms') ? $this->input->get('terms') : NULL);
        $data = $this->model->simple_list($active, $terms);

        $this->json_output($data);
    }
}
