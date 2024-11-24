<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Inputs extends MY_Controller {

	public function __construct()
	{
		parent::__construct();
		//$this->load->model('sales_model');
	}

	public function index()
	{
		$this->load->view('logistic/inputs/index.php');
	}

}

/* End of file inputs.php */
/* Location: ./application/controllers/inputs.php */