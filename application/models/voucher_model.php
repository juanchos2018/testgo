<?php

class Voucher_model extends CI_Model
{
    var $description = '';
    var $abbrev = '';
    var $active = '';

    function __construct()
    {
        parent::__construct();
    }

    function get_info($customer_id, $company_id, $sale_point_id, $regime) {
    	$branch_id = $this->session->userdata('user_branch');
    	$data = array();

    	$this->db->select("
    		company_name AS company,
    		address,
    		department AS address_department,
    		province AS address_province,
    		district AS address_district,
    		ruc
    	", FALSE);
    	$this->db->where('active', 't');
    	$this->db->where('id', $company_id);
    	$this->db->from('companies');

    	$query = $this->db->get();

    	if ($query->num_rows()) {
    		$data = array_merge($data, $query->row_array());

    		$this->db->select("
    			address AS tax_address,
    			department AS tax_department,
    			province AS tax_province,
    			district AS tax_district
    		", FALSE);
    		$this->db->from('branches');
    		$this->db->where('active', 't');
    		$this->db->where('id', $branch_id);

    		$query = $this->db->get();

    		if ($query->num_rows()) {
    			$data = array_merge($data, $query->row_array());

    			$this->db->select("
    				printer_serial AS printer
    			", FALSE);
    			$this->db->from('sale_points');
    			$this->db->where('active', 't');
    			$this->db->where('id', $sale_point_id);

    			$query = $this->db->get();
				$data = array_merge($data, $query->row_array());

				if (!empty($customer_id)) {
					$this->db->select("
						name AS customer_name,
						type AS customer_type,
						id_number AS customer_doc,
						address AS customer_address
					", FALSE);
					$this->db->from('customers');
					$this->db->where('active', 't');
					$this->db->where('id', $customer_id);

					$query = $this->db->get();

					if ($query->num_rows()) {
						$data = array_merge($data, $query->row_array());
					} else {
						return FALSE;
					}
				}

				if ($regime === 'ZOFRA') {
					$data['tax'] = 0;
				} else {
					$data['tax'] = 0.18;
				}

				return $data;
    		} else {
    			return FALSE;
    		}
    	} else {
    		return FALSE;
    	}
    }
}