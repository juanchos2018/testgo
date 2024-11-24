<?php

class User_model extends CI_Model
{
    var $username = '';
    var $email = '';
    var $password = '';
    var $avatar_mode = '';
    var $avatar = '';
    var $role_id = '';
    var $company_id = '';
    var $branch_id = '';
    var $default_branch_id = '';
//    var $employee_id = '';

    function __construct()
    {
        parent::__construct();
    }

    function get_all() {
        $this->db->select("
            users.id,
            users.username,
            users.email,
            employees.name,
            employees.last_name,
            employees.name || ' ' || employees.last_name AS full_name
        ");

        $this->db->from('users');
        $this->db->join('employees', 'users.id = employees.user_id');

        $query = $this->db->get();

        return $query->result_array();
    }

    function get($id) {
        $this->db->select("
            users.id,
            users.username,
            users.email,
            users.avatar_mode,
            users.avatar,
            users.role_id,
            users.company_id,
            users.branch_id,
            employees.id as employee_id
        ");

        $this->db->from('users');
        $this->db->join('employees', 'users.id = employees.user_id');
        $this->db->where('users.id', $id);

        $query = $this->db->get();

        return $query->row_array();
    }

    function get_fields($fields, $where = NULL, $order = NULL) {
        $this->db->select($fields);
        $this->db->from('users');

        if (!is_null($where)) {
            $this->db->where($where);
        }

        if (!is_null($order)) {
            $this->db->order_by($order);
        }

        $query = $this->db->get();

        return $query->result();
    }

    function add() {
        $this->username = $this->input->post('username');
        $this->email = $this->input->post('email');
        $this->password = crypt($this->input->post('password'), $this->config->item('encryption_key'));
        $this->avatar_mode = $this->input->post('avatar_mode');
        $this->avatar = $this->input->post('avatar');
        $this->role_id = $this->input->post('role_id');
        $this->company_id = $this->input->post('company_id');
        $this->branch_id = $this->input->post('branch_id');

        if (empty($this->company_id)) $this->company_id = NULL;
        if (empty($this->branch_id)) $this->branch_id = NULL;

        $this->default_branch_id = NULL;

        if ($this->db->insert('users', $this)) {
            $user_id = $this->db->insert_id();
            $employee_id = $this->input->post('employee_id');

            $this->db->where('id', $employee_id);
            $this->db->update('employees', array('user_id' => $user_id));

            return $user_id;
        } else {
            return FALSE;
        }
    }

}
