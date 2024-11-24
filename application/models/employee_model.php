<?php

class Employee_model extends CI_Model
{
    var $name = '';
    var $last_name = '';
    var $user_id = '';
    var $code = '';

    function __construct()
    {
        parent::__construct();
    }

    function get_list($where = NULL, $order = 'employees.name ASC', $or_where = NULL) {
        $this->db->select("
            employees.id,
            employees.name || ' ' || employees.last_name AS text
        ");

        $this->db->from('employees');
        $this->db->join('users', 'employees.user_id = users.id', 'left');

        if (!is_null($where)) {
            $this->db->where($where);
        }

        if (!is_null($or_where)) {
            $this->db->or_where($or_where);
        }

        $this->db->order_by($order);

        $query = $this->db->get();

        return $query->result_array();
    }

    function get_salesman($where = NULL, $order = 'employees.name ASC', $or_where = NULL) { //se puede refactorizar 
        $this->db->select("
            employees.id,
            employees.name || ' ' || employees.last_name AS full_name,
            users.avatar,
            LPAD(employees.id::TEXT, 4, '0') AS code
        ", FALSE);

        $this->db->from('employees');
        $this->db->join('users', 'employees.user_id = users.id', 'left');
       
        if (!is_null($where)) {
            $this->db->where($where);
        }

        if (!is_null($or_where)) {
            $this->db->or_where($or_where);
        }

        $this->db->order_by($order);

        $query = $this->db->get();

        return $query->result_array();
    }
    
    function get($id)
    {
        $this->db->select("
            employees.id,
            employees.name || ' ' || employees.last_name AS full_name,
            users.avatar,
            LPAD(employees.id::TEXT, 4, '0') AS code
        ", FALSE);
        
        $this->db->from('employees');
        $this->db->join('users', 'employees.user_id = users.id', 'left');
        
        $this->db->where('employees.id', $id);
        
        $query = $this->db->get();
        
        if ($query->num_rows() === 1) {
            return $query->row_array();
        } else {
            return FALSE;
        }
    }

    function add() {
        $this->name = $this->input->post('name');
        $this->last_name = $this->input->post('last_name');
        $this->user_id = NULL;

        if ($this->db->insert('employees', $this)) {
            return $this->db->insert_id();
        } else {
            return FALSE;
        }
    }

    function get_summary_report()
    {
        $page = ($this->input->get('page') ? $this->input->get('page') : 1);
        $display = ($this->input->get('display') ? $this->input->get('display') : 10);
        $result = array('page' => $page);

        $this->db->select('COUNT(DISTINCT (employees.id)) AS numrows', FALSE);

        $this->_get_summary_report();

        $query = $this->db->get();

        if ($query->num_rows() === 1) {
            $result['total_count'] = intval($query->row()->numrows);
        } else {
            $result['total_count'] = 0;
        }

        if ($result['total_count'] > 0) {
            $this->__get_summary_report();
            $this->_get_summary_report();

            $this->db->limit($display, ($page - 1) * $display);

            $query = $this->db->get();

            if ($query->num_rows()) {
                $result['items'] = $query->result_array();
            } else {
                $result['items'] = array();
            }
        } else {
            $result['items'] = array();
        }

        return $result;
    }
    
    function get_all_summary_report()
    {
        $this->__get_summary_report();
        $this->_get_summary_report();
        
        $query = $this->db->get();
        
        return $query->result_array();
    }

    function _get_summary_report()
    {
        $branch_id = $this->session->userdata('user_branch');
        $start_date = $this->input->get('start_date');
        $end_date = $this->input->get('end_date');
        $company_id = $this->input->get('company_id');

        if ($start_date === 'year') {
            $date_cond = "EXTRACT(YEAR FROM sales.sale_date) = $end_date";
        } elseif($start_date === 'month') {
            list($year, $month) = explode('-', $end_date);

            $date_cond = "EXTRACT(YEAR FROM sales.sale_date) = $year AND EXTRACT(MONTH FROM sales.sale_date) = $month";
        } else {
            $date_cond = "sales.sale_date >= '$start_date' AND sales.sale_date < DATE '$end_date' + 1";
        }

        $this->db->from('sales');
        $this->db->join('employees', "sales.salesman_id = employees.id AND sales.branch_id = $branch_id AND $date_cond AND sales.active = TRUE AND sales.state <> 'CANCELED' AND sales.state <> 'REFUNDED' AND sales.voucher IN ('TICKET'::voucher_type, 'BOLETA'::voucher_type, 'FACTURA'::voucher_type) AND (sales.company_id IS NULL OR sales.company_id = '$company_id')", 'right');

        $this->db->where('employees.active', 't');
    }
    
    /*
        __get_summary_report ejecuta la consulta select y las condiciones de acuerdo a los parámetros recibidos
    */
    function __get_summary_report()
    {
        $this->db->select("
            employees.id,
            employees.name || ' ' || employees.last_name AS full_name,
            COUNT(sales.id) AS quantity,
            COALESCE(SUM(sales.total_amount), 0) AS amount
        ", FALSE);
        
        $this->db->group_by('employees.id');
        $this->db->order_by('quantity DESC, employees.name ASC');
        //$this->db->where('employees.active', 't');
    }

    function get_sale_report()
    {
        $page = ($this->input->get('page') ? $this->input->get('page') : 1);
        $start_date = $this->input->get('start_date');
        $end_date = $this->input->get('end_date');

        $result = array('page' => $page);

        $this->db->trans_start();
        
        $numdays = $this->get_sale_report_numdays($start_date, $end_date);

        $result['total_count'] = $numdays + 1;

        if ($result['total_count'] > 0) {
            $query = $this->_get_sale_report($start_date, $numdays);

            $result['items'] = $query->result_array();

        } else {
            $result['items'] = array();
        }

        $this->db->trans_complete();

        return $result;
    }
    
    function get_sale_report_numdays(&$start_date, $end_date)
    {
        if ($start_date === 'year') {
            $start_date = "$end_date-01-01";

            if (intval($end_date) % 4 === 0) { // Es año bisiesto
                $numdays = 365; // El rango inicia de cero
            } else {
                $numdays = 364; // El rango inicia de cero
            }
        } elseif($start_date === 'month') {
            list($year, $month) = explode('-', $end_date);

            if ($month == 4 OR $month == 6 OR $month == 9 OR $month == 11) {
                $numdays = 29;
            } else if ($month == 2) {
                $numdays = intval($year) % 4 === 0 ? 28 : 27;
            } else {
                $numdays = 30;
            }

            $start_date = "$year-$month-01";
        } else {
            $this->db->select("
                '$end_date'::DATE - '$start_date'::DATE AS numdays
            ", FALSE);

            $query = $this->db->get();

            if ($query->num_rows() === 1) {
                $numdays = intval($query->row()->numdays);
            } else {
                $numdays = -1;
            }
        }
        
        return $numdays;
    }
    
    function _get_sale_report($start_date, $numdays, $limit = TRUE)
    {
        $display = ($this->input->get('display') ? $this->input->get('display') : 10);
        $branch_id = $this->session->userdata('user_branch');
        $company_id = $this->input->get('company_id');
        $employee_id = $this->input->get('employee_id');
        
        $sql = "
            SELECT 
                range.date,
                COALESCE(SUM(sales.total_amount), 0) AS amount,
                COUNT(sales.id) AS quantity
            FROM 
                (SELECT '$start_date'::DATE + offs AS date FROM GENERATE_SERIES(0, $numdays, 1) AS offs) range
            LEFT OUTER JOIN 
                sales ON range.date = sales.sale_date::DATE
                AND sales.branch_id = '$branch_id'
                AND sales.voucher IN ('TICKET', 'BOLETA', 'FACTURA')
                AND sales.state = 'SOLD'
                AND sales.active = TRUE
                AND sales.salesman_id = '$employee_id'
                AND sales.company_id = '$company_id'
            GROUP BY 
                range.date
            ORDER BY 
                range.date ASC
        ";
        
        if ($limit) {
            $page = ($this->input->get('page') ? $this->input->get('page') : 1);
            $offset = ($page - 1) * $display;
            
            $sql .= " LIMIT $display OFFSET $offset;";
        }
        
        return $this->db->query($sql);
    }
    
    function get_all_sale_report()
    {
        $start_date = $this->input->get('start_date');
        $end_date = $this->input->get('end_date');

        $this->db->trans_start();
        
        $numdays = $this->get_sale_report_numdays($start_date, $end_date);

        if ($numdays >= 0) {
            $query = $this->_get_sale_report($start_date, $numdays, FALSE);

            $result = $query->result_array();

        } else {
            $result = array();
        }

        $this->db->trans_complete();

        return $result;
    }
}
