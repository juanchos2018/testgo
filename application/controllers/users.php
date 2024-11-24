<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Users extends MY_Controller {

	public function __construct()
	{
		parent::__construct();

		$this->load->model('user_model');
        $this->load->model('company_model');
        $this->load->model('branch_model');
	}	

    public function index()
    {
        $data['records'] = $this->user_model->get_all();

        $this->load->view('users/index', $data);
    }

    public function add()
    {
        $username = $this->input->post('username');

        if (!empty($username)) {
            $this->form_validation->set_rules('username', 'Nombre de usuario', 'trim|required|is_unique[users.username]');
            //$this->form_validation->set_rules('email', 'Correo electrónico', 'trim|required|valid_email|is_unique[users.email]');
            $this->form_validation->set_rules('password', 'Contraseña', 'required|base64_decode');
            $this->form_validation->set_rules('avatar_mode', 'Tipo de avatar', 'trim|required|numeric');
            $this->form_validation->set_rules('avatar', 'Avatar', 'trim|required');
            $this->form_validation->set_rules('role_id', 'ID de cargo', 'trim|required|numeric');
            $this->form_validation->set_rules('employee_id', 'ID de empleado', 'trim|required|numeric');

            if ($this->form_validation->run() !== FALSE) {
                $avatar_mode = $this->input->post('avatar_mode');

                if (empty($avatar_mode)) {
                    if (isset($_FILES['avatar_file'])) {
                        $_POST['avatar'] .= $this->input->post('username') . '.png';
                        $tmp_name = $_FILES['avatar_file']['tmp_name'];
                        $name = './public/' . $this->input->post('avatar');

                        if (!move_uploaded_file($tmp_name, $name)) {
                            // Mostrar error y detener el proceso
                        }
                    } else {
                        // Mostrar error y detener el proceso
                    }
                }

                $insert = $this->user_model->add();

                if ($insert) {
                    $this->output
                        ->set_content_type('application/json')
                        ->set_output(json_encode(array(
                            'id' => $insert
                        )));
                }
            } else {
                // Mostrar error y detener el proceso
            }
        } else {
            $this->load->model('employee_model');
            $this->load->model('role_model');

            $data['employees'] = $this->employee_model->get_list(array('employees.user_id' => NULL));
            $data['roles'] = $this->role_model->get_list();
            $data['companies'] = $this->company_model->get_list();
            $data['branches'] = $this->branch_model->get_list();
            $data['usernames'] = array();

            $usernames = $this->user_model->get_fields('username');

            foreach ($usernames as $username) {
                $data['usernames'][] = $username->username;
            }

            $this->load->view('users/add', $data);
        }
    }

    public function edit($id)
    {
        $username = $this->input->post('username');

        if (!empty($username)) {
            $this->form_validation->set_rules('username', 'Nombre de usuario', 'trim|required|is_unique[users.username]');
            //$this->form_validation->set_rules('email', 'Correo electrónico', 'trim|required|valid_email|is_unique[users.email]');
            $this->form_validation->set_rules('password', 'Contraseña', 'required|base64_decode');
            $this->form_validation->set_rules('avatar_mode', 'Tipo de avatar', 'trim|required|numeric');
            $this->form_validation->set_rules('avatar', 'Avatar', 'trim|required');
            $this->form_validation->set_rules('role_id', 'ID de cargo', 'trim|required|numeric');
            $this->form_validation->set_rules('employee_id', 'ID de empleado', 'trim|required|numeric');

            if ($this->form_validation->run() !== FALSE) {
                $avatar_mode = $this->input->post('avatar_mode');

                if (empty($avatar_mode)) {
                    if (isset($_FILES['avatar_file'])) {
                        $_POST['avatar'] .= $this->input->post('username') . '.png';
                        $tmp_name = $_FILES['avatar_file']['tmp_name'];
                        $name = './public/' . $this->input->post('avatar');

                        if (!move_uploaded_file($tmp_name, $name)) {
                            // Mostrar error y detener el proceso
                        }
                    } else {
                        // Mostrar error y detener el proceso
                    }
                }

                $insert = $this->user_model->add();

                if ($insert) {
                    $this->output
                        ->set_content_type('application/json')
                        ->set_output(json_encode(array(
                            'id' => $insert
                        )));
                }
            } else {
                // Mostrar error y detener el proceso
            }
        } else {
            $this->load->model('employee_model');
            $this->load->model('role_model');

            $data['user'] = $this->user_model->get($id);

			if (!count($data['user'])) {
				// Mostrar un error y detener el proceso
			}

            $data['employees'] = $this->employee_model->get_list(array('employees.user_id' => NULL), 'employees.name ASC', array('users.id' => $id));
            $data['roles'] = $this->role_model->get_list();
            $data['companies'] = $this->company_model->get_list();
            $data['branches'] = $this->branch_model->get_list();
            $data['usernames'] = array();

            $usernames = $this->user_model->get_fields('username');

            foreach ($usernames as $username) {
				if ($username->username !== $data['user']['username']) {
                	$data['usernames'][] = $username->username;
				}
            }

            $this->load->view('users/edit', $data);
        }
    }
}
