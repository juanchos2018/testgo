<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class MY_Form_validation extends CI_Form_validation
{
    public function __construct($config = array())
    {
        parent::__construct($config);
    }

    public function error_array()
	{
		return $this->_error_array;
	}

    function is_date($date)
    {
        if (preg_match("/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/", $date) === 1) {
            return TRUE;
        } else {
            return FALSE;
        }
    }
}
