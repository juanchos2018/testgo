<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Setting_model extends MY_Model {
	var $description = '';
	var $text_value = '';
	var $numeric_value = '';
	var $boolean_value = '';

	public function __construct()
	{
		parent::__construct();
	}
	
	public function get($fields)
	{
		// Se deben poder extraer varios valores
	}
	
	public function get_all()
	{
		$this->db->select('id, description, text_value, numeric_value, boolean_value');
		$query = $this->db->get('settings');
		
		if ($query->num_rows() > 0) {
			return $query->result_array();
		} else {
			return array();
		}
	}

	public function get_one($field)
	{
		$this->db->select('id, description, text_value, numeric_value, boolean_value');
		$this->db->where('description', $field);
		$query = $this->db->get('settings');
		
		if ($query->num_rows() > 0) {
			return $query->row();
		} else {
			return NULL;
		}
	}

	public function get_text($field)
	{
		$this->db->select('text_value');
		$this->db->where('description', $field);
		$query = $this->db->get('settings');
		
		if ($query->num_rows() > 0) {
			$row = $query->row();
			
			return $row->text_value;
		} else {
			return '';
		}
	}

	public function get_numeric($field)
	{
		$this->db->select('numeric_value');
		$this->db->where('description', $field);
		$query = $this->db->get('settings');
		
		if ($query->num_rows() > 0) {
			$row = $query->row();
			
			return $row->numeric_value;
		} else {
			return 0;
		}
	}

	public function get_boolean($field)
	{
		$this->db->select('boolean_value');
		$this->db->where('description', $field);
		$query = $this->db->get('settings');
		
		if ($query->num_rows() > 0) {
			$row = $query->row();
			
			return $row->boolean_value;
		} else {
			return FALSE;
		}
	}
	
	public function save()
	{
		$data = array();
			
		foreach ($this->input->post() as $setting => $value) {
			if (strpos($setting, ':') !== FALSE) {
				$nameAndType = explode(':', $setting);
				
				switch ($nameAndType[1]) {
					case 'numeric':
						$data[] = array(
							'description' => $nameAndType[0],
							'numeric_value' => $value
						);
						break;
					case 'boolean':
						$data[] = array(
							'description' => $nameAndType[0],
							'boolean_value' => $value
						);
						break;
					default:
						$data[] = array(
							'description' => $nameAndType[0],
							'text_value' => $value
						);
				}
			} elseif (count($value) === 3) {
				$data[] = array(
					'description' => $setting,
					'text_value' => $value[0],
					'numeric_value' => $value[1],
					'boolean_value' => $value[2]
				);
			}
		}
		
		if (count($data) > 0) {
			$this->db->update_batch('settings', $data, 'description');
			
			return TRUE;
		} else {
			return FALSE;
		}
	}

}
