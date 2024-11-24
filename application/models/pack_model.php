<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Pack_model extends MY_Model
{
	var $price = NULL;
	var $campaign_id = NULL;
    var $active = NULL;
    var $description = NULL;
    var $company_id = NULL;
    var $regime = NULL;

    public function get_available($branch_id = NULL)
    {
        if (is_null($branch_id)) {
            $branch_id = $this->session->userdata('user_branch');
        }
        
        $this->db->select('
            pack_lists.id,
            packs.id AS pack_id,
            packs.price,
            packs.campaign_id,
            packs.description,
            packs.company_id,
            packs.regime,
            pack_lists.unit_price,
            pack_lists.quantity,
            pack_lists.product_details
        ');

        $this->db->from('pack_lists');
        $this->db->join('packs', 'pack_lists.pack_id = packs.id');
        $this->db->join('v_available_campaigns campaigns', 'packs.campaign_id = campaigns.id');
        $this->db->where('packs.active', 't');
        $this->db->where("(campaigns.branches IS NULL OR $branch_id = ANY(campaigns.branches))", NULL, FALSE);
        $this->db->order_by('packs.campaign_id ASC, packs.price ASC, packs.id, packs.description');

        $query = $this->db->get();

        return $query->result_array();
    }
    
    public function get_by_campaign($campaign_id)
    {
        $this->db->select('
	        id,
	        price,
	        active,
	        description,
	        company_id,
	        regime
	    ');

		$query = $this->db->get_where('packs', array('campaign_id' => $campaign_id));

		return $query->result_array();
    }
    
    public function get_lists($pack_ids)
    {
        $this->db->select('
	        pack_lists.id,
	        pack_lists.unit_price AS price,
	        pack_lists.pack_id,
	        pack_lists.quantity
	    ');
	    
	    $this->db->select('
	        ARRAY_AGG(product_details.id) AS products,
	        ARRAY_AGG(products.code) AS codes
        ', FALSE);
	    
	    $this->db->from('pack_lists');
	    $this->db->join('product_details', 'product_details.id = ANY(pack_lists.product_details)');
	    $this->db->join('products', 'product_details.product_id = products.id');
	    
	    $this->db->where('pack_id IN (' . implode(',', $pack_ids) . ')', NULL, FALSE);
	    $this->db->group_by('pack_lists.id');

		$query = $this->db->get();

		return $query->result_array();
    }
}