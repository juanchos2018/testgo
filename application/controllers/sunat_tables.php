<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Sunat_tables extends MY_Controller {

	public function __construct()
	{
		parent::__construct();
		
		$this->load->model('sunat_table_model');
	}

	public function index()
	{
		$data = $this->sunat_table_model->get_all();

		$this->load->view('sunat_tables/index', compact('data'));
	}

	public function add()
	{
		$action = 'add';
		$codes = $this->sunat_table_model->get_codes();

		$this->load->view('sunat_tables/record', compact('action', 'codes'));
	}

	public function save()
	{
		if ($this->sunat_table_model->save()) {
			$this->json_output(array('ok' => TRUE));
		} else {
			$this->json_output(array('error' => TRUE));
		}
	}

	public function edit($id)
	{
		$action = 'edit';
		$codes = $this->sunat_table_model->get_codes($id);
		$data = $this->sunat_table_model->get($id);

		$this->load->view('sunat_tables/record', compact('action', 'codes', 'data'));
	}

	public function update($id)
	{
		if ($this->sunat_table_model->update($id)) {
			$this->json_output(array('ok' => TRUE));
		} else {
			$this->json_output(array('error' => TRUE));
		}
	}

	public function detail($id)
	{
		$action = 'detail';
		$codes = '[]';
		$data = $this->sunat_table_model->get($id);

		$this->load->view('sunat_tables/record', compact('action', 'codes', 'data'));
	}

	public function delete()
	{
		if ($this->input->is_post()) {
            if ($this->sunat_table_model->delete()) {
            	$this->json_output(array('ok' => TRUE));
            } else {
            	$this->json_output(array('error' => 'No se pudo eliminar el registro'));
            }
        } else {
            $this->json_output(array('error' => 'No se recibieron datos'));
        }
	}

}
