<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Purchase_model extends CI_Model {

    var $code = ''; # varchar(10)
	var $description = ''; #varchar(80)
	var $input_date = ''; #timestamp
	var $amount = ''; #real
	var $igv = ''; #real
	var $company_id = ''; #integer
	var $supplier_id = ''; #integer
	var $state = ''; #state_type ?

	function __construct()
    {
        parent::__construct();
    }

	function next_id()
	{
		$this->db->select('last_value + increment_by AS result', FALSE);

        $query = $this->db->get('purchases_id_seq');

        if ($query->num_rows() > 0) {
            $data = $query->row();

            return $data->result;
        } else {
            return 1;
        }
	}

    function get_all($where = NULL)
    {
        $this->db->select('id, code, supplier, company, date, registered_at, quantity , total_cost , total_value, purchase_order_id, purchase_order, get_invoice_by_purchase(id) AS invoices', FALSE);

        if (!is_null($where)) {
            $this->db->where($where);
        }

        $this->db->order_by('date DESC');
        $query = $this->db->get('v_purchases');

        return $query->result_array();
    }

    function get($id)
    {
        $this->db->select("
            pu.id,
            pu.code,
            CASE pu.purchase_order_id WHEN NULL THEN pu.supplier_id
            ELSE po.supplier_id
            END AS supplier_id,
            pu.registered_at,
            bd.company_id
        ",FALSE);

        $this->db->from('purchases pu');
        $this->db->join('branch_details bd', 'pu.branch_detail_id = bd.id');
        $this->db->join('purchase_orders po', 'pu.purchase_order_id = po.id', 'left');
        $this->db->where('pu.id', $id);
        $this->db->where('bd.branch_id', $this->session->userdata('user_branch'));

        $query = $this->db->get();

        if ($query->num_rows() === 1) {
            return $query->row_array();
        } else {
            return FALSE;
        }
    }

    function get_details($purchase_id)
    {
        $branch_id = $this->session->userdata('user_branch');

        $this->db->select("
            id,
            product_id,
            code,
            size,
            quantity,
            get_stock_by_detail(product_detail_id, $branch_id) AS store_stock,
            product_detail_id,
            cost,
            cost_currency,
            old_barcode,
            invoice_cost,
            invoice_currency,
            price,
            offer_price,
            description,
            category,
            gender,
            age,
            use,
            brand,
            subcategory,
            regime,
            output_statement,
            invoice_number,
            invoice_date
        ", FALSE);
        $this->db->from('v_purchase_details');
        $this->db->where('purchase_id', $purchase_id);

        $query = $this->db->get();

        return $query->result_array();
    }

	function save()
    {
        $purchase = pg_json(array(
            'input_date' => $this->input->post('input_date'),
            'amount' => $this->input->post('amount'),
            'igv' => $this->input->post('igv'),
            'automatic_prices' => $this->input->post('automatic_prices'),
            'supplier_id' => $this->input->post('supplier_id'),
            'company_id' => $this->input->post('company_id'),
            'purchase_order_id' => $this->input->post('purchase_order_id'),
            'utility' => $this->input->post('utility'),
            'currency' => $this->input->post('currency'),
            'expenses' => $this->input->post('expenses'),
            'branch_id' => $this->session->userdata('user_branch'),
            'user_id' => $this->session->userdata('user_id'),
            'consigned' => $this->input->post('consigned'),
            'exchange_rate' => $this->input->post('exchange_rate')
        ));

        $purchase_details = pg_json($this->input->post('details'));
        $invoices = pg_json($this->input->post('invoices'));
        $product_details = pg_json($this->input->post('product_details'));

        $query = $this->db->query("SELECT save_purchase($purchase, $purchase_details, $invoices, $product_details) AS result");

        if ($query->num_rows() > 0) {
            $row = $query->row();

            return $row->result;
        } else {
            return FALSE;
        }
    }

    public function get_inventory($target, $company_or_branch_detail, $start_date_or_period, $end_date)
    {
        $result = array();
        $page = intval($this->input->get('page'));
        $display = intval($this->input->get('display'));

        $this->db->select('COUNT(DISTINCT (product_details.product_id, invoices.id)) AS total_count', FALSE);

        $this->_get_inventory($target, $company_or_branch_detail, $start_date_or_period, $end_date);

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
                invoices.serie, purchases.input_date,
                SUM(purchase_details.quantity) AS quantity
            ");

            $this->_get_inventory($target, $company_or_branch_detail, $start_date_or_period, $end_date);

            $this->db->group_by('product_details.product_id, products.description, invoices.serie, purchases.input_date'); 
            $this->db->order_by('products.description', 'asc');
            $this->db->order_by('purchases.input_date', 'asc');

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

    private function _get_inventory($target, $company_or_branch_detail, $start_date_or_period, $end_date)
    {
        $this->db->from('purchase_details');
        $this->db->join('product_barcodes', 'purchase_details.product_barcode_id = product_barcodes.id');
        $this->db->join('purchases', 'purchase_details.purchase_id = purchases.id');
        $this->db->join('product_details', 'product_barcodes.product_detail_id = product_details.id');
        $this->db->join('products', 'product_details.product_id = products.id');
        $this->db->join('invoices', 'purchase_details.invoice_id = invoices.id');

        $this->db->where('purchases.approved_state', 'A. GERENCIA');

        if ($target === 'branch') { // by company and branch
            $this->db->where('purchases.branch_detail_id', $company_or_branch_detail);
        } else { // by company, all branches
            $this->db->join('branch_details', 'purchases.branch_detail_id = branch_details.id');
            $this->db->where('branch_details.company_id', $company_or_branch_detail);
        }

        switch ($start_date_or_period) {
            case 'year':
                $this->db->where('EXTRACT(YEAR FROM purchases.input_date) =', $end_date);
                break;
            case 'month':
                list($year, $month) = explode('-', $end_date);

                $this->db->where('EXTRACT(MONTH FROM purchases.input_date) =', $month + 1);
                $this->db->where('EXTRACT(YEAR FROM purchases.input_date) =', $year);
                break;
            default:
                $this->db->where("purchases.input_date BETWEEN '$start_date_or_period'::DATE AND '$end_date'::DATE");
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
        
        $this->db->select("
            TO_CHAR(purchases.input_date, 'DD/MM/YYYY') AS date_text,
            EXTRACT(EPOCH FROM purchases.input_date AT TIME ZONE 'UTC')::INTEGER AS date_unix,
            SUM(purchase_details.quantity) AS quantity,
            invoices.serie
        ", FALSE);
        
        $this->db->from('purchase_details');
        $this->db->join('purchases', 'purchase_details.purchase_id = purchases.id');
        $this->db->join('product_barcodes', 'purchase_details.product_barcode_id = product_barcodes.id');
        $this->db->join('product_details', 'product_barcodes.product_detail_id = product_details.id');
        $this->db->join('branch_details', 'purchases.branch_detail_id = branch_details.id');
        $this->db->join('invoices', 'purchase_details.invoice_id = invoices.id');

		$this->db->where('purchases.approved_state', 'A. GERENCIA');
        $this->db->where('EXTRACT(YEAR FROM purchases.input_date) =', $year);
        $this->db->where('product_details.product_id', $product_id);
        $this->db->where('branch_details.company_id', $company_id);
        
        if (!is_null($month)) {
            $this->db->where('EXTRACT(MONTH FROM purchases.input_date) =', $month);
        }
		
		if ($target === 'branch') {
		    $this->db->where('branch_details.branch_id', $branch_id);
            $this->db->group_by(array('purchases.id', 'invoices.id'));
        } else {
            $this->db->select('branch_details.branch_id');
            $this->db->group_by(array('purchases.id', 'invoices.id', 'branch_details.branch_id'));
        }
        
        
        $this->db->order_by('purchases.input_date asc');
        
        $query = $this->db->get();
        
        return $query->result_array();
    }

}
