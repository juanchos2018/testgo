<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Banks extends MY_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->model('bank_model','model');
	}

	public function index()
	{  
        $data['records'] = $this->model->get_all();
		$this->load->view('maintenance/banks/index', $data);
	}

	public function lists()
    {
    	echo json_encode($this->model->get_all());
    }

    public function register_bank()
    {
    	if($this->input->post('cod'))
    	{
    		$new_bank = $this->input->post('cod');
    		$bank = $this->model->add($new_bank);
    		if($bank){
    			echo json_encode(array("respuesta" => "success","id" => $bank));
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
    public function add()
    {
        $this->load->view('maintenance/banks/add');
    }

    public function trash()
    {
        $data['records'] = $this->model->get_all('f');
        
        $this->load->view('maintenance/banks/trash', $data);
    }

    public function save()
    {
        if (!empty($this->input->post())) {
            $this->form_validation->set_rules('description', 'description', 'required|max_length[50]');
           
            if ($this->form_validation->run() !== FALSE) {
                if ($this->model->quick_save('banks')) {
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
            if ($this->model->quick_trash('banks')) {
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
            if ($this->model->quick_restore('banks')) {
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
            if ($this->model->quick_remove('banks')) {
                $this->json_output(array('success' => TRUE));
            } else {
                $this->error_output('400', 'Error al eliminar');
            }
        } else {
            $this->error_output('400', 'No se recibieron datos');
        }
    }

}

/* End of file banks.php */
/* Location: ./application/controllers/banks.php */