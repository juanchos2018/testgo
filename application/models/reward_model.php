<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Reward_model extends MY_Model {

    var $description = '';
    var $abbrev = '';
    var $earn_points = 0;
    var $min_points = 0;
    var $points_to_voucher = 0;
    var $voucher_amount = 0;
    var $voucher_birthday = 0;
    var $company_id = 0;
    var $active = '';
    
    function __construct()
    {
        parent::__construct();
    }

    function get_all($active = 't')
    {
        $this->db->select('
            rewards.id,
            description,
            abbrev,
            earn_points,
            min_points,
            points_to_voucher,
            voucher_amount,
            voucher_birthday,
            companies.name as company
        ');

        $this->db->where('rewards.active', $active);
        $this->db->join('companies', 'rewards.company_id = companies.id');
        $query = $this->db->get('rewards');


        if ($query->num_rows() > 0) {
            return $query->result();
        } else {
            return FALSE;
        }
    }

}

/* End of file reward_model.php */
/* Location: ./application/models/reward_model.php */