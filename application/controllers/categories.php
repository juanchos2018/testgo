<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Categories extends MY_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->model('category_model','model');
	}

	public function index()
	{  
        $data['records'] = $this->model->get_all();
		$this->load->view('maintenance/categories/index',$data);
	}

	public function lists()
    {
    	echo json_encode($this->model->get_all());
    }

    public function add()
    {
        $this->load->view('maintenance/categories/add');
    }

    public function trash()
    {
        $data['records'] = $this->model->get_all('f');
        
        $this->load->view('maintenance/categories/trash', $data);
    }

    public function save()
    {
        if (!empty($this->input->post())) {
            $this->form_validation->set_rules('description', 'description', 'required|max_length[50]');
            $this->form_validation->set_rules('image', 'image', '|max_length[50]');
           
            if ($this->form_validation->run() !== FALSE) {
                if ($this->model->quick_save('categories')) {
                    $this->json_output(array('success' => TRUE));
                } else {
                    $this->error_output('400', 'Error al insertar');
                }
            } else {
                $this->error_output('400', 'Los datos no son válidos');
            }
        } else {
            $this->error_output('400', 'No se recibieron datos');
        }
    }

    public function recycle()
    {
        if (!empty($this->input->post())) {
            if ($this->model->quick_trash('categories')) {
                $this->json_output(array('success' => TRUE));
            } else {
                $this->error_output('400', 'Error al enviar a papelera');
            }
        } else {
            $this->error_output('400', 'No se recibieron datos');
        }
    }

    public function restore()
    {
        if (!empty($this->input->post())) {
            if ($this->model->quick_restore('categories')) {
                $this->json_output(array('success' => TRUE));
            } else {
                $this->error_output('400', 'Error al restaurar');
            }
        } else {
            $this->error_output('400', 'No se recibieron datos');
        }
    }

    public function remove()
    {
        if (!empty($this->input->post())) {
            if ($this->model->quick_remove('categories')) {
                $this->json_output(array('success' => TRUE));
            } else {
                $this->error_output('400', 'Error al eliminar');
            }
        } else {
            $this->error_output('400', 'No se recibieron datos');
        }
    }

    public function register_category()
    {
        if($this->input->post('cod'))
        {
            $new_category = $this->input->post('cod');
            $category = $this->model->save($new_category);
            if($category == true){
                echo json_encode(array("respuesta" => "success"));
            }else{
                echo json_encode(array("respueta" => "error"));
            }
        }   
    }

    public function delete()
    {
    	$id = $this->input->post('cod');
    	print json_encode( array("success"=>TRUE,"msg"=>$this->model->delete($id)));
    }

    public function simple_list($active = 't', $terms = NULL)
    {
        $terms = ($this->input->get('terms') ? $this->input->get('terms') : NULL);
        $data = $this->model->simple_list($active, $terms);

        $this->json_output($data);
    }
}

/* End of file categories.php */
/* Location: ./application/controllers/categories.php */