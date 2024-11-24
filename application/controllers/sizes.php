<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Sizes extends MY_Controller {

	public function __construct()
	{
		parent::__construct();
		
		$this->load->model('size_model');
	}
	
	public function get_for_summary()
	{
		$data = $this->size_model->get_for_summary();

		$this->json_output($data);
	}

}
