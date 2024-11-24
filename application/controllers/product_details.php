<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Product_details extends MY_Controller {

	public function __construct()
	{
		parent::__construct();

		$this->load->model('product_detail_model');
	}

	public function search()
	{
        $term = ($this->input->get('term') ? $this->input->get('term') : NULL);
        $company_id = ($this->input->get('company_id') ? $this->input->get('company_id') : NULL);
        $regime = ($this->input->get('regime') ? $this->input->get('regime') : NULL);
		$page = ($this->input->get('page') ? $this->input->get('page') : 1);
		$display = ($this->input->get('display') ? $this->input->get('display') : 10);

		$data = $this->product_detail_model->search($term, $company_id, $regime, $page, $display);

		$this->json_output($data);
	}

	public function get_by_codes()
	{
		$data = $this->product_detail_model->get_by_codes();

		$this->json_output($data);
	}

}
