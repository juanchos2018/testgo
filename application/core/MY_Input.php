<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class MY_Input extends CI_Input
{
	public function is_post()
	{
		return !empty($_POST);
	}

	public function is_get()
	{
		return !empty($_GET);
	}
}
