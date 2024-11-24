<?php

class Branch_model extends CI_Model
{
    //var $company_id = '';
    var $address = '';
    var $alias = '';
    var $active = '';
    var $department = '';
    var $province = '';
    var $district = '';

    function __construct()
    {
        parent::__construct();
    }
    // LOs dos siguientes métodos son reemplazados por get_all_list()
    /*function get($id, $active = 't')
    {
        $this->db->select('
            branches.id,
            branches.address,
            branches.alias,
            branches.active,
            branches.department,
            branches.province,
            branches.district
        ');
        //    branches.company_id,

        $this->db->from('branches');
        $this->db->where('id', $id);
        $this->db->where('active', $active);

        $query = $this->db->get();

        return $query->row_array();
    }

    function get_all($order = 'alias ASC')
    {
        $this->db->select("
            branches.id,
            branches.company_id,
            branches.address,
            branches.alias,
            branches.active,
            branches.department,
            branches.province,
            branches.district
        ");

        $this->db->from('branches');

        if (!is_null($order)) {
            $this->db->order_by($order);
        }

        $query = $this->db->get();

        return $query->result_array();
    }*/

    function get_for_settings()
    {
        try {
            $this->db->select('
                branch_details.id AS branch_detail_id,
                branches.id AS branch_id,
                branches.address AS branch_address,
                branches.department AS branch_department,
                branches.province AS branch_province,
                branches.district AS branch_district,
                branches.alias AS branch_alias,
                companies.id AS company_id,
                companies.company_name AS company_business_name,
                companies.name AS company_name,
                companies.address AS company_address,
                companies.department AS company_department,
                companies.province AS company_province,
                companies.district AS company_district,
                companies.ruc AS company_ruc
            ');
            
            $this->db->from('branch_details');

            $this->db->join('branches', 'branch_details.branch_id = branches.id');
            $this->db->join('companies', 'branch_details.company_id = companies.id');

            $this->db->where('branches.active', 't');
            $this->db->where('companies.active', 't');

            $this->db->order_by('branches.alias');
            $this->db->order_by('companies.name');

            $query = $this->db->get();
            $data = array();

            if ($query->num_rows() > 0) {
                foreach ($query->result() as $row) {
                    if (!isset($data[$row->branch_alias])) {
                        $data[$row->branch_alias] = array(
                            'branch_id' => $row->branch_id,
                            'branch_address' => $row->branch_address,
                            'branch_department' => $row->branch_department,
                            'branch_province' => $row->branch_province,
                            'branch_district' => $row->branch_district,
                            'branch_alias' => $row->branch_alias,
                            'companies' => array()
                        );
                    }

                    $data[$row->branch_alias]['companies'][] = array(
                        'company_id' => $row->company_id,
                        'company_name' => $row->company_name,
                        'company_business_name' => $row->company_business_name,
                        'company_address' => $row->company_address,
                        'company_department' => $row->company_department,
                        'company_province' => $row->company_province,
                        'company_district' => $row->company_district,
                        'company_ruc' => $row->company_ruc,
                        'branch_detail_id' => $row->branch_detail_id
                    );
                }
            }
            
            return $data;
        } catch (Exception $e) {
            exit('Exception: ' . $e->getMessage());
        }
    }

    function get_list($where = NULL, $order = 'alias ASC')
    {
        $this->db->select('
            branches.id,
            branches.company_id,
            branches.address,
            branches.alias AS text
        ');
        $this->db->from('branches');

        if (!is_null($where)) {
            $this->db->where($where);
        }

        if (!is_null($order)) {
            $this->db->order_by($order);
        }

        $query = $this->db->get();

        return $query->result_array();
    }

    function get_for_sale($id)
    {
        $this->db->select("
            branches.address,
            branches.alias,
            branches.department,
            branches.province,
            branches.district
        ");

        $this->db->from('branches');
        $this->db->where('branches.id', $id);

        $query = $this->db->get();

        if ($query->num_rows() > 0) {
            return $query->row();
        } else {
            return FALSE;
        }
    }

    /*function get_for_sale($company_id)
    {
        $this->db->select('
            companies.company_name,
            companies.address,
            companies.department,
            companies.province,
            companies.district,
            companies.ruc
        ');

        $this->db->from('companies');

        $this->db->where('companies.id', $company_id);
        $this->db->where('companies.active', 't');

        $this->db->limit(1);

        $query = $this->db->get();

        if ($query->num_rows() === 0) {
            return FALSE;
        } else {
            return $query->row_array();
        }
    }*/
}
