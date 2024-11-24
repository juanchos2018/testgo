<?php

class Currency_model extends CI_Model
{
    var $description = '';
    var $active = '';
    var $exchange_rate = '';

    function __construct()
    {
        parent::__construct();
    }

    function get_list($where = "currencies.active = 't'", $order = 'currencies.id ASC')
    {
        $this->db->select('
            currencies.id,
            currencies.description,
            currencies.active,
            currencies.exchange_rate
        ');
        $this->db->from('currencies');
        
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