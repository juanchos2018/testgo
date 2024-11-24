<?php

class Role_model extends CI_Model
{
    var $description = '';

    function __construct()
    {
        parent::__construct();
    }
    
    function get_list($where = NULL, $order = 'description ASC')
    {
        $this->db->select('
            roles.id,
            roles.description AS text
        ');
        $this->db->from('roles');
        
        if (!is_null($where)) {
            $this->db->where($where);
        }
        
        if (!is_null($order)) {
            $this->db->order_by($order);
        }
        
        $query = $this->db->get();
        
        return $query->result_array();
    }

    function add() {
        $this->description = $this->input->post('description');
     
        if ($this->db->insert('roles', $this)) {
            return $this->db->insert_id();
        } else {
            return FALSE;
        }
    }
}