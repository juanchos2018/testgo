<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
//
class Campaigns extends MY_Controller {

	public function __construct()
	{
		parent::__construct();

		$this->load->model('campaign_model');
	}

	public function index()
	{
		$data['records'] = $this->campaign_model->get_list(NULL, 'campaigns.id DESC');

		$this->load->view('campaigns/index', $data);
	}

	public function add()
	{
		$action = 'add';
		$next_id = $this->campaign_model->get_next_id();

		$this->load->view('campaigns/detail', compact('action', 'next_id'));
	}

	public function detail($id)
	{
		$action = 'view';
		$campaign = $this->campaign_model->get($id);
		$branches = array_map(function ($place) {
			return '"' . $place['branch_id'] . '"';
		}, $this->campaign_model->get_places($id));
		
		if (count($campaign) > 0) {
			$this->load->model('pack_model');
			$packs = $this->pack_model->get_by_campaign($id);
			
			if (count($packs) > 0) {
				$pack_lists = $this->pack_model->get_lists(array_map(function ($pack) {
					return $pack['id'];
				}, $packs));
			} else {
				$pack_lists = array();
			}
			
			$this->load->view('campaigns/detail', compact('id', 'action', 'campaign', 'branches', 'packs', 'pack_lists'));
		}
	}

	public function edit($id)
	{
		$action = 'edit';
		$campaign = $this->campaign_model->get($id);
		$branches = array_map(function ($place) {
			return '"' . $place['branch_id'] . '"';
		}, $this->campaign_model->get_places($id));
		
		if (count($campaign) > 0) {
			$this->load->model('pack_model');
			$packs = $this->pack_model->get_by_campaign($id);
			
			if (count($packs) > 0) {
				$pack_lists = $this->pack_model->get_lists(array_map(function ($pack) {
					return $pack['id'];
				}, $packs));
			} else {
				$pack_lists = array();
			}
			
			$this->load->view('campaigns/detail', compact('id', 'action', 'campaign', 'branches', 'packs', 'pack_lists'));
		}
	}

	public function save()
	{
		$saved = $this->campaign_model->save();
		
		if ($saved) {
			$this->json_output(array('ok' => TRUE));
		} else {
			$this->json_output(array('error' => $saved));
		}
	}
	
	public function activate()
	{
		if ($this->input->is_post()) {
            if ($this->campaign_model->activate()) {
            	$this->json_output(array('ok' => TRUE));
            } else {
            	$this->json_output(array('error' => 'No se pudo actualizar el estado'));
            }
        } else {
            $this->json_output(array('error' => 'No se recibieron datos'));
        }
	}
	
	public function delete()
	{
		if ($this->input->is_post()) {
            if ($this->campaign_model->delete()) {
            	$this->json_output(array('ok' => TRUE));
            } else {
            	$this->json_output(array('error' => 'No se pudo eliminar el registro'));
            }
        } else {
            $this->json_output(array('error' => 'No se recibieron datos'));
        }
	}
	
	public function update($id)
	{
		$updated = $this->campaign_model->update($id);
		
		if ($updated) {
			$this->json_output(array('ok' => TRUE));
		} else {
			$this->json_output(array('error' => $updated));
		}
	}

}
