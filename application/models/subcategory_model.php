<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Subcategory_model extends MY_Model {
	var $description = ''; # CHAR(60)
	var $category_id = '';
	var $image = ''; # CHAR(255)
	var $active = '';# BOOLEAN

	public function __construct()
	{
		parent::__construct();
	}

	public function get_all($active = 't')
	{
		try {
			$this->db->select("subcategories.id, subcategories.description, subcategories.image, subcategories.active, COALESCE(categories.description,'SIN CATEGORIA') as category",FALSE);
			$this->db->from('subcategories');
			//$this->db->where('id',$id);
			//$this->db->join('subcategories b', 'b.id = p.subcategory_id');
			//$this->db->join('subcategories c', 'c.id = p.subcategory_id');
			$this->db->join('categories', 'categories.id = subcategories.category_id','LEFT');
			$this->db->where('subcategories.active', $active);
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

	public function save($subcategory)
	{
		$data = array(
			"description" => $subcategory
		);

		$this->db->like("description",$subcategory);
		$check_exists =$this->db->get("subcategories");
		if($check_exists->num_rows() ==0){
			$this->db->insert("subcategories",$data);
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
        return $this->db->update("subcategories", $data);
    }

	function simple_list($active = 't', $terms = NULL)
    {
        try {
            $this->db->select('id, description AS text', FALSE);
            $this->db->from('subcategories');
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

/* End of file model_subcategories.php */
/* Location: ./application/models/model_subcategories.php */
