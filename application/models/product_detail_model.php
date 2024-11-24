<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Product_detail_model extends CI_Model {

	var $product_id = '';
	var $company_id = '';
	var $price = '';
	var $cost = '';
	var $offer_price = '';
	var $invoice_currency = '';
	var $invoice_cost = '';
	var $cost_currency = '';
	var $cat = '';
	var $offer_price2 = '';

	function __construct()
    {
        parent::__construct();
    }

	function search($term, $company_id, $regime, $page = 1, $display = 10) {
		$result = array();

		$this->_search($term, $company_id, $regime);

		$result['total_count'] = $this->db->count_all_results();

		if ($result['total_count'] > 0) {
			$this->db->select("
                product_details.id,
                product_details.product_id,
				products.code as text,
				products.description
			", FALSE);

			$this->_search($term, $company_id, $regime);

			$this->db->limit($display, ($page - 1) * $display);
			$this->db->order_by('products.description ASC');

			$query = $this->db->get();

			$result['items'] = $query->result_array();
		} else {
			$result['items'] = array();
		}

		return $result;
	}

	private function _search($term, $company_id, $regime) {
        $this->db->from('product_details');
        $this->db->join('products', 'product_details.product_id = products.id');

        $this->db->where('products.regime', $regime);
        $this->db->where('product_details.company_id', $company_id);
        $this->db->where('products.active', 't');
		$this->db->where("(products.code ILIKE '%$term%' OR products.description ILIKE '%$term%')");
	}

	function get_by_codes()
	{
		$codes = $this->input->post('codes');
		$regime = $this->input->post('regime');
		$company_id = $this->input->post('company_id');
        
        $this->db->select("
        	product_details.id,
        	products.code
        ", FALSE);
        
        $this->db->from('product_details');
        $this->db->join('products', 'product_details.product_id = products.id');

        $this->db->where('products.regime', $regime);
        $this->db->where('product_details.company_id', $company_id);
        $this->db->where('products.active', 't');
        $this->db->where('products.code IN', "('" . implode($codes, "','") . "')", FALSE);

        $query = $this->db->get();

        return $query->result_array();
	}

}
