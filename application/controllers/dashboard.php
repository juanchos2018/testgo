<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Dashboard extends MY_Controller {

	public function __construct()
	{
		$this->allowed_uris = array('/dashboard/index');

		parent::__construct();
	}

	public function index()
	{
		$this->load->model('branch_model');
		$this->load->model('regime_model');
		$this->load->model('setting_model');

		$data['branches'] = $this->branch_model->get_for_settings();
		$data['regimes'] = $this->regime_model->get_for_settings();
		$data['settings'] = $this->setting_model->get_all();

		$this->load->view('templates/app', $data);
	}

	public function start()
	{
		if ($this->session->userdata('user_role') === 'Operador de Ventas') {
			$this->load->view('dashboard/start_saleman');
		} else {
			$user_branch = $this->session->userdata('user_branch');
			
			$this->load->model('sale_model');

			$data['products_records'] = $this->sale_model->get_sale_percent($user_branch);
			$data['history'] = $this->sale_model->get_history_by_branch();

			$this->load->view('dashboard/start', $data);
		}
	}

}
