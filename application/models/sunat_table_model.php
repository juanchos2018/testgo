<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Sunat_table_model extends CI_Model {
    var $id = '';
    var $description = '';
    var $items = '';

	public function __construct()
	{
		parent::__construct();
	}

	public function get_all()
	{
		$this->db->select('id, description');
		$this->db->select('json_array_length(items) AS items', FALSE);
		$this->db->order_by('id', 'asc');

		$query = $this->db->get('sunat_tables');

		return $query->result_array();
	}

	public function get_codes($id = NULL)
	{
		$this->db->select('array_to_json(array_agg(id)) as result', FALSE);

		if (!is_null($id)) {
			$this->db->where('id <>', $id);
		}

		$query = $this->db->get('sunat_tables');

		if ($query->num_rows() > 0) {
			return $query->row()->result;
		} else {
			return '[]';
		}

		return $query->result_array();
	}

	public function save()
	{
		$this->id = $this->input->post('id');
		$this->description = $this->input->post('description');
		$this->items = $this->input->post('items');

		return $this->db->insert('sunat_tables', $this);
	}

	public function get($id)
	{
		$this->db->select('id, description, items');

		$query = $this->db->get_where('sunat_tables', array('id' => $id));

		if ($query->num_rows() > 0) {
			return $query->row();
		} else {
			return array();
		}
	}

	public function update($id)
	{
		$this->id = $this->input->post('id');
		$this->description = $this->input->post('description');
		$this->items = $this->input->post('items');

		$this->db->where('id', $id);

		return $this->db->update('sunat_tables', $this);
	}

	public function delete()
    {
        $id = $this->input->post('id');

        return $this->db->delete('sunat_tables', array('id' => $id));
    }

    public function get_for_inventory()
    {
        $this->db->select('id, description, items');
        $this->db->where_in('id', array(5, 6, 10, 12)); // TIPO DE EXISTENCIA

		$query = $this->db->get('sunat_tables');

		if ($query->num_rows() > 0) {
			return $query->result_array();
		} else {
			return array();
		}
    }
}
