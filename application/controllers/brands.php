<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Brands extends MY_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->model('brand_model','model');
	}

	public function index()
	{
        $data['records'] = $this->model->get_all();
		$this->load->view('maintenance/brands/index',$data);
	}

	public function lists()
    {
    	echo json_encode($this->model->get_all());
    }

    public function simple_list($active = 't', $terms = NULL)
    {
        $terms = ($this->input->get('terms') ? $this->input->get('terms') : NULL);

        $data = $this->model->simple_list($active, $terms);

        $this->json_output($data);
    }

    public function add()
    {
        $this->load->view('maintenance/brands/add');
    }

    public function trash()
    {
        $data['records'] = $this->model->get_all('f');
        
        $this->load->view('maintenance/brands/trash', $data);
    }

    public function save()
    {
        if (!empty($this->input->post())) {
            $this->form_validation->set_rules('description', 'description', 'required|max_length[50]');
           
            if ($this->form_validation->run() !== FALSE) {
                if ($this->model->quick_save('brands')) {
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

    public function register_brand()
    {
    	if($this->input->post('cod'))
    	{
    		$new_brand = $this->input->post('cod');
    		$brand = $this->model->save($new_brand);
    		if($brand == true){
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

    public function recycle()
    {
        if (!empty($this->input->post())) {
            if ($this->model->quick_trash('brands')) {
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
            if ($this->model->quick_restore('brands')) {
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
            if ($this->model->quick_remove('brands')) {
                $this->json_output(array('success' => TRUE));
            } else {
                $this->error_output('400', 'Error al eliminar');
            }
        } else {
            $this->error_output('400', 'No se recibieron datos');
        }
    }

}

/* End of file brands.php */
/* Location: ./application/controllers/brands.php */