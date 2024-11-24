<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Bank_model extends MY_Model {
	var $description = '';
	var $active = '';

	public $table = 'banks';

	public function __construct()
	{
		parent::__construct();
	}

	public function get_all($active = 't')
	{
		try {
			$this->db->select('*');
			$this->db->from($this->table);		
			$this->db->where('active', $active);
			$data = $this->db->get();

			if ($data->num_rows() > 0) {
				return $data->result();
			} else {
				return FALSE;
			}
		} catch (Exception $e) {
			echo "ERROR: ".$e->getMessage();
		}
	}

	public function get($id)
	{
		return $this->db->where('id', $id)->get($this->table)->row();
	}

	public function add($bank)
	{
		$data = array(
			"name" => $bank
		);

		$this->db->like("name",$bank);
		$check_exists =$this->db->get($this->table);
		if($check_exists->num_rows() ==0){
			$this->db->insert($this->table,$data);
			return $this->db->insert_id();
		}else{
			return false;
		}

	}

	/**
    *@desc eliminamos una marca por su id
    * @param $id - int contiene el id de la marca
    */
	public function delete($id)
    {
        $this->db->where("id",$id)->delete($this->table);
        return $this->db->affected_rows();
    }
 
    /**
    *@desc actualiza un post por su id
    * @param $id - int contiene el id de la marca
    * @param $description - string contiene la descripcion de la marca
    */
    public function update($id,$description)
    {
        $data = array(
            "name"    =>        $description
        );    
        $this->db->where("id",$id);
        return $this->db->update($this->table, $data);
    }

}

/* End of file model_banks.php */
/* Location: ./application/models/model_banks.php */