<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Coupons extends MY_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->model('coupon_model');
	}

	public function get_for_sale($code)
	{
		$coupon = $this->coupon_model->get_for_sale($code);

		if ($coupon !== FALSE) {
			$this->output
				->set_content_type('application/json')
				->set_output(json_encode($coupon));
		} else {
			$this->error_output('400');
		}
	}
}