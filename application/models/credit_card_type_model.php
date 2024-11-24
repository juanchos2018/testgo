<?php

class Credit_card_type_model extends CI_Model
{
    var $description = '';
    var $abbrev = '';
    var $active = '';

    function __construct()
    {
        parent::__construct();
    }

    function get_list($where = "credit_card_types.active = 't'", $order = 'credit_card_types.description ASC')
    {
        $this->db->select('
            credit_card_types.id,
            credit_card_types.description,
            credit_card_types.abbrev,
            credit_card_types.active
        ');
        
        $this->db->from('credit_card_types');
        
        if (!is_null($where)) {
            $this->db->where($where);
        }
        
        if (!is_null($order)) {
            $this->db->order_by($order);
        }
        
        $query = $this->db->get();
        
        return $query->result_array();
    }
}