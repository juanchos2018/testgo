<?php

class Session_model extends CI_Model
{

    function __construct()
    {
        parent::__construct();
    }

    function validate($login, $password)
    {
        $this->db->select("
            users.id,
            users.username,
            users.email,
            users.avatar,
            COALESCE(employees.name, users.username) AS name,
            employees.last_name,
            (CASE WHEN employees.id IS NOT NULL THEN employees.name || ' ' || employees.last_name ELSE users.username END) AS full_name,
            COALESCE(users.company_id, 0) AS company,
            COALESCE(users.branch_id, 0) AS branch,
            COALESCE(users.default_branch_id, 0) AS default_branch,
            roles.description AS role,
            roles.id AS role_id,
            roles.all_branches_granted AS branches_granted
        ", FALSE);

        $this->db->from('users');
        $this->db->join('employees', 'users.id = employees.user_id', 'left');
        $this->db->join('roles', 'users.role_id = roles.id');
        $this->db->where('users.password', $password);
        $this->db->where('users.username', $login);
        $this->db->or_where('users.email', $login);

        $query = $this->db->get();

        if ($query->num_rows() > 0) { // User/password are right!
            return $query->row_object();
        } else { // Wrong user/password
            $this->db->select('users.id');
            $this->db->from('users');
            $this->db->where('users.username', $login);
            $this->db->or_where('users.email', $login);

            $query = $this->db->get();

            if ($query->num_rows() > 0) { // Wrong password
                return 'password';
            } else { // Wrong user
                return 'login';
            }
        }
    }

}