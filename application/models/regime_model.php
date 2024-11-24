<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Regime_model extends CI_Model
{
    var $regime = '';
    var $tax = '';

    function __construct()
    {
        parent::__construct();
    }

    function get($regime)
    {
        $this->db->select('
            regime.id,
            regime.regime,
            regime.tax
        ');

        $this->db->from('regime');
        $this->db->where('regime.regime', $regime);

        $query = $this->db->get();

        if ($query->num_rows() > 0) {
            return $query->row();
        } else {
            return FALSE;
        }
    }

    function get_list($where = NULL, $order = 'regime.id ASC')
    {
        $this->db->select('
            regime.id,
            regime.regime,
            regime.tax
        ');
        $this->db->from('regime');

        if (!is_null($where)) {
            $this->db->where($where);
        }

        if (!is_null($order)) {
            $this->db->order_by($order);
        }

        $query = $this->db->get();

        return $query->result_array();
    }

    function get_for_settings()
    {
        $this->db->select('regime, tax');

        $query = $this->db->get('regime');

        return $query->result_array();
    }
}
