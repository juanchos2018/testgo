<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Vouchers extends MY_Controller {

    public function __construct()
    {
        parent::__construct();
        $this->load->model('voucher_model');
	}

	public function get_info($customer_id, $company_id, $sale_point_id, $regime)
	{
		$data = $this->voucher_model->get_info($customer_id, $company_id, $sale_point_id, $regime);

		if ($data !== FALSE) {
			$this->json_output($data);
		} else {
			$this->error_output(400, 'Ocurrió un error');
		}
	}
}