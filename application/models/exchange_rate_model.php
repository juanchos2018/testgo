<?php

class Exchange_rate_model extends CI_Model
{
    var $updated_at = '';
    var $purchase_value = '';
    var $sale_value = '';
    var $money_abbrev = '';
    var $unit = '';

    function __construct()
    {
        parent::__construct();
    }

    function get_all()
    {
        $this->db->select('
            updated_at,
            purchase_value,
            sale_value,
            money_abbrev,
            unit
        ');

        $this->db->from('exchange_rates');
        $this->db->order_by('id');

        $query = $this->db->get();

        return $query->result_array();
    }

    function get($abbrev)
    {
        $this->db->select('
            updated_at,
            purchase_value,
            sale_value,
            money_abbrev,
            unit
        ');

        $this->db->from('exchange_rates');
        $this->db->where('money_abbrev', $abbrev);

        $query = $this->db->get();

        if ($query->num_rows()) {
            return $query->row_array();
        } else {
            return array();
        }
    }

    function update()
    {
        unset($this->updated_at);
        unset($this->money_abbrev);
        unset($this->unit);

        $this->purchase_value = $this->input->post('purchase_value');
        $this->sale_value = $this->input->post('sale_value');

        $abbrev = $this->input->post('money_abbrev');

        $this->db->update('exchange_rates', $this, array('money_abbrev' => $abbrev));

        if ($this->db->affected_rows()) {
            return TRUE;
        } else {
            return FALSE;
        }
    }
}
