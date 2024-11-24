<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Supplier_model extends CI_Model {

	var $id_number = NULL; #varchar(13) ?
	var $name = NULL; #varchar(80)
	var $phone_number = NULL; #varchar(13)
	var $phone_number2 = NULL; #varchar(13)
	var $address = NULL; #varchar(250)

	function __construct()
    {
        parent::__construct();
    }

	function simple_list()
	{
		try {
			$this->db->select('id, name AS text', FALSE);
			$this->db->from('suppliers');
            $this->db->order_by('name');

			$query = $this->db->get();

			if ($query->num_rows() > 0) {
				return $query->result();
			} else {
				return array();
			}
		} catch (Exception $e) {
			exit(var_dump($e->getMessage));
		}
	}

	function save()
	{
		$this->id_number = $this->input->post('id_number');
		$this->name = $this->input->post('name');
		$this->address = $this->input->post('address') ? $this->input->post('address') : NULL;
		$this->phone_number = $this->input->post('phone_number') ? $this->input->post('phone_number') : NULL;
		$this->phone_number2 = $this->input->post('phone_number2') ? $this->input->post('phone_number2') : NULL;

		if ($this->db->insert('suppliers', $this)) {
			return $this->db->insert_id();
		} else {
			return FALSE;
		}
	}
}
