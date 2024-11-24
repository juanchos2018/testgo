<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Stock extends MY_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->model('stock_model');
	}

    public function get_sizes_for_product($product_id, $company_id)
    {
        $data = $this->stock_model->get_sizes_for_product($product_id, $company_id);

        $this->json_output($data);
    }
}
