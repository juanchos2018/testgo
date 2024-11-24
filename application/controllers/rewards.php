<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Rewards extends MY_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->model('Reward_model', 'model');

	}

	public function index()
	{
		$data['records'] = $this->model->get_all('t');
		
		$this->load->view('marketing/rewards/index', $data);
	}

	public function add()
	{
		$this->load->model('company_model');
		//$this->load->model('branch_model');

		
		//$data['companies'] = $this->company_model->get_list();
		//$data['branches'] = $this->branch_model->get_all();
		$this->load->view('marketing/rewards/add');
	}


    public function trash()
    {
    	
        $data['records'] = $this->model->get_all('f');
        
        $this->load->view('marketing/rewards/trash', $data);
    }

	public function save()
	{
		if (!empty($this->input->post())) {
			$this->form_validation->set_rules('description', 'description', 'required|max_length[50]');
			$this->form_validation->set_rules('abbrev', 'abbrev', 'required');
			$this->form_validation->set_rules('min_points', 'min_points', 'required|numeric');
			$this->form_validation->set_rules('earn_points', 'earn_points', 'required|numeric');
			$this->form_validation->set_rules('points_to_voucher', 'points_to_voucher', 'required|numeric');
			$this->form_validation->set_rules('voucher_amount', 'voucher_amount', 'required|numeric');
			$this->form_validation->set_rules('company_id', 'company_id', 'required|numeric');
			$this->form_validation->set_rules('voucher_birthday', 'voucher_birthday', 'required|numeric');

			if ($this->form_validation->run() !== FALSE) {
				if ($this->model->quick_save('rewards')) {
					$this->json_output(array('success' => TRUE));
				} else {
					$this->error_output('400', 'Error al insertar');
				}
			} else {
				$this->error_output('400', 'Los datos no son válidos');
			}
		} else {
			$this->error_output('400', 'No se recibieron datos');
		}
	}

	public function recycle()
	{
		if (!empty($this->input->post())) {
			if ($this->model->quick_trash('rewards')) {
				$this->json_output(array('success' => TRUE));
			} else {
				$this->error_output('400', 'Error al enviar a papelera');
			}
		} else {
			$this->error_output('400', 'No se recibieron datos');
		}
	}

	public function restore()
	{
		if (!empty($this->input->post())) {
			if ($this->model->quick_restore('rewards')) {
				$this->json_output(array('success' => TRUE));
			} else {
				$this->error_output('400', 'Error al restaurar');
			}
		} else {
			$this->error_output('400', 'No se recibieron datos');
		}
	}

	public function remove()
	{
		if (!empty($this->input->post())) {
			if ($this->model->quick_remove('rewards')) {
				$this->json_output(array('success' => TRUE));
			} else {
				$this->error_output('400', 'Error al eliminar');
			}
		} else {
			$this->error_output('400', 'No se recibieron datos');
		}
	}

}

/* End of file rewards.php */
/* Location: ./application/controllers/rewards.php */