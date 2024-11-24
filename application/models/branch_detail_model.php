<?php

class Branch_detail_model extends CI_Model
{
    var $branch_id = '';
    var $company_id = '';

    function __construct()
    {
        parent::__construct();
    }
    
    function get($company_id, $branch_id)
    {
        $this->db->select('id');
        
        $query = $this->db->get_where('branch_details', array(
            'company_id' => $company_id,
            'branch_id' => $branch_id
        ));
        
        if ($query->num_rows() > 0) {
            return intval($query->row()->id);
        }
        
        return 0;
    }

    function get_for_sale_point($branch_id = NULL)
    {
        if (is_null($branch_id)) {
            $branch_id = $this->session->userdata('user_branch');
        }

        $query = $this->db->get_where('branch_details', array( 'branch_id' => $branch_id ));
        $branch_details = $query->result_array();
        $result = array();

        foreach ($branch_details as $branch_detail) {
            $result[$branch_detail['company_id']] = $branch_detail;
        }

        return $result;
    }
}
