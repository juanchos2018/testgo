<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Settings extends MY_Controller {

	public function __construct()
	{
		parent::__construct();
		
		$this->load->model('setting_model');
	}

	public function sales()
	{
		$this->load->view('settings/sales');
	}
	
	public function save()
	{
		if ($this->input->is_post()) {
			if ($this->setting_model->save()) {
				$this->json_output(array('ok' => TRUE));
			} else {
				$this->json_output(array('error' => TRUE));
			}
		}
	}

}
