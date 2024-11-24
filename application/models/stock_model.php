<?php

class Stock_model extends CI_Model
{
    var $branch_id = '';
    var $product_barcode_id = '';
    var $store_stock = '';
    var $depot_stock = '';
    var $first_entry = '';
    var $last_entry = '';
    var $last_sale = '';

    function __construct()
    {
        parent::__construct();
    }

    ### MIGRADO
    function update_for_sale($branch_id, $products, $sizes, $quantities)
    {
        for ($i = 0; $i < count($products); $i++) {
            $this->db->select('product_barcodes.id');
            $this->db->from('product_barcodes');
            $this->db->join('product_details', 'product_barcodes.product_detail_id = product_details.id');
            $this->db->where('product_details.product_id', $products[$i]);
            $this->db->where('product_barcodes.size_id', $sizes[$i]);
            $query = $this->db->get();

            if ($query->num_rows() > 0) {
                $product_detail = $query->row();
                $product_detail_id = $product_detail->id;

                $this->db->select('stock.id');
                $this->db->from('stock');
                $this->db->where('stock.branch_id', $branch_id);
                $this->db->where('stock.product_barcode_id', $product_detail_id);
                $query = $this->db->get();

                if ($query->num_rows() > 0) {
                    $data = $query->row();

                    $this->db->simple_query("
                        UPDATE stock SET store_stock = store_stock - " . $quantities[$i] . " WHERE id = " . $data->id . "
                    ");
                }
            }
        }
    }

    ### MIGRADO
    function update_for_refund($branch_id, $product_details, $quantities)
    {
        $product_details = explode(',', $product_details);
        $quantities = explode(',', $quantities);

        for ($i = 0; $i < count($quantities); $i++) {
            $product_detail_id = $product_details[$i];
            $qty = $quantities[$i];

            $this->db->select('stock.id');
            $this->db->from('stock');
            $this->db->where('stock.branch_id', $branch_id);
            $this->db->where('stock.product_barcode_id', $product_detail_id);
            $query = $this->db->get();

            if ($query->num_rows() > 0) {
                $data = $query->row();

                $this->db->simple_query("
                    UPDATE stock SET store_stock = store_stock + " . $qty . " WHERE id = " . $data->id . "
                ");
            }
        }
    }

    ### MIGRADO
    function update($sign = '-', $branch_id = NULL)
    {
        if (is_null($branch_id)) {
            $branch_id = $this->session->userdata('user_branch');
        }

        $product_details = $this->input->post('product_detail');
        $quantities = $this->input->post('quantity');

        for ($i = 0; $i < count($quantities); $i++) {
            $product_detail_id = $product_details[$i];
            $qty = $quantities[$i];

            $this->db->select('stock.id');
            $this->db->from('stock');
            $this->db->where('stock.branch_id', $branch_id);
            $this->db->where('stock.product_barcode_id', $product_detail_id);
            $query = $this->db->get();

            if ($query->num_rows() > 0) {
                $data = $query->row();
                $sql = "UPDATE stock SET store_stock = store_stock $sign $qty WHERE id = {$data->id}";

                if (!$this->db->simple_query($sql)) {
                    return FALSE;
                }
            } else {
                return FALSE;
            }
        }

        return TRUE;
    }

    function get_sizes_for_product($product_id, $company_id)
    {
        $this->db->select("
            p.code, si.description AS size, s.store_stock AS stock
        ");
        $this->db->from('stock s');
        $this->db->join('product_barcodes pb', 's.product_barcode_id = pb.id');
        $this->db->join('product_details pd', 'pb.product_detail_id = pd.id');
        $this->db->join('size si', 'pb.size_id = si.id');
        $this->db->join('products p', 'pd.product_id = p.id');

        $this->db->where('p.id', $product_id);
        $this->db->where('pd.company_id', $company_id);
        $this->db->where('s.branch_id', $this->session->userdata('user_branch'));

        $query = $this->db->get();

        return $query->result_array();
    }

    function get_initial_stocks($target, $company_or_branch_detail, $start_date_or_period, $end_date)
    {
        $result = array();
        $page = intval($this->input->get('page'));
        $display = intval($this->input->get('display'));

        $this->db->select('COUNT(DISTINCT product_id) AS total_count');

        $this->_get_initial_stocks($target, $company_or_branch_detail, $start_date_or_period, $end_date);

        $query = $this->db->get();

        if ($query->num_rows() === 1) {
            $data = $query->row();

            $result['total_count'] = intval($data->total_count);
        } else {
            $result['total_count'] = 0;
        }

        if ($result['total_count'] > 0) {
            $this->db->select('product_id, SUM(store_stock) AS store_stock');
            
            $this->_get_initial_stocks($target, $company_or_branch_detail, $start_date_or_period, $end_date);

            $this->db->limit($display, ($page - 1) * $display);
            $this->db->group_by(array('product_id'));

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

    private function _get_initial_stocks($target, $company_or_branch_detail, $start_date_or_period, $end_date)
    {
        $this->db->from('initial_stocks');
        $this->db->where('store_stock > 0');

        if ($target === 'branch') { // by company and branch
            $this->db->where('branch_detail_id', $company_or_branch_detail);
        } else { // by company, all branches
            $this->db->join('branch_details', 'initial_stocks.branch_detail_id = branch_details.id');
            $this->db->where('branch_details.company_id', $company_or_branch_detail);
        }

        switch ($start_date_or_period) {
            case 'year':
                $this->db->where('year', $end_date);
                break;
            case 'month':
                list($year, $month) = explode('-', $end_date);

                $this->db->where('year', $year);
                break;
            default:
                list($year, $month, $day) = explode('-', $end_date);

                $this->db->where('year', $year);
        }
    }

    public function get_previous_sales($target, $company_id, $start_date_or_period, $end_date)
    {
        $result = array();
        $page = intval($this->input->get('page'));
        $display = intval($this->input->get('display'));

        $this->db->select('COUNT(DISTINCT product_details.product_id) AS total_count');

        $this->_get_previous_sales($target, $company_id, $start_date_or_period, $end_date);

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
                SUM(sale_details.quantity) AS quantity
            ");

            $this->_get_previous_sales($target, $company_id, $start_date_or_period, $end_date);

            $this->db->group_by(array('product_details.product_id'));
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

    private function _get_previous_sales($target, $company_id, $start_date_or_period, $end_date)
    {
        $this->db->from('sale_details');
        $this->db->join('sales', 'sale_details.sale_id = sales.id');
        $this->db->join('product_barcodes', 'sale_details.product_barcode_id = product_barcodes.id');
        $this->db->join('product_details', 'product_barcodes.product_detail_id = product_details.id');

        $this->db->where('sales.active', 't');
        $this->db->where('sales.state !=', 'CANCELED');
        $this->db->where('sales.company_id', $company_id);

        if ($target === 'branch') { // by company and branch
            $branch_id = $this->session->userdata('user_branch');
            
            $this->db->where('sales.branch_id', $branch_id);
        }

        switch ($start_date_or_period) {
            case 'month':
                list($year, $month) = explode('-', $end_date);

                $this->db->where('EXTRACT(MONTH FROM sales.sale_date) <=', $month); // $month + 1 es el mes elegido
                $this->db->where('EXTRACT(YEAR FROM sales.sale_date) =', $year);
                break;
            default:
                $this->db->where("sales.sale_date < '$start_date_or_period'::TIMESTAMP");
                break;
        }

        $this->db->where('sales.voucher::TEXT', "ANY(VALUES ('TICKET'), ('BOLETA'), ('FACTURA'))", FALSE);
    }

    public function get_previous_refunds($target, $company_id, $start_date_or_period, $end_date)
    {
        $result = array();
        $page = intval($this->input->get('page'));
        $display = intval($this->input->get('display'));

        $this->db->select('COUNT(DISTINCT product_details.product_id) AS total_count');

        $this->_get_previous_refunds($target, $company_id, $start_date_or_period, $end_date);

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
                SUM(sale_details.quantity) AS quantity
            ");

            $this->_get_previous_refunds($target, $company_id, $start_date_or_period, $end_date);

            $this->db->group_by(array('product_details.product_id'));
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

    private function _get_previous_refunds($target, $company_id, $start_date_or_period, $end_date)
    {
        $this->db->from('sale_details');
        $this->db->join('sales', 'sale_details.sale_id = sales.id');
        $this->db->join('product_barcodes', 'sale_details.product_barcode_id = product_barcodes.id');
        $this->db->join('product_details', 'product_barcodes.product_detail_id = product_details.id');

        $this->db->where('sales.active', 't');
        $this->db->where('sales.state !=', 'CANCELED');
        $this->db->where('sales.company_id', $company_id);
        
        if ($target === 'branch') { // by company and branch
            $branch_id = $this->session->userdata('user_branch');
            
            $this->db->where('sales.company_id', $company_id);
            $this->db->where('sales.branch_id', $branch_id);
        }

        switch ($start_date_or_period) {
            case 'month':
                list($year, $month) = explode('-', $end_date);

                $this->db->where('EXTRACT(MONTH FROM sales.sale_date) <=', $month); // $month + 1 es el mes elegido
                $this->db->where('EXTRACT(YEAR FROM sales.sale_date) =', $year);
                break;
            default:
                $this->db->where("sales.sale_date < '$start_date_or_period'::TIMESTAMP");
                break;
        }

        $this->db->where('sales.voucher::TEXT', "ANY(VALUES ('NOTA DE CREDITO'), ('TICKET NOTA DE CREDITO'))", FALSE);
    }

    public function get_previous_purchases($target, $company_or_branch_detail, $start_date_or_period, $end_date)
    {
        $result = array();
        $page = intval($this->input->get('page'));
        $display = intval($this->input->get('display'));

        $this->db->select('COUNT(DISTINCT product_details.product_id) AS total_count');

        $this->_get_previous_purchases($target, $company_or_branch_detail, $start_date_or_period, $end_date);

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
                SUM(purchase_details.quantity) AS quantity
            ");

            $this->_get_previous_purchases($target, $company_or_branch_detail, $start_date_or_period, $end_date);

            $this->db->group_by(array('product_details.product_id'));
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

    private function _get_previous_purchases($target, $company_or_branch_detail, $start_date_or_period, $end_date)
    {
        $this->db->from('purchase_details');
        $this->db->join('purchases', 'purchase_details.purchase_id = purchases.id');
        $this->db->join('product_barcodes', 'purchase_details.product_barcode_id = product_barcodes.id');
        $this->db->join('product_details', 'product_barcodes.product_detail_id = product_details.id');

        $this->db->where('purchases.approved_state', 'A. GERENCIA');

        if ($target === 'branch') { // by company and branch
            $this->db->where('purchases.branch_detail_id', $company_or_branch_detail);
        } else { // by company, all branches
            $this->db->join('branch_details', 'purchases.branch_detail_id = branch_details.id');
            $this->db->where('branch_details.company_id', $company_or_branch_detail);
        }

        switch ($start_date_or_period) {
            case 'month':
                list($year, $month) = explode('-', $end_date);

                $this->db->where('EXTRACT(MONTH FROM purchases.input_date) <=', $month); // $month + 1 es el mes elegido
                $this->db->where('EXTRACT(YEAR FROM purchases.input_date) =', $year);
                break;
            default:
                $this->db->where("purchases.input_date < '$start_date_or_period'::DATE");
                break;
        }
    }

    public function get_previous_transfers_received($branch_detail_id, $start_date_or_period, $end_date)
    {
        $result = array();
        $page = intval($this->input->get('page'));
        $display = intval($this->input->get('display'));

        $this->db->select('COUNT(DISTINCT product_details.product_id) AS total_count');

        $this->_get_previous_transfers_received($branch_detail_id, $start_date_or_period, $end_date);

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
                SUM(transfer_details.quantity) AS quantity
            ");

            $this->_get_previous_transfers_received($branch_detail_id, $start_date_or_period, $end_date);

            $this->db->group_by(array('product_details.product_id'));
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

    private function _get_previous_transfers_received($branch_detail_id, $start_date_or_period, $end_date)
    {
        $this->db->from('transfer_details');
        $this->db->join('transfers', 'transfer_details.transfer_id = transfers.id');
        $this->db->join('product_barcodes', 'transfer_details.product_barcode_id = product_barcodes.id');
        $this->db->join('product_details', 'product_barcodes.product_detail_id = product_details.id');

        $this->db->where('transfers.approved_state', 'A. GERENCIA');
        $this->db->where('transfers.branch_detail_target_id', $branch_detail_id);

        switch ($start_date_or_period) {
            case 'month':
                list($year, $month) = explode('-', $end_date);

                $this->db->where('EXTRACT(MONTH FROM transfers.transfer_date) <=', $month); // $month + 1 es el mes elegido
                $this->db->where('EXTRACT(YEAR FROM transfers.transfer_date) =', $year);
                break;
            default:
                $this->db->where("transfers.transfer_date < '$start_date_or_period'::DATE");
                break;
        }
    }

    public function get_previous_transfers_sent($branch_detail_id, $start_date_or_period, $end_date)
    {
        $result = array();
        $page = intval($this->input->get('page'));
        $display = intval($this->input->get('display'));

        $this->db->select('COUNT(DISTINCT product_details.product_id) AS total_count');

        $this->_get_previous_transfers_sent($branch_detail_id, $start_date_or_period, $end_date);

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
                SUM(transfer_details.quantity) AS quantity
            ");

            $this->_get_previous_transfers_sent($branch_detail_id, $start_date_or_period, $end_date);

            $this->db->group_by(array('product_details.product_id'));
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

    private function _get_previous_transfers_sent($branch_detail_id, $start_date_or_period, $end_date)
    {
        $this->db->from('transfer_details');
        $this->db->join('transfers', 'transfer_details.transfer_id = transfers.id');
        $this->db->join('product_barcodes', 'transfer_details.product_barcode_id = product_barcodes.id');
        $this->db->join('product_details', 'product_barcodes.product_detail_id = product_details.id');

        $this->db->where('transfers.approved_state', 'A. GERENCIA');
        $this->db->where('transfers.branch_detail_origin_id', $branch_detail_id);

        switch ($start_date_or_period) {
            case 'month':
                list($year, $month) = explode('-', $end_date);

                $this->db->where('EXTRACT(MONTH FROM transfers.transfer_date) <=', $month); // $month + 1 es el mes elegido
                $this->db->where('EXTRACT(YEAR FROM transfers.transfer_date) =', $year);
                break;
            default:
                $this->db->where("transfers.transfer_date < '$start_date_or_period'::DATE");
                break;
        }
    }

    public function get_products()
    {
        $ids = $this->input->post('products');
        
        $this->db->select('products.id, products.code, products.description');
        $this->db->where('products.id IN', '(' . implode($ids, ',') . ')', FALSE);
        $this->db->order_by('products.description asc');

        $query = $this->db->get('products');

        return $query->result_array();
    }

    function get_kardex_initial_stock($product_id, $target, $company_id, $period, $year_month)
    {
        if ($period === 'month') {
            list($year, $month) = explode('-', $year_month);
        } else {
            $year = $year_month;
            $month = NULL;
        }
        
        $branch_id = $this->session->userdata('user_branch');
        
        $this->db->trans_start();
        
        // Stock inicial
        
        $this->db->from('initial_stocks');
        $this->db->join('branch_details', 'initial_stocks.branch_detail_id = branch_details.id');
        
        $this->db->where('initial_stocks.product_id', $product_id);
        $this->db->where('initial_stocks.year', $year);
        
        $this->db->where('branch_details.company_id', $company_id);
        
        if ($target === 'company') {
            $this->db->select('COALESCE(SUM(initial_stocks.store_stock), 0) AS store_stock', FALSE);
            
            //$this->db->where('branch_details.branch_id', $branch_id);
        } else {
            $this->db->select('COALESCE(SUM(initial_stocks.store_stock), 0) AS store_stock', FALSE);
            
            $this->db->where('branch_details.branch_id', $branch_id);
        }

        $query = $this->db->get();
        
        $initial_stock = $query->num_rows() === 1 ? intval($query->row()->store_stock) : 0;
        
        if (!is_null($month) AND $month > 1) { // Si es mensual y a partir de Febrero, se debe sumar las operaciones previas
            // Ventas y devoluciones
            
            $this->db->select("
                SUM(Sale_details.quantity) AS quantity,
                CASE WHEN sales.voucher::TEXT = ANY(VALUES ('TICKET'), ('BOLETA'), ('FACTURA')) THEN 'OUT' ELSE 'IN' END AS movement
            ", FALSE);
            
            $this->db->from('sale_details');
            $this->db->join('sales', 'sale_details.sale_id = sales.id');
            $this->db->join('product_barcodes', 'sale_details.product_barcode_id = product_barcodes.id');
            $this->db->join('product_details', 'product_barcodes.product_detail_id = product_details.id');
            
            $this->db->where('sales.active', 't');
            $this->db->where('sales.state !=', 'CANCELED');
            //$this->db->where('sales.voucher::TEXT', "ANY(VALUES ('TICKET'), ('BOLETA'), ('FACTURA'))", FALSE);
            $this->db->where('EXTRACT(YEAR FROM sales.sale_date) =', $year);
            $this->db->where('EXTRACT(MONTH FROM sales.sale_date) <', $month);
            $this->db->where('product_details.product_id', $product_id);
            
            $this->db->where('sales.company_id', $company_id);
            
            if ($target === 'branch') {
                $this->db->where('sales.branch_id', $branch_id);
            }
            
            $this->db->group_by('movement');
            
            $query = $this->db->get();
            
            if ($query->num_rows() < 3) {
                foreach ($query->result_array() as $row) {
                    if ($row['movement'] === 'IN') {
                        $initial_stock += intval($row['quantity']);
                    } else {
                        $initial_stock -= intval($row['quantity']);
                    }
                }
            }
            
            // Compras
            
            $this->db->select("
                SUM(purchase_details.quantity) AS quantity
            ", FALSE);
            
            $this->db->from('purchase_details');
            $this->db->join('purchases', 'purchase_details.purchase_id = purchases.id');
            $this->db->join('product_barcodes', 'purchase_details.product_barcode_id = product_barcodes.id');
            $this->db->join('product_details', 'product_barcodes.product_detail_id = product_details.id');
            $this->db->join('branch_details', 'purchases.branch_detail_id = branch_details.id');
    
    		$this->db->where('purchases.approved_state', 'A. GERENCIA');
            $this->db->where('EXTRACT(YEAR FROM purchases.input_date) =', $year);
            $this->db->where('EXTRACT(MONTH FROM purchases.input_date) <', $month);
            $this->db->where('product_details.product_id', $product_id);
            $this->db->where('branch_details.company_id', $company_id);
    		
    		if ($target === 'branch') {
    		    $this->db->where('branch_details.branch_id', $branch_id);
            }
            
            $this->db->group_by('product_details.product_id');
            
            $query = $this->db->get();
            
            if ($query->num_rows() === 1) {
                $initial_stock += intval($query->row()->quantity);
            }
            
            if ($target === 'branch') {
                // Traslados recibidos
                
                $this->db->select("
                    SUM(transfer_details.quantity) AS quantity
                ", FALSE);
                
                $this->db->from('transfer_details');
                $this->db->join('transfers', 'transfer_details.transfer_id = transfers.id');
                $this->db->join('product_barcodes', 'transfer_details.product_barcode_id = product_barcodes.id');
                $this->db->join('product_details', 'product_barcodes.product_detail_id = product_details.id');
                $this->db->join('branch_details', 'transfers.branch_detail_target_id = branch_details.id');
        
        		$this->db->where('transfers.approved_state', 'A. GERENCIA');
                $this->db->where('EXTRACT(YEAR FROM transfers.transfer_date) =', $year);
                $this->db->where('EXTRACT(MONTH FROM transfers.transfer_date) <', $month);
                $this->db->where('product_details.product_id', $product_id);
                $this->db->where('branch_details.company_id', $company_id);
        	    $this->db->where('branch_details.branch_id', $branch_id);
        		
                $this->db->group_by('product_details.product_id');
                
                $query = $this->db->get();
                
                if ($query->num_rows() === 1) {
                    $initial_stock += intval($query->row()->quantity);
                }
                
                // Traslados enviados
                
                $this->db->select("
                    SUM(transfer_details.quantity) AS quantity
                ", FALSE);
                
                $this->db->from('transfer_details');
                $this->db->join('transfers', 'transfer_details.transfer_id = transfers.id');
                $this->db->join('product_barcodes', 'transfer_details.product_barcode_id = product_barcodes.id');
                $this->db->join('product_details', 'product_barcodes.product_detail_id = product_details.id');
                $this->db->join('branch_details', 'transfers.branch_detail_origin_id = branch_details.id');
        
        		$this->db->where('transfers.approved_state', 'A. GERENCIA');
                $this->db->where('EXTRACT(YEAR FROM transfers.transfer_date) =', $year);
                $this->db->where('EXTRACT(MONTH FROM transfers.transfer_date) <', $month);
                $this->db->where('product_details.product_id', $product_id);
                $this->db->where('branch_details.company_id', $company_id);
        	    $this->db->where('branch_details.branch_id', $branch_id);
                
                $this->db->group_by('product_details.product_id');
                
                $query = $this->db->get();
                
                if ($query->num_rows() === 1) {
                    $initial_stock -= intval($query->row()->quantity);
                }
            }
            
        }
        
        $this->db->trans_complete();

        return array(
            'quantity' => $initial_stock
        );
    }
    
}
