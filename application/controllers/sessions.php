<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Sessions extends MY_Controller {

	public function __construct()
	{
		$this->allowed_uris = array('/sessions/login', '/sessions/recover_account', '/sessions/validate', '/sessions/set', '/sessions/remove');

		parent::__construct();

        $this->load->model('session_model');
        //$this->load->model('company_model');
        $this->load->model('branch_model');
        $this->load->model('sale_point_model');
	}

	public function login()
	{
		$this->load->view('sessions/login');
	}

    public function recover_account()
    {
		$this->load->view('sessions/recover_account');
    }

	public function validate()
	{
		$this->form_validation->set_rules('login', 'Usuario', 'trim|required');
		$this->form_validation->set_rules('password', 'Contraseña', 'required|base64_decode');

        $error = FALSE;

		if ($this->form_validation->run() !== FALSE) {
			$login = $this->input->post('login');
			$password = $this->input->post('password');

			$user = $this->session_model->validate($login, crypt($password, $this->config->item('encryption_key')));

			if (is_string($user)) { // $user devuelve una cadena cuando ocurre un error
				$error = $user;
			} else { // $user devuelve información del usuario
				$data = array(
					'id' => $user->id,
                    'name' => $user->name,
                    'last_name' => $user->last_name,
					'full_name' => $user->full_name,
                    'email' => $user->email,
                    'username' => $user->username,
                    'role_id' => $user->role_id,
                    'role' => $user->role,
					'branches_granted' => $user->branches_granted,
					'avatar' => $user->avatar,
                    'company' => $user->company, // Must distinct than 0
                    'branch' => $user->branch, // Can be 0
                    'default_branch' => $user->default_branch // Can be 0
				);
				
				if ($user->role === 'Desarrollador') {
				    $this->load->model('role_model');
				    
				    $data['roles'] = $this->role_model->get_list();
				}
			}
		} else {
			$error = 'input';
		}

        if ($error !== FALSE) {
            $this->json_output(array('error' => $error));
        } elseif (isset($data)) {
            $this->json_output($data);
        }
	}

	public function set() {
        //$this->session_model->get_permissions($user->id);
        $branch_id = (intval($this->input->post('defaultBranchId')) ? $this->input->post('defaultBranchId') : $this->input->post('branchId'));
        $company_id = $this->input->post('companyId');
        //$sale_point_id = $this->sale_point_model->id_by_addr($address, $branch_id);
        $sale_point_id = 0;
        $branches_granted = ($this->input->post('branchesGranted') === 'true');
        
        $data = array(
			'user_id' => $this->input->post('id'),
			'user_name' => $this->input->post('name'),
			'user_last_name' => $this->input->post('lastName'),
			'user_username' => $this->input->post('username'),
			'user_email' => $this->input->post('email'),
            'user_company' => $company_id,
            'user_branch' => $branch_id,
            'user_branch_name' => $this->input->post('branch'),
            'user_avatar' => $this->input->post('avatar'),
            'user_sale_point' => $sale_point_id,
            'user_granted' => $branches_granted,
            'user_companies' => json_encode($this->input->post('companies')),
            'user_role_id' => $this->input->post('roleId'),
            'user_role' => $this->input->post('role')
		);

        $this->session->set_userdata($data);

        $this->output
            ->set_content_type('text/plain; charset=utf-8')
            ->set_output(base64_encode(implode('&', array_map('utf8_decode', $data))));
	}

	public function get() {
        
        $data = array(
            $this->session->userdata('user_id'),
            $this->session->userdata('user_name'),
            $this->session->userdata('user_last_name'),
            $this->session->userdata('user_username'),
            $this->session->userdata('user_email'),
            $this->session->userdata('user_company'),
            $this->session->userdata('user_branch'),
            $this->session->userdata('user_branch_name'),
            $this->session->userdata('user_avatar'),
            $this->session->userdata('user_sale_point'),
            $this->session->userdata('user_granted'),
            $this->session->userdata('user_companies'),
            $this->session->userdata('user_role_id'),
            $this->session->userdata('user_role')
        );

		$this->output
		    ->set_content_type('text/plain; charset=utf-8')
		    ->set_output(base64_encode(implode('&', array_map('utf8_decode', $data))));
	}

    public function switch_branch() {
        $this->session->set_userdata(array(
            'user_branch' => $this->input->post('user_branch'),
            'user_branch_name' => $this->input->post('user_branch_name')
        ));

        $this->get();
    }

	public function remove() {
		$this->session->unset_userdata(array(
			'user_id' => '',
			'user_name' => '',
			'user_last_name' => '',
			'user_username' => '',
			'user_email' => '',
            'user_company' => '',
            /*'user_company_name' => '',
            'user_company_regime' => '',
            'user_company_tax' => '',*/
            'user_branch' => '',
            'user_branch_name' => '',
            /*'user_assigned_company' => '',
            'user_assigned_branch' => '',*/
            'user_avatar' => '',
            'user_sale_point' => '',
            'user_granted' => '',
            'user_companies' => '',
            'user_role_id' => '',
			'user_role' => ''
		));
	}

}
