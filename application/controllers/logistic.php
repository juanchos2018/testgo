<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Logistic extends MY_Controller {

	public function __construct()
	{
		parent::__construct();
		//$this->load->model('sales_model');
	}

	public function dashboard() 
	{
		$this->load->view('logistic/dashboard');
	}
}