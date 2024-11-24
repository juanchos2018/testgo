<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Genders extends MY_Controller {

	public function __construct()
	{
		parent::__construct();

		$this->load->model('gender_model','model');
	}

    public function simple_list($active = 't')
    {
        $data = $this->model->simple_list($active);

        $this->json_output($data);
    }
}
