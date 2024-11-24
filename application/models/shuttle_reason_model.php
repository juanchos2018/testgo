<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Shuttle_reason_model extends CI_Model {

	var $description = NULL; #varchar(70)

	function __construct()
    {
        parent::__construct();
    }

	function simple_list()
	{
		try {
			$this->db->select('id, description AS text', FALSE);
			$this->db->from('shuttle_reasons');
            $this->db->order_by('description');

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
		$this->description = $this->input->post('description');

		if ($this->db->insert('shuttle_reasons', $this)) {
			return $this->db->insert_id();
		} else {
			return FALSE;
		}
	}
}
