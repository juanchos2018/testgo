<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class App_model extends MY_Model {

	public function __construct()
	{
		parent::__construct();
	}

    function riot_active_switch($target, $reference, $value)
    {
		$this->db->where('id', $reference);

        return $this->db->update($target, array('active' => $value));
    }

}
