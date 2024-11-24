<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Sale_point_model extends MY_Model {

	/*var $address = '';
	var $printer_serial = '';
	var $branch_detail_id = '';*/
    var $description = '';
	var $active = '';

	function __construct()
    {
        parent::__construct();
    }

    function id_by_addr($address, $branch_detail_id, $voucher = 'TICKET')
    {
    	$this->db->select('sale_points.id');
    	$this->db->from('sale_points');

    	if (!is_null($voucher)) {
    		$this->db->join('series', 'sale_points.id = series.sale_point_id');
    		$this->db->where('series.voucher', $voucher);
    	}

    	$this->db->where('sale_points.address', $address);
		$this->db->where('sale_points.branch_detail_id', $branch_detail_id);

		$query = $this->db->get();
		
		if ($query->num_rows() !== 1) {
			return 0;
		} else {
			$data = $query->row();

			return $data->id;
		}
    }

    function get($id) {
        $this->db->select('
            sale_points.id,
            sale_points.description,
            sale_points.active
        ');

        $this->db->from('sale_points');
        $this->db->where('sale_points.id', $id);

        $query = $this->db->get();

        if ($query->num_rows() > 0) {
            return $query->row_array();
        } else {
            return FALSE;
        }
    }

    function get_list($branch_id = NULL, $where = NULL)
    {
        if (is_null($branch_id)) {
            $branch_id = $this->session->userdata('user_branch');
        }
        
    	$this->db->select("
            sale_points.id,
    		sale_points.description,
            sale_points.active,
            sale_points.initial_amount,
            sale_points.last_closing_cash,
            STRING_AGG(companies.name, ', ') AS printers,
            (SELECT COUNT(*) FROM sales WHERE sales.sale_point_id = sale_points.id AND sales.closing_state = 'NINGUNO' AND sales.active = 't') AS count_after_closing
    	", FALSE);

        $this->db->from('sale_points');
        $this->db->join('series', 'sale_points.id = series.sale_point_id', 'left');
        $this->db->join('branch_details', 'series.branch_detail_id = branch_details.id', 'left');
        $this->db->join('companies', 'branch_details.company_id = companies.id', 'left');

        $this->db->where('branch_details.branch_id', $branch_id);

        if (is_null($where)) {
            $this->db->or_where('branch_details.branch_id IS NULL');
        } else {
            $this->db->where($where);
        }

        $this->db->group_by(array('series.sale_point_id', 'sale_points.id', 'sale_points.description'));
        $this->db->order_by('sale_points.description asc');
    	
        $query = $this->db->get();

		return $query->result_array();
    }

    function get_for_sale($branch_detail_id)
    {
    	$this->db->select('
			sale_points.address,
			sale_points.printer_serial,
		');

		$this->db->from('sale_points');

		//$this->db->where('sale_points.address', $address);
		$this->db->where('sale_points.branch_detail_id', $branch_detail_id);

		$this->db->limit(1);

		$query = $this->db->get();
		
		if ($query->num_rows() === 0) {
			return FALSE;
		} else {
			return $query->row_array();
		}
    }

    function save()
    {
        $this->description = $this->input->post('description');
        $this->active = $this->input->post('active');

        if ($this->db->insert('sale_points', $this)) {
            return $this->db->insert_id();
        } else {
            return FALSE;
        }
    }

    function update()
    {
        $id = $this->input->post('id');
        $this->description = $this->input->post('description');
        $this->active = $this->input->post('active');

        return $this->db->update('sale_points', $this, array('id' => $id));
    }

    /*
        update_settings() actualiza las opciones de punto de venta, como el monto en caja y
        el tipo de cambio
    */
    function update_settings($id)
    {
        $cash_amount = $this->input->post('cash_amount');

        if ($this->db->update('sale_points', array('initial_amount' => $cash_amount, 'cash_amount' => $cash_amount), array('id' => $id))) {
            $exchange_rates = array();

            foreach ($this->input->post('exchange_rates') as $er) {
                $exchange_rates[] = array(
                    'purchase_value' => $er['value'],
                    'money_abbrev' => $er['money']
                );
            }

            $this->db->update_batch('exchange_rates', $exchange_rates, 'money_abbrev');

            return TRUE;
        }

        return FALSE;
    }

    function activate()
    {
        $id = $this->input->post('id');
        $value = $this->input->post('active');

        $this->db->update('sale_points', array('active' => $value), array('id' => $id));

        return $this->db->affected_rows() > 0;
    }

    function delete()
    {
        $id = $this->input->post('id');

        if ($this->db->delete('sales', array('sale_point_id' => $id))) {
            return $this->db->delete('sale_points', array('id' => $id));
        } else {
            return FALSE;
        }
    }

    function change_state($sale_point_id, $company_id, $state, $date)
    {
        $this->db->update('sales',array('closing_state' => $state),array('sale_point_id' => $sale_point_id, 'company_id' => $company_id, 'DATE(sales.sale_date)' => $date));
    }
}