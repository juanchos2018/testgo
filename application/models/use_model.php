<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Use_model extends CI_Model {
	var $description = ''; 	# CHAR(90)
	var $active = ''; 		# BOOLEAN

	public function __construct()
	{
		parent::__construct();
	}

    function simple_list($active = 't', $terms = NULL)
    {
        try {
            $this->db->select('id, description AS text', FALSE);
            $this->db->from('uses');
            $this->db->where('active', $active);
            if(!is_null($terms)) {
				$this->db->where("description ILIKE '%$terms%'");
			}
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

}
