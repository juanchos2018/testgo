<?php

class Size_model extends CI_Model
{
    var $company_id = '';
    var $address = '';
    var $alias = '';
    var $active = '';

    function __construct()
    {
        parent::__construct();
    }

    function get_list($where = "size.active = 't'", $order = 'description ASC')
    {
        $this->db->select('
            size.id,
            size.description AS text
        ');
        $this->db->from('size');
        
        if (!is_null($where)) {
            $this->db->where($where);
        }
        
        if (!is_null($order)) {
            $this->db->order_by($order);
        }
        
        $query = $this->db->get();
        
        return $query->result_array();
    }

    function get_size($where = "size.active = 't'", $order = 'description ASC')
    {
        $this->db->select('
            size.id,
            size.description AS text
        ');
        $this->db->from('size');
        
        if (!is_null($where)) {
            $this->db->where($where);
        }
        
        if (!is_null($order)) {
            $this->db->order_by($order);
        }
        
        $query = $this->db->get();
        
        return $query->row_array();
    }
    
    function get_for_summary()
	{
		$ids = $this->input->post('ids');
        
        $this->db->select("
            size.id,
        	size.description
        ", FALSE);
        
        $this->db->where('size.id IN', '(' . implode($ids, ',') . ')', FALSE);

        $query = $this->db->get('size');

        return $query->result_array();
	}

}