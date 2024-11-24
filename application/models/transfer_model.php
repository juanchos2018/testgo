<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Transfer_model extends CI_Model {

    var $code = ''; # varchar(10)
    var $transfer_date = ''; # date
    var $total_qty = ''; # integer
    var $branch_detail_origin_id = ''; # integer
    var $branch_detail_target_id = ''; # ingeger
    var $shuttle_reason_id = ''; # integer
    var $registered_by = ''; #i integer
    var $approved_state = ''; # approved_state_type 'PENDIENTE'

	public function __construct()
	{
		parent::__construct();
	}

   
    function next_id()
	{
        $this->db->select('last_value + increment_by AS result', FALSE);

        $query = $this->db->get('transfers_id_seq');

        if ($query->num_rows() > 0) {
            $data = $query->row();

            return $data->result;
        } else {
            return 1;
        }
	}

    function save()
    {
        $transfer = pg_json(array(
            'transfer_date' => $this->input->post('transfer_date'),
            'total_qty' => $this->input->post('total_qty'),
            'company_origin_id' => $this->input->post('company_origin_id'),
            'company_target_id' => $this->input->post('company_target_id'),
            'branch_origin_id' => $this->input->post('branch_origin_id'),// $this->session->userdata('user_branch'),
            'branch_target_id' => $this->input->post('branch_target_id'),
            'shuttle_reason_id' => $this->input->post('shuttle_reason_id'),
            'user_id' => $this->session->userdata('user_id')
        ));

        $transfer_details = pg_json($this->input->post('details'));
        $guides = pg_json($this->input->post('guides'));

        $query = $this->db->query("SELECT save_transfer($transfer, $transfer_details, $guides) AS result");

        if ($query->num_rows() > 0) {
            $row = $query->row();

            return $row->result;
        } else {
            return FALSE;
        }
    }

    function update($id)
    {
        $transfer_order = pg_json(array(
            'description' => $this->input->post('description'),
            'start_date' => $this->input->post('start_date'),
            'finish_date' => $this->input->post('finish_date'),
            'paid_date' => $this->input->post('paid_date'),
            'active' => $this->input->post('active'),
            'supplier_id' => $this->input->post('supplier_id'),
            'company_id' => $this->input->post('company_id'),
            'branch_id' => $this->session->userdata('user_branch')
        ));

        $details = array();

        foreach ($this->input->post('details') as $detail) {
            $detail['update'] = ($detail['update'] === 'true');

            $details[] = $detail;
        }

        $transfer_order_details = pg_json($details);

        $query = $this->db->query("SELECT update_transfer_order($id, $transfer_order, $transfer_order_details) AS result");

        if ($query->num_rows() > 0) {
            return $id;
        } else {
            return FALSE;
        }
    }

       function get_all($where = NULL)
    {
        $this->db->select('id, code, total_qty, transfer_date, registered_at, registered_by, company_origin_id, company_origin, branch_origin_id, branch_origin, company_target_id, company_target, branch_target_id, branch_target,shuttle_reason_id, reason, state, get_guides_by_transfer(id) AS guides', FALSE);

        if (!is_null($where)) {
            $this->db->where($where);
        }

        $this->db->order_by('registered_at DESC');
        $query = $this->db->get('v_transfers');

        return $query->result_array();
    }

    // Los métodos get_list son para los combos, tienen los campos id y text obligatoriamente
    function get_list($where = NULL)
    {
        $this->db->select('id, description AS text, code, active, finish_date, supplier_id, supplier, company_id, company, quantity, arrived_quantity');

        if (!is_null($where)) {
            $this->db->where($where);
        }

        $this->db->where('branch_id', $this->session->userdata('user_branch'));

        $this->db->order_by('registered_at DESC');
        $query = $this->db->get('v_transfers');

        return $query->result_array();
    }

    function get($id)
    {
        $this->db->select("
            tr.id,
            tr.code,
            tr.transfer_date,
            tr.approved_state,
            tr.shuttle_reason_id,
            tr.registered_at,
            tr.registered_by,
            bdo.company_id AS company_origin_id,
            bdt.company_id AS company_target_id
        ");

        $this->db->from('transfers tr');
        $this->db->join('branch_details bdo', 'tr.branch_detail_origin_id = bdo.id','left');
        $this->db->join('branch_details bdt', 'tr.branch_detail_target_id = bdt.id','left');
        $this->db->where('tr.id', $id);
        $this->db->where('bdo.branch_id', $this->session->userdata('user_branch'));

        $query = $this->db->get();

        if ($query->num_rows() === 1) {
            return $query->row_array();
        } else {
            return FALSE;
        }
    }

    function get_details($transfer_id)
    {
        // Agregar Stock actual?
        $this->db->select("
            id,
            product_id,
            code,
            size,
            quantity,
            product_detail_id,
            old_barcode,
            price,
            offer_price,
            description,
            brand,
            guide
        ", FALSE);
        $this->db->from('v_transfer_details');
        $this->db->where('transfer_id', $transfer_id);

        $query = $this->db->get();

        return $query->result_array();
    }

    function delete()
    {
        $id = $this->input->post('id');

        return $this->db->delete('transfers', array('id' => $id));
    }

    function data_for_transfer($id, $stock)
    {
        $this->db->select('
            products.code,
            size.description AS size,
            product_barcodes.old_barcode AS barcode,
            products.description,
            products.regime,
            brands.description AS brand,
            categories.description AS line,
            subcategories.description AS type,
            uses.description AS use,
            ages.description AS age,
            genders.description AS gender,
            products.output_statement
        ');

        $this->db->from('transfer_order_details');
        $this->db->join('product_details', 'transfer_order_details.product_detail_id = product_details.id');
        $this->db->join('product_barcodes', 'product_details.id = product_barcodes.product_detail_id', 'left');
        $this->db->join('products', 'product_details.product_id = products.id');
        $this->db->join('size', 'product_barcodes.size_id = size.id', 'left');
        $this->db->join('brands', 'products.brand_id = brands.id');
        $this->db->join('categories', 'products.category_id = categories.id', 'left');
        $this->db->join('subcategories', 'products.subcategory_id = subcategories.id', 'left');
        $this->db->join('uses', 'products.uses_id = uses.id', 'left');
        $this->db->join('ages', 'products.ages_id = ages.id', 'left');
        $this->db->join('genders', 'products.gender_id = genders.id', 'left');

        if ($stock) {
            $this->db->where('transfer_order_details.arrived_quantity < transfer_order_details.quantity', NULL, FALSE);
        }

        $this->db->where('transfer_order_details.transfer_order_id', $id);

        $this->db->order_by('products.description ASC, size.description ASC');

        $query = $this->db->get();

        return $query->result();
    }
	
	public function get_inventory($branch_detail_id, $start_date_or_period, $end_date)
    {
        // $target = 'branch'; // by company and branch
        $result = array();
        $page = intval($this->input->get('page'));
        $display = intval($this->input->get('display'));

        $this->db->select('COUNT(DISTINCT (product_details.product_id, guides.serie, transfers.transfer_date, transfers.branch_detail_origin_id, transfers.branch_detail_target_id)) AS total_count', FALSE);
        
        $this->_get_inventory($branch_detail_id, $start_date_or_period, $end_date);

        $query = $this->db->get();

        if ($query->num_rows() === 1) {
            $data = $query->row();
            
            $result['total_count'] = intval($data->total_count);
        } else {
            $result['total_count'] = 0;
        }

        if ($result['total_count'] > 0) {
            $this->db->select("
                product_details.product_id,
                guides.serie, transfers.transfer_date,
                SUM(transfer_details.quantity) AS quantity,
                transfers.branch_detail_origin_id, transfers.branch_detail_target_id
            ");

            $this->_get_inventory($branch_detail_id, $start_date_or_period, $end_date);
            
            $this->db->group_by('product_details.product_id, products.description, guides.serie, transfers.transfer_date, transfers.branch_detail_origin_id, transfers.branch_detail_target_id');
            $this->db->order_by('products.description', 'asc');
            $this->db->order_by('transfers.transfer_date', 'asc');

            $this->db->limit($display, ($page - 1) * $display);

            $query = $this->db->get();

            if ($query->num_rows()) {
                if ($page * $display < $result['total_count']) {
                    $result['next_page'] = $page + 1;
                }

                $result['items'] = $query->result_array();
                $result['page'] = $page;
            } else {
                $result['items'] = array();
            }
        } else {
            $result['items'] = array();
        }

        return $result;
    }

    private function _get_inventory($branch_detail_id, $start_date_or_period, $end_date)
    {
        $this->db->from('transfer_details');
        $this->db->join('product_barcodes', 'transfer_details.product_barcode_id = product_barcodes.id');
        $this->db->join('transfers', 'transfer_details.transfer_id = transfers.id');
        $this->db->join('product_details', 'product_barcodes.product_detail_id = product_details.id');
        $this->db->join('products', 'product_details.product_id = products.id');
        $this->db->join('guides', 'transfer_details.guide_id = guides.id');

        $this->db->where('transfers.approved_state', 'A. GERENCIA');
        $this->db->where("(transfers.branch_detail_origin_id = $branch_detail_id OR transfers.branch_detail_target_id = $branch_detail_id)");

        switch ($start_date_or_period) {
            case 'year':
                $this->db->where('EXTRACT(YEAR FROM transfers.transfer_date) =', $end_date);
                break;
            case 'month':
                list($year, $month) = explode('-', $end_date);

                $this->db->where('EXTRACT(MONTH FROM transfers.transfer_date) =', $month + 1);
                $this->db->where('EXTRACT(YEAR FROM transfers.transfer_date) =', $year);
                break;
            default:
                $this->db->where("transfers.transfer_date BETWEEN '$start_date_or_period'::DATE AND '$end_date'::DATE");
                break;
        }
    }
    
    function get_product_kardex($product_id, $target, $company_id, $period, $year_month)
    {
        if ($period === 'month') {
            list($year, $month) = explode('-', $year_month);
        } else {
            $year = $year_month;
            $month = NULL;
        }
        
        $branch_id = $this->session->userdata('user_branch');
        
        $this->db->trans_start();
        
        $this->db->select('id');
        
        $query = $this->db->get_where('branch_details', array(
            'company_id' => $company_id,
            'branch_id' => $branch_id
        ));
        
        $branch_detail_id = $query->num_rows() === 1 ? $query->row()->id : 0;
        
        $this->db->select("
            TO_CHAR(transfers.transfer_date, 'DD/MM/YYYY') AS date_text,
            EXTRACT(EPOCH FROM transfers.transfer_date AT TIME ZONE 'UTC')::INTEGER AS date_unix,
            SUM(transfer_details.quantity) AS quantity,
            guides.serie,
            CASE WHEN transfers.branch_detail_origin_id = $branch_detail_id THEN 'SENT' ELSE 'RECEIVED' END AS movement
        ", FALSE);
        
        $this->db->from('transfer_details');
        $this->db->join('product_barcodes', 'transfer_details.product_barcode_id = product_barcodes.id');
        $this->db->join('transfers', 'transfer_details.transfer_id = transfers.id');
        $this->db->join('product_details', 'product_barcodes.product_detail_id = product_details.id');
        $this->db->join('guides', 'transfer_details.guide_id = guides.id');

        $this->db->where('transfers.approved_state', 'A. GERENCIA');
        $this->db->where("(transfers.branch_detail_origin_id = $branch_detail_id OR transfers.branch_detail_target_id = $branch_detail_id)");
        $this->db->where('product_details.product_id', $product_id);
        $this->db->where('EXTRACT(YEAR FROM transfers.transfer_date) =', $year);
        
        if (!is_null($month)) {
            $this->db->where('EXTRACT(MONTH FROM transfers.transfer_date) =', $month);
        }
        
        $this->db->group_by(array('transfers.id', 'guides.id'));
        
        $this->db->order_by('transfers.transfer_date asc');
        
        $query = $this->db->get();
        
        $this->db->trans_complete();
        
        return $query->result_array();
    }
}
