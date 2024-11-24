<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Credit_card_model extends CI_Model {

    var $sale_id = '';
    var $verification_code = '';
    var $operation_code = '';
    var $amount = '';
    var $credit_card_type_id = '';

	public function __construct()
	{
		parent::__construct();
	}

    function save_all($sale_info) // Guarda varios registros de ventas
    {
        $data = $this->input->post('sales');

        if (count($data) === count($sale_info)) {
            foreach ($data as $sale_index => $sale) {
                if (isset($sale['credit_cards']) AND count($sale['credit_cards'])) {
                    foreach ($sale['credit_cards'] as $card_index => $card) {
                        $sale['credit_cards'][$card_index]['sale_id'] = $sale_info[$sale_index]->id;
                    }

                    if (!$this->db->insert_batch('credit_cards', $sale['credit_cards'])) {
                        return FALSE;
                    }
                }
            }

            return TRUE;
        } else {
            return FALSE;
        }
    }

    function add_sale($sale_id)
    {
        $data = array();
        $securities = $this->input->post('card_security');
        $operations = $this->input->post('card_operation');
        $types = $this->input->post('card_type');
        $amounts = $this->input->post('card_amount');

        for ($i = 0; $i < count($securities); $i++) {
            array_push($data, array(
                'sale_id' => $sale_id,
                'verification_code' => $securities[$i],
                'operation_code' => $operations[$i],
                'amount' => $amounts[$i],
                'credit_card_type_id' => $types[$i]
            ));
        }

        if (count($data) < 1) {
            exit("NO HAY DATOS");
        }

        if ($this->db->insert_batch('credit_cards', $data)) {
            return TRUE;
        } else {
            return FALSE;
        }
    }
    function sumary($sale_point = NULL, $order = 'credit_card_types.abbrev ASC')
    {
 
        $this->db->select("credit_card_types.abbrev, SUM(amount) as total");
        $this->db->from('credit_cards');
        $this->db->join('credit_card_types', 'credit_cards.credit_card_type_id = credit_card_types.id', 'left');
        $this->db->join('sales', 'credit_cards.sale_id = sales.id', 'left');
       
        if (!is_null($sale_point)) {
           $this->db->where("sales.sale_point_id", $sale_point);
        }
        $this->db->where("sales.active", 't');
        $this->db->where("sales.state", 'SOLD');
        $this->db->group_by('credit_card_types.abbrev');
        $this->db->order_by($order);

        $query = $this->db->get();

        return $query->result_array();
    }

    public function get_by_sale($sale_id)
    {
        $this->db->select("
            credit_cards.id,
            credit_cards.operation_code,
            credit_cards.verification_code,
            credit_cards.amount,
            credit_cards.credit_card_type_id
        ");
        $this->db->from('credit_cards');

        $this->db->where('credit_cards.sale_id', $sale_id);

        $query = $this->db->get();

        return $query->result();
    }
    
}

/* End of file sales_model.php */
/* Location: ./application/models/sales_model.php */