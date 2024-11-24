<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class App extends MY_Controller {

	public function __construct()
	{
		$this->allowed_uris = array('/app/manifest');

		parent::__construct();
	}

	/*
		riot_active_switch para componente RiotJS riot-active-switch
	*/
	public function riot_active_switch($target, $reference, $value)
	{
		$this->load->model('app_model');
		if ($this->app_model->riot_active_switch($target, $reference, $value)) {
			$this->json_output(array('ok' => TRUE));
		} else {
			$this->json_output(array('error' => TRUE));
		}
	}

	public function manifest()
	{
		$uri = getenv('BASE_URI');
		$manifest = array(
			'name' => 'Go!',
			'description' => 'Sistema ERP',
			'launch_path' => $uri,
			'developer' => array(
				'name' => 'S&E Soluciones Empresariales'
			),
			'icons' => array(
				'128' => $uri . 'public/images/icons/icon-128.png'
			),
			'default_locale' => 'es'
		);

		$this->output
		->set_content_type('application/x-web-app-manifest+json')
		->set_output(json_encode($manifest));
	}

}
