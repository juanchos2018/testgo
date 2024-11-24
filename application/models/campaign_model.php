<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Campaign_model extends MY_Model
{
	var $description = NULL;
	var $start_date = NULL;
	var $end_date = NULL;
	var $active = NULL;
	var $approved_state = NULL;
	var $rejected_by = NULL;
	var $marketing_user_id = NULL;
	var $accounting_user_id = NULL;
	var $start_time = NULL;
	var $end_time = NULL;
	
	function get($id)
	{
	    $this->db->select('
	        description,
	        start_date,
	        end_date,
	        active,
	        start_time,
	        end_time
	    ');

		$query = $this->db->get_where('campaigns', array('id' => $id));

		if ($query->num_rows() > 0) {
			return $query->row_array();
		} else {
			return array();
		}
	}

	function get_list($branch_id = NULL, $order_by = 'campaigns.description ASC')
    {
        if (is_null($branch_id)) {
            $branch_id = $this->session->userdata('user_branch');
        }

    	$this->db->select("
            campaigns.id,
    		campaigns.description,
            campaigns.active,
            campaigns.start_date,
            campaigns.end_date,
    	", FALSE);

        $this->db->from('campaigns');
        $this->db->join('campaign_places', 'campaigns.id = campaign_places.campaign_id', 'left');

        $this->db->where("campaign_places.branch_id IS NULL OR campaign_places.branch_id = $branch_id", NULL, FALSE);

		$this->db->order_by($order_by);

        $query = $this->db->get();

		return $query->result_array();
    }

    function get_next_id()
    {
        $this->db->select('last_value + increment_by AS result', FALSE);

        $query = $this->db->get('campaings_id_seq');

        if ($query->num_rows() > 0) {
            $data = $query->row();

            return $data->result;
        } else {
            return 1;
        }
    }
    
    function get_places($campaign_id)
    {
        $this->db->select('
	        branch_id
	    ');

		$query = $this->db->get_where('campaign_places', array('campaign_id' => $campaign_id));
		
		return $query->result_array();
    }

	function save()
	{
	    // http://stackoverflow.com/questions/20272650/how-to-loop-over-json-arrays-in-postgresql-9-3
	    $this->db->trans_start();
	    
	    $this->description = $this->input->post('description');
	    $this->start_date = $this->input->post('start_date');
	    $this->end_date = empty($this->input->post('end_date')) ? NULL : $this->input->post('end_date');
	    $this->active = $this->input->post('active');
	    $this->start_time = empty($this->input->post('start_time')) ? NULL : $this->input->post('start_time');
	    $this->end_time = empty($this->input->post('end_time')) ? NULL : $this->input->post('end_time');
	    $this->approved_state = 'PENDIENTE';
	    
	    if ($this->db->insert('campaigns', $this)) {
	        $campaign_id = $this->db->insert_id();
	        $branches = $this->input->post('branches');
	        $packs = $this->input->post('packs');
	        
	        if (is_array($branches)) {
	            $this->db->insert_batch('campaign_places', array_map(function ($branch_id) use ($campaign_id) {
	                return array(
	                    'campaign_id' => $campaign_id,
	                    'branch_id' => $branch_id
	                );
                }, $branches));
	        }
	        
	        if (is_array($packs)) {
	            $packs_param = pg_json(array_map(function ($pack) {
                    return array(
                        'active' => $pack['active'],
                        'company_id' => intval($pack['company_id']),
                        'description' => $pack['description'],
                        'id' => empty($pack['id']) ? NULL : intval($pack['id']),
                        'price' => floatval($pack['price']),
                        'regime' => $pack['regime'],
                        'lists' => array_map(function ($list) {
                            return array(
                                'id' => empty($list['id']) ? NULL : intval($list['id']),
                                'unit_price' => floatval($list['unit_price']),
                                'quantity' => intval($list['quantity']),
                                'product_details' => array_map('intval', $list['product_details'])
                            );
                        }, $pack['lists'])
                    );
                }, $packs));
                
                $this->db->query("SELECT save_packs($campaign_id, $packs_param);");
	        }
	    }
	    
        $error_message = $this->db->_error_message();
	    $this->db->trans_complete();
        
        if (empty($error_message)) {
            return TRUE;
        } else {
            return $error_message;
        }
	}

	function activate()
    {
        $id = $this->input->post('id');
        $value = $this->input->post('active');

        $this->db->update('campaigns', array('active' => $value), array('id' => $id));

        return $this->db->affected_rows() > 0;
    }

    function delete()
    {
        $id = $this->input->post('id');

        return $this->db->delete('campaigns', array('id' => $id));
    }

    function get_available($branch_id = NULL) {
        if (is_null($branch_id)) {
            $branch_id = $this->session->userdata('user_branch');
        }
        
        $this->db->select('
            id,
            description,
            start_date,
            end_date
        ');

        $this->db->from('v_available_campaigns campaigns');
        $this->db->where("(campaigns.branches IS NULL OR $branch_id = ANY(campaigns.branches))", NULL, FALSE);
        $this->db->order_by('start_date DESC');

        $query = $this->db->get();

        return $query->result_array();
    }
    
    function update($id)
	{
	    $this->db->trans_start();
	    
	    $this->description = $this->input->post('description');
	    $this->start_date = $this->input->post('start_date');
	    $this->end_date = empty($this->input->post('end_date')) ? NULL : $this->input->post('end_date');
	    $this->active = $this->input->post('active');
	    $this->start_time = empty($this->input->post('start_time')) ? NULL : $this->input->post('start_time');
	    $this->end_time = empty($this->input->post('end_time')) ? NULL : $this->input->post('end_time');
	    $this->approved_state = 'PENDIENTE';
	    
	    if ($this->db->update('campaigns', $this, array('id' => $id))) {
	        $branches = $this->input->post('branches');
	        $packs = $this->input->post('packs');
	        
	        $this->db->delete('campaign_places', array('campaign_id' => $id));
	        
	        if (is_array($branches)) {
	            $this->db->insert_batch('campaign_places', array_map(function ($branch_id) use ($id) {
	                return array(
	                    'campaign_id' => $id,
	                    'branch_id' => $branch_id
	                );
                }, $branches));
	        }
	        
	        if (is_array($packs)) {
	            $pack_ids = array();
	            $list_ids = array();
	            
	            $packs_param = pg_json(array_map(function ($pack) use (&$pack_ids, &$list_ids) {
	                if (empty($pack['id'])) {
	                    $pack_id = NULL;
	                } else {
	                    $pack_id = intval($pack['id']);
	                    $pack_ids[] = $pack_id;
	                }
	                
                    return array(
                        'active' => $pack['active'],
                        'company_id' => intval($pack['company_id']),
                        'description' => $pack['description'],
                        'id' => $pack_id,
                        'price' => floatval($pack['price']),
                        'regime' => $pack['regime'],
                        'lists' => array_map(function ($list) use (&$list_ids) {
                            if (empty($list['id'])) {
                                $list_id = null;
                            } else {
                                $list_id = intval($list['id']);
                                $list_ids[] = $list_id;
                            }
                            
                            return array(
                                'id' => $list_id,
                                'unit_price' => floatval($list['unit_price']),
                                'quantity' => intval($list['quantity']),
                                'product_details' => array_map('intval', $list['product_details'])
                            );
                        }, $pack['lists'])
                    );
                }, $packs));
                
                if (count($pack_ids) > 0) {
                    $this->db->where('campaign_id', $id);
                    $this->db->where('(id NOT IN (' . implode(',', $pack_ids) . '))', NULL, FALSE);
                    
                    $this->db->delete('packs');
                    
                    if (count($list_ids) > 0) {
                        $this->db->where('(pack_id IN (' . implode(',', $pack_ids) . '))', NULL, FALSE);
                        $this->db->where('(id NOT IN (' . implode(',', $list_ids) . '))', NULL, FALSE);
                        
                        $this->db->delete('pack_lists');
                    } else {
                        $this->db->where('(pack_id IN (' . implode(',', $pack_ids) . '))', NULL, FALSE);
                        $this->db->delete('pack_lists');
                    }
                } else {
                    $this->db->delete('packs', array('campaign_id' => $id));
                }
                
                $this->db->query("SELECT save_packs($id, $packs_param);");
	        } else {
	            $this->db->delete('packs', array('campaign_id' => $id));
	        }
	    }
	    
        $error_message = $this->db->_error_message();
	    $this->db->trans_complete();
        
        if (empty($error_message)) {
            return TRUE;
        } else {
            return $error_message;
        }
	}

}
