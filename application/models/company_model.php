<?php

class Company_model extends CI_Model
{
    var $id = '';
    var $name = '';
    var $company_name = '';
    var $address = '';
    var $department = '';
    var $province = '';
    var $district = '';
    var $ruc = '';
    var $active = '';

    function __construct()
    {
        parent::__construct();
    }

    function get_all($order = 'name ASC')
    {
        $this->db->select("
            companies.id,
            companies.name
        ");
        
        $this->db->from('companies');
        
        if (!is_null($order)) {
            $this->db->order_by($order);
        }
        
        $query = $this->db->get();
        
        return $query->result_array();
    }
    
    function get_list($branch_id = NULL, $order = 'name ASC')
    {
        $this->db->select('
            companies.id,
            companies.name AS text
        ');
        $this->db->from('companies');
        $this->db->join('branch_details', 'companies.id = branch_details.company_id');

        if (is_null($branch_id)) {
            $branch_id = $this->session->userdata('user_branch');
        }
        
        $this->db->where('branch_details.branch_id', $branch_id);

        if (!is_null($order)) {
            $this->db->order_by($order);
        }
        
        $query = $this->db->get();
        
        return $query->result_array();
    }

    function get_for_sale($company_id)
    {
        $this->db->select('
            companies.company_name,
            companies.address,
            companies.department,
            companies.province,
            companies.district,
            companies.ruc
        ');

        $this->db->from('companies');

        $this->db->where('companies.id', $company_id);
        $this->db->where('companies.active', 't');

        $this->db->limit(1);

        $query = $this->db->get();
        
        if ($query->num_rows() === 0) {
            return FALSE;
        } else {
            return $query->row_array();
        }
    }

    /*function regime_by_id($id)
    {
        try {
            $this->db->select('regime.regime, regime.tax');
            $this->db->from('companies');
            $this->db->join('regime', 'companies.regime = regime.regime');
            $this->db->where('companies.id', $id);

            $query = $this->db->get();
            
            if ($query->num_rows() > 0) {
                return $query->row();
            } else {
                return '';
            }
        } catch (Exception $e) {
            exit('Error: ' . $e->getMessage());
        }
    }*/
}