<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Subcategories extends MY_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->model('subcategory_model','model');
	}

	public function index()
	{
        $data['records'] = $this->model->get_all();
		$this->load->view('maintenance/subcategories/index',$data);
	}

	public function add()
    {
        $this->load->model('category_model');

        $data['categories'] = $this->category_model->get_all();
        $this->load->view('maintenance/subcategories/add', $data);
    }

    public function trash()
    {
        $data['records'] = $this->model->get_all('f');

        $this->load->view('maintenance/subcategories/trash', $data);
    }

    public function save()
    {
        if (!empty($this->input->post())) {
            $this->form_validation->set_rules('description', 'description', 'required|max_length[50]');
            $this->form_validation->set_rules('image', 'image', '|max_length[150]');

            if ($this->form_validation->run() !== FALSE) {
                if ($this->model->quick_save('subcategories')) {
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
            if ($this->model->quick_trash('subcategories')) {
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
            if ($this->model->quick_restore('subcategories')) {
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
            if ($this->model->quick_remove('subcategories')) {
                $this->json_output(array('success' => TRUE));
            } else {
                $this->error_output('400', 'Error al eliminar');
            }
        } else {
            $this->error_output('400', 'No se recibieron datos');
        }
    }

	public function simple_list($active = 't', $terms = NULL)
    {
        $terms = ($this->input->get('terms') ? $this->input->get('terms') : NULL);
        $data = $this->model->simple_list($active, $terms);

        $this->json_output($data);
    }

}

/* End of file subcategories.php */
/* Location: ./application/controllers/subcategories.php */
