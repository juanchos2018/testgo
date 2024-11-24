<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Coupon_model extends CI_Model {

	var $code = '';
	var $amount = '';
	var $creation_date = '';
	var $used_date = '';
	var $active = '';
	var $expiry_date = '';

	function __construct()
    {
        parent::__construct();
    }

    function get_for_sale($code)
    {
    	$this->db->select('
			coupons.id,
			coupons.code,
			coupons.amount
		');

		$this->db->from('coupons');

		$this->db->where('coupons.code', $code);
		$this->db->where('coupons.used_date IS NULL', NULL, FALSE);
		$this->db->where('coupons.active', 't');
		$this->db->where('coupons.creation_date <= NOW()::DATE', NULL, FALSE);
		$this->db->where('(coupons.expiry_date IS NULL OR coupons.expiry_date >= NOW()::DATE)', NULL, FALSE);

		$this->db->limit(1);

		$query = $this->db->get();
		
		if ($query->num_rows() === 0) {
			return FALSE;
		} else {
			return $query->row_array();
		}
    }
}