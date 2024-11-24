<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Testing_model extends CI_Model {

	public function __construct()
	{
		parent::__construct();
	}

    function customers()
    {
        try {
            $this->db->select("id_number, name || ' ' || last_name AS full_name", TRUE);
            $this->db->from('customers');
            $this->db->where('active', 't');
            $this->db->where('id < 100');

            $query = $this->db->get();

            if ($query->num_rows() > 0) {
                return $query->result();
            } else {
                return array();
            }
        } catch (Exception $e) {
            exit(var_dump($e->getMessage));
        }
    }

	function save_purchase()
    {
        $purchase = pg_json(array(
            'input_date' => $this->input->post('input_date'),
            'amount' => $this->input->post('amount'),
            'igv' => $this->input->post('igv'),
            'automatic_prices' => $this->input->post('automatic_prices'),
            'supplier_id' => $this->input->post('supplier_id'),
            'company_id' => $this->input->post('company_id'),
            'purchase_order_id' => $this->input->post('purchase_order_id'),
            'utility' => $this->input->post('utility'),
            'currency' => $this->input->post('currency'),
            'expenses' => $this->input->post('expenses'),
            'branch_id' => $this->session->userdata('user_branch'),
            'user_id' => $this->session->userdata('user_id')
        ));

        $purchase_details = pg_json($this->input->post('details'));
        $invoices = pg_json($this->input->post('invoices'));
        
        $query = $this->db->query("SELECT save_old_purchase($purchase, $purchase_details, $invoices) AS result");

        if ($query->num_rows() > 0) {
            $row = $query->row();

            return $row->result;
        } else {
            return FALSE;
        }
    }

    function save_transfer()
    {
        $transfer = pg_json(array(
            'transfer_date' => $this->input->post('transfer_date'),
            'total_qty' => $this->input->post('total_qty'),
            'company_origin_id' => $this->input->post('company_origin_id'),
            'company_target_id' => $this->input->post('company_target_id'),
            'branch_origin_id' => $this->input->post('branch_origin_id'),// $this->session->userdata('user_branch'),
            'branch_target_id' => $this->input->post('branch_target_id'),
            'shuttle_reason_id' => $this->input->post('shuttle_reason_id'),
            'user_id' => $this->session->userdata('user_id')
        ));

        $transfer_details = pg_json($this->input->post('details'));
        $guides = pg_json($this->input->post('guides'));

        $query = $this->db->query("SELECT save_old_transfer($transfer, $transfer_details, $guides) AS result");

        if($query->num_rows() > 0) {
            $row = $query->row();
            return $row->result;
        } else {
            return FALSE;
        }
    }

}
