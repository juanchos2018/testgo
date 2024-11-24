<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Sale_model extends MY_Model {

    var $salesman_id = '';
    var $cashier_id = '';
    var $customer_id = '';
    var $coupon_id = '';
    var $sale_date = '';
    var $igv = '';
    var $total_amount = '';
    var $state = '';
    var $active = '';
    var $voucher = '';
    var $regime = '';
    var $serie = '';
    var $serial_number = '';
    //var $refund_origin_id = '';
    //var $refund_target_id = '';
    var $sale_point_id = '';
    var $cash_amount = '';
    var $credit_card_amount = '';
    var $branch_id = '';
    var $total_cash_amount = '';

    public function cancel_series()
    {
        $voucher = $this->input->post('voucher');
        $serie = $this->input->post('serie');
        $regime = $this->input->post('regime');
        $branch_id = $this->input->post('branch_id');

        $this->salesman_id = NULL;
        $this->cashier_id = $this->input->post('cashier_id');
        $this->customer_id = NULL;
        $this->coupon_id = NULL;
        $this->sale_date = date('Y-m-d H:i:s');
        $this->igv = 0;
        $this->total_amount = 0;
        $this->state = 'SOLD';
        $this->active = 'f';
        $this->voucher = $voucher;
        $this->regime = $regime;
        $this->serie = $serie;
        $this->refund_origin_id = NULL;
        $this->refund_target_id = NULL;
        $this->sale_point_id = NULL;
        $this->cash_amount = 0;
        $this->credit_card_amount = 0;
        $this->branch_id = $branch_id;

        $min = $this->input->post('min');
        $limit = $this->input->post('limit');

        for ($i = $min; $i < $limit; $i++) {
            $this->serial_number = $i;

            if (!$this->db->insert('sales', $this)) {
                var_dump($this);
                return FALSE;
            }
        }

        $this->db->where('serie', $serie);
        $this->db->where('voucher', $voucher);
        $this->db->where('regime', $regime);
        $this->db->where('branch_id', $branch_id);

        return $this->db->update('series', array('serial_number' => $limit));
    }

    public function __construct()
    {
        parent::__construct();
    }

    ### MIGRADO
    public function get_all($branch_id = NULL,$company_id=NULL,$fecha = NULL)
    {// (sale_details.price) as sale_cost,
        $this->db->select("
            product_barcodes.id,
            products.code,
            (products.description || ' (T.' || size.description || ')' ) as description,
            stock.store_stock,
            stock.depot_stock,
            SUM(sale_details.quantity) as qty_sold,
            SUM(sale_details.price*sale_details.quantity) AS total
        ", FALSE);
        //ROUND(SUM(sale_details.price*sale_details.quantity)::NUMERIC,2) AS total
        $this->db->from('sales');
        $this->db->join('sale_details', 'sales.id = sale_details.sale_id','left');
        $this->db->join('product_barcodes', 'sale_details.product_barcode_id = product_barcodes.id','left');
        $this->db->join('product_details', 'product_details.id = product_barcodes.product_detail_id','left');
        $this->db->join('products', 'products.id = product_details.product_id','left');
        $this->db->join('size', 'size.id = product_barcodes.size_id','left');
        $this->db->join('stock', 'product_barcodes.id = stock.product_barcode_id','left');
        $this->db->join('sale_points', 'sale_points.id = sales.sale_point_id','left');
        //no muy seguro q corra bien probare
        if($fecha == NULL){
            $fecha = date('Y-m-d')."%";
        }
        $this->db->where("sales.sale_date::text LIKE '".$fecha."' ", NULL, FALSE);
        $this->db->where("stock.branch_id", $branch_id);
        //$this->db->where("sale_points.branch_id", $branch_id);//
        $this->db->where("product_details.company_id", $company_id);
        $this->db->where("sales.active", 't');
        $this->db->where("state", 'SOLD');

        $this->db->group_by(array(" product_barcodes.id", "products.code", "(products.description || ' (T.' || size.description || ')' )", "stock.store_stock", "stock.depot_stock"));
        $query = $this->db->get();

        return $query->result_array();
    }

    public function get($id)
    {
        $this->db->select("
            sales.id,
            salemen.id AS salesman_id,
            (salemen.name || ' ' || salemen.last_name) AS saleman,
            sales.cashier_id,
            CASE WHEN cashiers.name IS NOT NULL THEN
                (cashiers.name || ' ' || cashiers.last_name)
            ELSE
                users.username
            END AS cashier,
            sales.customer_id,
            customers.type AS customer_type,
            CASE WHEN customers.type = 'PERSONA' THEN
                customers.name || ' ' || customers.last_name
            ELSE
                customers.name
            END AS customer,
            customers.id_number AS customer_doc,
            customers.address AS customer_address,
            sales.coupon_id,
            sales.sale_date,
            sales.igv,
            sales.total_amount,
            sales.state,
            sales.voucher,
            sales.regime,
            sales.serie,
            sales.serial_number,
            sales.total_cash_amount,
            sales.cash_amount,
            sales.credit_card_amount,
            (SELECT COUNT(*) FROM sale_refunds WHERE sale_refunds.sale_origin_id = sales.id) AS refund_count,
            sales.sale_point_id,
            sale_points.description AS sale_point,
            sales.company_id,
            companies.name AS company,
            (barcode_inticard IS NOT NULL OR barcode_card2 IS NOT NULL) AS verified,
            serie_printers.printer_serial,
            serie_printers.printer_name,
            to_char(sales.sale_date, 'dd/mm/yyyy') AS date,
            to_char(sales.sale_date, 'hh24:mi') AS time
        ", FALSE);

        /*
            CASE WHEN sales.voucher = 'NOTA DE CREDITO' THEN
                (SELECT CONCAT(s.id, ',', s.voucher, ',', s.serie, ',', s.serial_number) FROM sales s WHERE s.id = sales.refund_origin_id)
            ELSE
                (SELECT CONCAT(s.id, ',', s.serie, ',', s.serial_number) FROM sales s WHERE s.refund_origin_id = sales.id)
            END AS refunded,
            origin.voucher AS origin_voucher,
            origin.serie AS origin_serie,
            origin.serial_number AS origin_serial
        */

        $this->db->from('sales');
        $this->db->join('employees salemen', 'sales.salesman_id = salemen.id', 'left');
        $this->db->join('users', 'sales.cashier_id = users.id');
        $this->db->join('employees cashiers', 'users.id = cashiers.user_id', 'left');
        $this->db->join('customers', 'sales.customer_id = customers.id', 'left');
        $this->db->join('companies', 'sales.company_id = companies.id');
        $this->db->join('serie_printers', 'sales.sale_point_id = serie_printers.sale_point_id AND serie_printers.branch_id = sales.branch_id AND serie_printers.company_id = sales.company_id', 'left');
        $this->db->join('sale_points', 'serie_printers.sale_point_id = sale_points.id', 'left');

        $this->db->where('sales.active', 't');
        $this->db->where('sales.id', $id);

        $query = $this->db->get();

        if ($query->num_rows()) {
            return $query->row();
        } else {
            return FALSE;
        }
    }

    public function get_for_operations($id)
    {
        $query = $this->db->query("
            SELECT
                sales.id,
                sales.salesman_id,
                (salemen.name || ' ' || salemen.last_name) AS saleman,
                sales.cashier_id,
                (cashiers.name || ' ' || cashiers.last_name) AS cashier,
                sales.customer_id,
                customers.type AS customer_type,
                CASE WHEN customers.type = 'PERSONA' THEN
                    (customers.name || ' ' || customers.last_name)
                ELSE
                    customers.name
                END AS customer,
                customers.id_number AS customer_doc,
                customers.address AS customer_address,
                sales.coupon_id,
                sales.sale_date,
                sales.igv,
                sales.total_amount,
                sales.state,
                sales.voucher,
                sales.regime,
                sales.serie,
                sales.serial_number,
                sales.total_cash_amount,
                sales.cash_amount,
                sales.credit_card_amount,
                CASE WHEN sales.voucher = 'NOTA DE CREDITO' THEN
                    (SELECT CONCAT(s.id, ',', s.voucher, ',', s.serie, ',', s.serial_number) FROM sales s WHERE s.id = sales.refund_origin_id)
                ELSE
                    (SELECT CONCAT(s.id, ',', s.serie, ',', s.serial_number) FROM sales s WHERE s.refund_origin_id = sales.id)
                END AS refunded,
                origin.voucher AS origin_voucher,
                origin.serie AS origin_serie,
                origin.serial_number AS origin_serial
            FROM sales
            LEFT OUTER JOIN employees salemen ON sales.salesman_id = salemen.id
            INNER JOIN employees cashiers ON sales.cashier_id = cashiers.id
            LEFT OUTER JOIN customers ON sales.customer_id = customers.id
            LEFT OUTER JOIN sales origin ON sales.refund_origin_id = origin.id
            WHERE
                sales.id = " . $id . " AND
                sales.active = 't'
        ");

        if ($query->num_rows() === 1) {
            return $query->row();
        }

        return FALSE;
    }

    public function add($data = NULL)
    {
        $this->salesman_id = $this->input->post('salesman_id');
        $this->cashier_id = $this->input->post('cashier_id');
        $this->customer_id = $this->input->post('customer_id');
        $this->coupon_id = $this->input->post('coupon_id');
        $this->sale_date = date('Y-m-d H:i:s');
        $this->igv = $this->input->post('igv');
        $this->total_amount = $this->input->post('total_amount');
        $this->state = $this->input->post('state');
        $this->active = 't';
        $this->voucher = $this->input->post('voucher');
        $this->regime = $this->input->post('regime');
        $this->serie = $this->input->post('serie');
        $this->serial_number = $this->input->post('serial_number');
        $this->refund_origin_id = $this->input->post('refund_origin_id');
        $this->refund_target_id = $this->input->post('refund_target_id');
        $this->sale_point_id = $this->input->post('sale_point_id');
        $this->cash_amount = $this->input->post('cash_amount');
        $this->credit_card_amount = $this->input->post('credit_card_amount');
        $this->branch_id = $this->input->post('branch_id');
        $this->total_cash_amount = $this->total_amount - $this->credit_card_amount;

        // Esto no está validado
        $this->total_cash_amount = $this->input->post('cash_amount');

        if (!is_null($data)) {
            foreach ($data as $key => $value) {
                $this->$key = $value;
            }
        }

        if (empty($this->salesman_id)) $this->salesman_id = NULL;
        if (empty($this->cashier_id)) $this->cashier_id = NULL;
        if (empty($this->customer_id)) $this->customer_id = NULL;
        if (empty($this->coupon_id)) $this->coupon_id = NULL;
        if (empty($this->regime)) $this->regime = NULL;
        if (empty($this->refund_origin_id)) $this->refund_origin_id = NULL;
        if (empty($this->refund_target_id)) $this->refund_target_id = NULL;
        if (empty($this->branch_id)) $this->branch_id = NULL;

        if ($this->db->insert('sales', $this)) {
            return $this->db->insert_id();
        } else {
            return FALSE;
        }
    }

    public function save()
    {
        if ($this->input->post('sales')) { // Se registran varias ventas
            $data = array();

            foreach ($this->input->post('sales') as $sale) {
                array_push($data, '{' .
                    '"salesman_id":' . $this->escape_json($sale['salesman_id']) . ',' .
                    '"cashier_id":' . intval($this->session->userdata('user_id')) . ',' .
                    '"customer_id":' . $this->escape_json($sale['customer_id']) . ',' .
                    '"coupon_id":' . $this->escape_json($sale['coupon_id']) . ',' .
                    '"igv":' . floatval($sale['igv']) . ',' .
                    '"total_amount":' . floatval($sale['total_amount']) . ',' .
                    '"state":' . $this->escape_json($sale['state']) . ',' .
                    '"voucher":' . $this->escape_json($sale['voucher']) . ',' .
                    '"regime":' . $this->escape_json($sale['regime']) . ',' .
                    //'"refund_origin_id":' . $this->escape_json($sale['refund_origin_id']) . ',' .
                    //'"refund_target_id":' . $this->escape_json($sale['refund_target_id']) . ',' .
                    '"sale_point_id":' . $this->escape_json($sale['sale_point_id']) . ',' .
                    '"total_cash_amount":' . floatval($sale['total_cash_amount']) . ',' .
                    '"credit_card_amount":' . floatval($sale['credit_card_amount']) . ',' .
                    '"branch_id":' . intval($this->session->userdata('user_branch')) . ',' .
                    (
                        $sale['voucher'] === 'NOTA DE CREDITO' ?
                            '"serie":' . $this->escape_json($sale['serie']) . ',' .
                            '"serial_number":' . intval($sale['serial_number']) . ','
                        :
                            ''
                    ) .
                    '"company_id":' . intval($sale['company_id']) .
                '}');
            }

            $args = "ARRAY['" . implode("'::JSON, '", $data) . "'::JSON]";

            $query = $this->db->query("SELECT save_sales($args) AS result");

            if ($query->num_rows() > 0) {
                $row = $query->row();

                return $row->result;
            } else {
                return FALSE;
            }
        } elseif ($this->input->post('sale')) { // Se registra un solo documento (para venta manual)
            $sale = $this->input->post('sale');

            $sale_json = "'{" .
                '"salesman_id":' . $this->escape_json($sale['salesman_id']) . ',' .
                '"cashier_id":' . intval($this->session->userdata('user_id')) . ',' .
                '"customer_id":' . $this->escape_json($sale['customer_id']) . ',' .
                '"coupon_id":' . $this->escape_json($sale['coupon_id']) . ',' .
                '"igv":' . floatval($sale['igv']) . ',' .
                '"total_amount":' . floatval($sale['total_amount']) . ',' .
                '"state":' . $this->escape_json($sale['state']) . ',' .
                '"voucher":' . $this->escape_json($sale['voucher']) . ',' .
                '"regime":' . $this->escape_json($sale['regime']) . ',' .
                //'"refund_target_id":' . $this->escape_json($sale['refund_target_id']) . ',' .
                '"total_cash_amount":' . floatval($sale['total_cash_amount']) . ',' .
                '"credit_card_amount":' . floatval($sale['credit_card_amount']) . ',' .
                '"branch_id":' . intval($this->session->userdata('user_branch')) . ',' .
                (
                    $sale['voucher'] === 'NOTA DE CREDITO' ?
                        '"refund_origin_id":' . intval($sale['refund_origin_id']) . ',' .
                        '"refund_reason_id":' . intval($sale['refund_reason_id']) . ',' .
                        '"other_refund_reason":' . $this->escape_json($sale['other_refund_reason']) . ','
                    :
                        ''
                ) .
                '"company_id":' . intval($sale['company_id']) . ',' .
                '"sale_point_id":' . $this->escape_json($sale['sale_point_id']) . ',' .
                '"serie":' . $sale['serie'] . ',' .
                '"serial_number":' . intval($sale['serial_number']) . ',' .
                '"sale_date":' . $this->escape_json($sale['sale_date']) .
            "}'::JSON";

            $details_json = [];

            foreach ($sale['sale_details'] as $sale_detail) {
                array_push($details_json, "'{" .
                    '"quantity":' . intval($sale_detail['quantity']) . ',' .
                    '"price":' . floatval($sale_detail['price']) . ',' .
                    '"product_barcode_id":' . $this->escape_json($sale_detail['product_barcode_id']) . ',' . // Se escapa porque puede ser NULL
                    '"cost":' . floatval($sale_detail['cost']) . ',' .
                    '"pack_list_id":' . $this->escape_json($sale_detail['pack_list_id']) . // Se escapa porque puede ser NULL
                "}'::JSON");
            }

            $cards_json = [];

            if (isset($sale['credit_cards'])) {
                foreach ($sale['credit_cards'] as $credit_card) {
                    array_push($cards_json, "'{" .
                        '"operation_code":' . $this->escape_json($credit_card['operation_code']) . ',' .
                        '"verification_code":' . $this->escape_json($credit_card['verification_code']) . ',' .
                        '"amount":' . floatval($credit_card['amount']) . ',' .
                        '"credit_card_type_id":' . intval($credit_card['credit_card_type_id']) .
                    "}'::JSON");
                }
            }

            $query = $this->db->query('SELECT save_sale(' . $sale_json . ', ARRAY[' . implode(', ', $details_json) . ']::JSON[], ARRAY[' . implode(', ', $cards_json) . ']::JSON[]) AS result');

            if ($query->num_rows() > 0) {
                $row = $query->row();

                return $row->result;
            } else {
                return 0;
            }
        }

    }

    public function undo_saved_sale($sale_id)
    {
        $this->db->delete('sale_details', array('sale_id' => $sale_id));
        $this->db->delete('credit_cards', array('sale_id' => $sale_id));
        $this->db->delete('sales', array('id' => $sale_id));
    }

    public function get_for_refund($company_id, $voucher, $serie, $serial, $where = NULL)
    {
        $branch_id = $this->session->userdata('user_branch');

        $this->db->select('id, active');
        $this->db->where('voucher', $voucher);
        $this->db->where('serie', $serie);
        $this->db->where('serial_number', $serial);
        $this->db->where('company_id', $company_id);
        $this->db->where('branch_id', $branch_id);

        if (!is_null($where)) {
            $this->db->where($where);
        }

        $query = $this->db->get('sales');

        if ($query->num_rows()) {
            return $query->row_array();
        } else {
            return FALSE;
        }
    }

    public function get_id_for_detail($voucher, $serie, $serial_number, $company_id, $branch_id = NULL)
    {
        if (is_null($branch_id)) {
            $branch_id = $this->session->userdata('user_branch');
        }

        $this->db->select('id');

        $this->db->where('voucher', $voucher);
        $this->db->where('serie', $serie);
        $this->db->where('serial_number', $serial_number);
        $this->db->where('company_id', $company_id);
        $this->db->where('branch_id', $branch_id);

        $query = $this->db->get('sales');

        if ($query->num_rows() > 0) {
            return $query->row();
        } else {
            return FALSE;
        }
    }

    public function sumary($type, $voucher = 'TICKET', $sale_point_id = NULL, $company_id = NULL, $date)
    {
        // Cuidado en voucher debería filtrarse que sean BOLETAS o TICKETS

        $branch_id = $this->session->userdata('user_branch');

        $this->db->select("
            SUM(igv) AS igv,
            SUM(total_amount) AS total,
            SUM(cash_amount) AS total_cash,
            SUM(credit_card_amount) AS total_credit_card,
            COUNT(*) AS transactions,
            max(serial_number) AS max,
            min(serial_number) AS min,
            companies.name AS com,
            serie AS serie,
            TO_CHAR(sales.sale_date,'DD/MM/YYYY') AS date
            ", FALSE);
        $this->db->from('sales');
        $this->db->join('companies', 'companies.id=sales.company_id', 'left');
        $this->db->where("sales.active", 't');
        $this->db->where("sales.sale_point_id", $sale_point_id);
        $this->db->where("sales.company_id", $company_id);
        $this->db->where("voucher", $voucher);
        if($type == 1){
            $this->db->where("closing_state", 'NINGUNO');
        }elseif ($type == 2) {
            $this->db->where("closing_state", 'CIERRE PARCIAL');
        }

        $this->db->where("DATE(sales.sale_date)", $date);
        $this->db->group_by('sales.serie, companies.name,date');
        $query = $this->db->get();

       /* if ($query->num_rows()) {
            $data = array_merge($data, $query->row_array());
        }
            $this->db->select("
                SUM(igv) AS b_igv,
                SUM(total_amount) AS b_total,
                SUM(cash_amount) AS b_total_cash,
                SUM(credit_card_amount) AS b_total_credit_card,
                Count(*) AS b_transactions,
                max(serial_number) AS b_max,
                min(serial_number) AS b_min,
                companies.name AS b_com,
                serie AS b_serie
                ", FALSE);
            $this->db->from('sales');
            $this->db->join('companies', 'companies.id=sales.company_id', 'left');
            $this->db->where("sales.active", 't');
            $this->db->where("sales.sale_point_id", $sale_point_id);
            $this->db->where("sales.company_id", $company_id);
            $this->db->where("voucher", 'BOLETA');
            if($type == 1){
                $this->db->where("closing_state", 'NINGUNO');
            }elseif ($type == 2) {
                $this->db->where("closing_state", 'CIERRE PARCIAL');
            }

            $this->db->where("DATE(sales.sale_date)", $date);
            $this->db->group_by('sales.serie, companies.name');
            $query = $this->db->get();

        if ($query->num_rows()) {
            $data = array_merge($data, $query->row_array());
        }
            $this->db->select("
                SUM(igv) AS n_igv,
                SUM(total_amount) AS n_total,
                SUM(cash_amount) AS n_total_cash,
                SUM(credit_card_amount) AS n_total_credit_card,
                Count(*) AS n_transactions,
                max(serial_number) AS n_max,
                min(serial_number) AS n_min,
                companies.name AS n_com,
                serie AS n_serie
                ", FALSE);
            $this->db->from('sales');
            $this->db->join('companies', 'companies.id=sales.company_id', 'left');
            $this->db->where("sales.active", 't');
            $this->db->where("sales.sale_point_id", $sale_point_id);
            $this->db->where("sales.company_id", $company_id);
            $this->db->where("voucher", 'NOTA DE CREDITO');
            if($type == 1){
                $this->db->where("closing_state", 'NINGUNO');
            }elseif ($type == 2) {
                $this->db->where("closing_state", 'CIERRE PARCIAL');
            }
            $this->db->where("DATE(sales.sale_date)", $date);
            $this->db->group_by('sales.serie, companies.name');
            $query = $this->db->get();
        */
        if ($query->num_rows()) {
            return $query->result_array();
        }

        return FALSE;
    }
    public function sumary_cards($type, $sale_point_id = NULL, $company_id = NULL, $date)
    {
        $branch_id = $this->session->userdata('user_branch');
        $data = array();
        $this->db->select("abbrev, sum(amount) as tt_amount", FALSE);
            $this->db->from('credit_cards');
            $this->db->join('sales', 'credit_cards.sale_id = sales.id', 'left');
            $this->db->join('credit_card_types', 'credit_cards.credit_card_type_id = credit_card_types.id', 'left');
            $this->db->where("sales.active", 't');
            $this->db->where("sales.sale_point_id", $sale_point_id);
            $this->db->where("sales.company_id", $company_id);
            $this->db->where("voucher !=", 'NOTA DE CREDITO');
            if($type == 1){
                $this->db->where("closing_state", 'NINGUNO');
            }elseif ($type == 2) {
                $this->db->where("closing_state", 'CIERRE PARCIAL');
            }
            $this->db->where("DATE(sales.sale_date)", $date);
            $this->db->group_by('abbrev');
            $query = $this->db->get();

        if ($query->num_rows()) {
            return $query->result_array();
        }
        return FALSE;
    }

    public function sumary_by_categories($type, $sale_point_id = NULL, $company_id = NULL, $date)
    {

         $this->db->select("sum(subtotal) AS total_amount,categories.description AS category", FALSE);
            $this->db->from('sales');
            $this->db->join('sale_details', 'sales.id = sale_details.sale_id ');
            $this->db->join('product_barcodes', 'sale_details.product_barcode_id = product_barcodes.id', 'left');
            $this->db->join('product_details', 'product_barcodes.product_detail_id = product_details.id', 'left');
            $this->db->join('products', 'product_details.product_id = products.id ', 'left');
            $this->db->join('categories', 'products.category_id = categories.id', 'left');
            $this->db->where("sales.active", 't');
            if($sale_point_id != NULL and $sale_point_id != 0){
                $this->db->where("sales.sale_point_id", $sale_point_id);
            }
            $this->db->where("sales.company_id", $company_id);
            $this->db->where("voucher !=", 'NOTA DE CREDITO');
            if($type == 1){
                $this->db->where("closing_state", 'NINGUNO');
            }elseif ($type == 2) {
                $this->db->where("closing_state", 'CIERRE PARCIAL');
            }
            $this->db->where("state", 'SOLD');
            $this->db->where("DATE(sales.sale_date)", $date);
            $this->db->group_by('categories.description');
            $query = $this->db->get();
        if ($query->num_rows()) {
            return $query->result_array();
        }

        return FALSE;

    }

    public function list_sales_by_ticket($type, $sale_point_id = NULL, $company_id = NULL, $date)
    {
        $this->db->select("series.abbrev,sales.serie || '-'|| sales.serial_number AS num,total_amount,state", FALSE);
            $this->db->from('sales');
            $this->db->join('series', 'sales.serie = series.serie AND sales.company_id = series.company_id' ,'left');
            $this->db->where('sales.voucher = series.voucher');
            if($sale_point_id != NULL and $sale_point_id != 0){
                $this->db->where("sales.sale_point_id", $sale_point_id);
            }
            $this->db->where("sales.company_id", $company_id);
            if($type == 1){
                $this->db->where("closing_state", 'NINGUNO');
            }elseif ($type == 2) {
                $this->db->where("closing_state", 'CIERRE PARCIAL');
            }
            $this->db->where("DATE(sales.sale_date)", $date);
            $this->db->order_by('sales.serial_number', 'asc');
            $query = $this->db->get();
        if ($query->num_rows()) {
            return $query->result_array();
        }
        return FALSE;
    }

    public function sumary_by_category($type, $sale_point_id = NULL, $company_id = NULL, $date, $category)
    {

        $this->db->select("products.description, sale_details.price, count(*) as num, sum(sale_details.subtotal) as total", FALSE);
            $this->db->from('sales');
            $this->db->join('sale_details', 'sales.id = sale_details.sale_id ');
            $this->db->join('product_barcodes', 'sale_details.product_barcode_id = product_barcodes.id');
            $this->db->join('product_details', 'product_barcodes.product_detail_id = product_details.id');
            $this->db->join('products', 'product_details.product_id = products.id ');
            $this->db->join('categories', 'products.category_id = categories.id');
            if($sale_point_id != NULL and $sale_point_id != 0){
                $this->db->where("sales.sale_point_id", $sale_point_id);
            }
            $this->db->where("sales.company_id", $company_id);
            if($type == 1){
                $this->db->where("closing_state", 'NINGUNO');
            }elseif ($type == 2) {
                $this->db->where("closing_state", 'CIERRE PARCIAL');
            }
            $this->db->where("categories.description", $category);
            $this->db->where("DATE(sales.sale_date)", $date);
            $this->db->where("sales.state", 'SOLD');
            $this->db->group_by('products.description,sale_details.price');
            $query = $this->db->get();
        if ($query->num_rows()) {
            return $query->result_array();
        }

        return FALSE;

    }

    public function sumary_refunds($sale_point_id= NULL)
    {
        // Cuidado en voucher debería filtrarse que sean BOLETAS o TICKETS
        $query = $this->db->query("
            SELECT SUM(total_amount) AS total, SUM(igv) as igv,SUM(cash_amount) as total_cash, SUM(credit_card_amount) as total_credi_card ,Count(*)as transaccions,max(serial_number) as max,min(serial_number) as min,serie
            FROM sales
            WHERE active = 't' AND
            sale_point_id = ".$sale_point_id." AND
            voucher = 'NOTA DE CREDITO' AND
            state = 'REFUNDED'
            GROUP BY serie
        ");

        if ($query->num_rows() === 1) {
            return $query->row_array();
        }

        return FALSE;
    }



    public function close_sale_point($sale_point_id = NULL)
    {
        $query = $this->db->query("
            UPDATE sales
            SET state = 'DONE' WHERE
            state = 'SOLD' AND sale_point_id = ".$sale_point_id);


        return FALSE;
    }

    public function get_for_concar($date1 = '2015-01-17',$date2 = '2015-01-19'){
        $date1 = $this->input->post('startDate');
        $date2 = $this->input->post('endDate');
        $this->db->select("
            subsidiary_journal as cssubdia,
            lpad(cast(sales.serie as text),3,'0') || '-' || lpad(cast(sales.serial_number as text),7,'0') as ccompro,
            TO_CHAR(sale_date, 'YYYY-MM-DD') AS cfeccom,
            2.79 as ctipcam,
            sales.voucher,
            sales.regime,
            last_name || ', ' || lpad(cast(sales.serie as text),3,'0') || '-' || lpad(cast(sales.serial_number as text),5,'0') as cglosa,
            total_amount as ctotal,
            COALESCE(igv,0) as igv,
            customers.id_number
        ",FALSE);
        $this->db->from('sales');
        $this->db->join('customers', 'customers.id=sales.customer_id', 'left');
        $this->db->join('series', 'sales.branch_id=series.branch_id', 'left');
        $where= "series.serie = sales.serie";
        $this->db->where( $where);
        $where= "series.voucher = sales.voucher";
        $this->db->where( $where);
        $where= "series.regime = sales.regime";
        $this->db->where( $where);
        $where= "DATE(sales.sale_date) BETWEEN '".$date1. "' AND '".$date2."'";
        $this->db->where($where);
        $query = $this->db->get();

        if ($query->num_rows() === 0) {
            return FALSE;
        } else {
            return $query->result();
        }
    }

    /* */
    public function get_history($branch)
    {
        $this->db->select("name,sale_date::date as sale_c, sum(total_amount) as total",FALSE);
        $this->db->from('sales');
        $this->db->join('companies', 'sales.company_id = companies.id');
        $this->db->where('branch_id',$branch);
        $this->db->where('voucher !=','NOTA DE CREDITO');
        $this->db->where('state','SOLD');
        $this->db->where('sales.active','true');
        $this->db->where('EXTRACT(YEAR FROM sale_date) =',date("Y"),FALSE);
        $this->db->where('EXTRACT(MONTH FROM sale_date) =',date("m"),FALSE);
        $this->db->group_by("name,sale_c");
        $this->db->order_by('sale_c,name');
        $query = $this->db->get();

        return $query->result_array();
    }

    public function get_history_by_branch($branch_id = NULL)
    {
        if (is_null($branch_id)) {
            $branch_id = $this->session->userdata('user_branch');
        }

        $query = $this->db->query("
            SELECT d.date, bd.company_id, COALESCE(SUM(s.total_amount), 0) AS amount
            FROM
            (SELECT CURRENT_DATE- offs AS date FROM GENERATE_SERIES(0, 30, 1) AS offs) d
            LEFT OUTER JOIN branch_details bd ON bd.branch_id = $branch_id
            LEFT OUTER JOIN sales s ON d.date = s.sale_date::DATE AND s.company_id = bd.company_id
            AND s.branch_id = $branch_id
            AND s.voucher IN ('TICKET', 'BOLETA', 'FACTURA')
            AND s.state = 'SOLD'
            AND s.active = TRUE
            GROUP BY 1, 2
            ORDER BY 1 ASC
        ");

        return $query->result_array();
    }

    ### MIGRADO
    public function get_sale_percent($branch)
    {
        $this->db->select("categories.description as category,SUM(subtotal) AS total");
        $this->db->from('sale_details');
        $this->db->join('sales','sale_details.sale_id = sales.id');
        $this->db->join('product_barcodes','sale_details.product_barcode_id = product_barcodes.id');
        $this->db->join('product_details','product_barcodes.product_detail_id = product_details.id');
        $this->db->join('products','product_details.product_id = products.id');
        $this->db->join('categories','products.category_id = categories.id');
        $this->db->where('branch_id',$branch);
        $this->db->where('voucher !=','NOTA DE CREDITO');
        $this->db->where('state','SOLD');
        $this->db->where('EXTRACT(YEAR FROM sale_date) =',date("Y"),FALSE);
        $this->db->where('EXTRACT(MONTH FROM sale_date) =',date("m"),FALSE);
        $this->db->group_by('category');
        $this->db->order_by('total');
        $query = $this->db->get();

        if ($query->num_rows() === 0) {
            return FALSE;
        }else{
            return $query->result_array();
        }
    }
    /* */

    public function get_inventory($target, $company_id, $start_date_or_period, $end_date)
    {
        $result = array();
        $page = intval($this->input->get('page'));
        $display = intval($this->input->get('display'));

        $this->db->select('COUNT(DISTINCT (product_details.product_id, sales.voucher, sales.serie, sales.serial_number, sales.sale_date)) AS total_count', FALSE);
        
        $this->_get_inventory($target, $company_id, $start_date_or_period, $end_date);

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
                sales.voucher, sales.serie, sales.serial_number, sales.sale_date,
                SUM(sale_details.quantity) AS quantity
            ");

            $this->_get_inventory($target, $company_id, $start_date_or_period, $end_date);

            $this->db->group_by('products.description, product_details.product_id, sales.voucher, sales.serie, sales.serial_number, sales.sale_date'); 
            $this->db->order_by('products.description', 'asc');
            $this->db->order_by('sales.sale_date', 'asc');

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

    private function _get_inventory($target, $company_id, $start_date_or_period, $end_date)
    {
        $this->db->from('sale_details');
        $this->db->join('product_barcodes', 'sale_details.product_barcode_id = product_barcodes.id');
        $this->db->join('sales', 'sale_details.sale_id = sales.id');
        $this->db->join('product_details', 'product_barcodes.product_detail_id = product_details.id');
        $this->db->join('products', 'product_details.product_id = products.id');

        $this->db->where('sales.active', 't');
        $this->db->where('sales.state !=', 'CANCELED');
        $this->db->where('sales.company_id', $company_id);

        if ($target === 'branch') { // by company and branch
            $branch_id = $this->session->userdata('user_branch');

            $this->db->where('sales.branch_id', $branch_id);
        }        

        switch ($start_date_or_period) {
            case 'year':
                $this->db->where('EXTRACT(YEAR FROM sales.sale_date) =', $end_date);
                break;
            case 'month':
                list($year, $month) = explode('-', $end_date);

                $this->db->where('EXTRACT(MONTH FROM sales.sale_date) =', $month + 1);
                $this->db->where('EXTRACT(YEAR FROM sales.sale_date) =', $year);
                break;
            default:
                $this->db->where("sales.sale_date BETWEEN '$start_date_or_period'::TIMESTAMP AND '$end_date'::TIMESTAMP + '1 days'::INTERVAL");
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
            TO_CHAR(sales.sale_date, 'DD/MM/YYYY') AS date_text,
            EXTRACT(EPOCH FROM sales.sale_date AT TIME ZONE 'UTC')::INTEGER AS date_unix,
            sale_details.quantity,
            sales.serie,
            sales.serial_number,
            sales.voucher
        ", FALSE);
        
        $this->db->from('sale_details');
        $this->db->join('sales', 'sale_details.sale_id = sales.id');
        $this->db->join('product_barcodes', 'sale_details.product_barcode_id = product_barcodes.id');
        $this->db->join('product_details', 'product_barcodes.product_detail_id = product_details.id');
        
        $this->db->where('sales.active', 't');
        $this->db->where('sales.state !=', 'CANCELED');
        //$this->db->where('sales.voucher::TEXT', "ANY(VALUES ('TICKET'), ('BOLETA'), ('FACTURA'))", FALSE);
        $this->db->where('EXTRACT(YEAR FROM sales.sale_date) =', $year);
        $this->db->where('product_details.product_id', $product_id);
        
        if (!is_null($month)) {
            $this->db->where('EXTRACT(MONTH FROM sales.sale_date) =', $month);
        }
        
        $this->db->where('sales.company_id', $company_id);
        
        if ($target === 'branch') {
            $this->db->where('sales.branch_id', $branch_id);
        } else {
            $this->db->select('sales.branch_id');
        }
        
        $this->db->order_by('sales.sale_date asc');
        
        $query = $this->db->get();
        
        return $query->result_array();
    }

    public function get_detail($id)
    {
        $this->db->trans_start();

        $this->db->select("
            sales.sale_date,
            TRIM(sellers.name || ' ' || COALESCE(sellers.last_name, '')) AS saleman,
            TRIM(cashiers.name || ' ' || COALESCE(cashiers.last_name, '')) AS cashier,
            COALESCE(TRIM(customers.name || ' ' || COALESCE(customers.last_name, '')), customers.id_number) AS customer,
            sales.cashier_id,
            sales.voucher,
            sales.serie,
            sales.serial_number,
            sales.state,
            sales.regime,
            sales.igv,
            sales.total_amount,
            sales.total_cash_amount,
            sales.cash_amount,
            companies.name AS company,
            branches.alias AS branch,
            sale_points.description AS sale_point,
            refund_reasons.description AS refunded_reason,
            sale_refunds.other_refund_reason AS refunded_other_reason,
            refunded.id AS refunded_id,
            refunded.voucher AS refunded_voucher,
            refunded.serie AS refunded_serie,
            refunded.serial_number AS refunded_serial_number
        ", FALSE);

        $this->db->from('sales');
        $this->db->join('employees sellers', 'sales.salesman_id = sellers.id', 'left');
        $this->db->join('employees cashiers', 'sales.cashier_id = cashiers.user_id', 'left');
        $this->db->join('customers', 'sales.customer_id = customers.id', 'left');
        $this->db->join('companies', 'sales.company_id = companies.id');
        $this->db->join('branches', 'sales.branch_id = branches.id');
        $this->db->join('sale_points', 'sales.sale_point_id = sale_points.id', 'left');
        // Si fuera una NC
        $this->db->join('sale_refunds', 'sales.id = sale_refunds.sale_target_id AND sale_refunds.from_sale = TRUE', 'left');
        $this->db->join('refund_reasons', 'sale_refunds.refund_reason_id = refund_reasons.id', 'left');
        $this->db->join('sales refunded', 'sale_refunds.sale_origin_id = refunded.id', 'left');
        $this->db->where('sales.id', $id);

        $query = $this->db->get();

        if ($query->num_rows() > 0) {
            $result = $query->row_array();

            if (is_null($result['cashier']) and !is_null($result['cashier_id'])) {
                $this->db->select('users.username');
                $this->db->from('users');
                $this->db->where('users.id', $result['cashier_id']);

                $query = $this->db->get();

                if ($query->num_rows() > 0) {
                    $cashier_user = $query->row_array();

                    $result['cashier'] = $cashier_user['username'];
                }
            }

            $this->db->select("
                sale_details.quantity,
                sale_details.subtotal,
                sale_details.price,
                sale_details.product_barcode_id,
                products.description AS product,
                products.regime,
                products.code,
                products.output_statement,
                brands.description AS brand,
                size.description AS size
            ");

            $this->db->from('sale_details');
            $this->db->join('product_barcodes', 'sale_details.product_barcode_id = product_barcodes.id');
            $this->db->join('product_details', 'product_barcodes.product_detail_id = product_details.id');
            $this->db->join('products', 'product_details.product_id = products.id');
            $this->db->join('size', 'product_barcodes.size_id = size.id');
            $this->db->join('brands', 'products.brand_id = brands.id');

            $this->db->where('sale_details.sale_id', $id);

            $query = $this->db->get();

            $result['sale_details'] = $query->result_array();

            if (strpos($result['voucher'], 'NOTA DE CREDITO') === FALSE) { // Mejor sería comprobar si si su estado es REFUNDED y no es NC
                $this->db->select("
                    sales.id,
                    sales.voucher,
                    sales.serie,
                    sales.serial_number,
                    sale_details.quantity,
                    sale_details.product_barcode_id,
                    sale_details.price
                ");

                $this->db->from('sale_refunds');
                $this->db->join('sales', "sale_refunds.sale_target_id = sales.id AND sale_refunds.sale_origin_id = $id AND sale_refunds.from_sale = TRUE AND sales.active = TRUE");
                $this->db->join('sale_details', 'sales.id = sale_details.sale_id');

                $query = $this->db->get();

                $result['refund_details'] = $query->result_array();
                
                // Además SI ES VENTA se deben obtener los pagos
                $this->db->select("
                    credit_cards.verification_code,
                    credit_cards.amount,
                    credit_card_types.abbrev
                ");

                $this->db->from('credit_cards');
                $this->db->join('credit_card_types', "credit_cards.credit_card_type_id = credit_card_types.id AND credit_cards.sale_id = $id");

                $query = $this->db->get();

                $result['card_payments'] = $query->result_array();
            }

        } else {
            $result = array();
        }

        if (strpos($result['voucher'], 'NOTA DE CREDITO') !== FALSE) {
            // TO DO
        }

        $this->db->trans_complete();

        return $result;
    }
}
