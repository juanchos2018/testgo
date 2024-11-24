<?php

class Refund_reason_model extends CI_Model
{
    var $description = NULL;

    function __construct()
    {
        parent::__construct();
    }
    
    function get_all()
    {
        $this->db->select('
            id,
            description
        ');
        
        $this->db->from('refund_reasons');
        
        $this->db->order_by('id ASC');
        
        $query = $this->db->get();
        
        return $query->result_array();
    }
}