<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Category_model extends MY_Model {
	var $description = ''; # CHAR(60)
	var $image = ''; # CHAR(255)
	var $active = ''; # BOOLEAN

	public function __construct()
	{
		parent::__construct();
	}

	public function get_all($active = 't')
	{
		try {
			$this->db->select('*');
			$this->db->from('categories');		
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

	public function save($category)
	{
		$data = array(
			"description" => $category
		);

		$this->db->like("description",$category);
		$check_exists =$this->db->get("categories");
		if($check_exists->num_rows() ==0){
			$this->db->insert("categories",$data);
			return true;
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
        $this->db->where("id",$id)->delete("posts");
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
            "description"    =>        $description
        );    
        $this->db->where("id",$id);
        return $this->db->update("categories", $data);
    }

    function simple_list($active = 't', $terms = NULL)
    {
        try {
            $this->db->select('id, description AS text', FALSE);
            $this->db->from('categories');
			$this->db->where('active', $active);
			if(!is_null($terms)) {
				$this->db->where("description ILIKE '%$terms%'" );
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

/* End of file model_categories.php */
/* Location: ./application/models/model_categories.php */