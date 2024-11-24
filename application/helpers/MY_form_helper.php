<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

if ( ! function_exists('is_valid_date'))
{
	function is_valid_date($date) {
		$pattern =  '/^\d{2}\/\d{2}\/\d{4}$/';

		return preg_match($pattern, $date) === 1;
	}
}
