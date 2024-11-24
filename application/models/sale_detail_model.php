<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Sale_detail_model extends CI_Model {

    var $sale_id = '';
    var $quantity = '';
    var $subtotal = '';
    var $price = '';
    var $product_barcode_id = '';

	public function __construct()
	{
		parent::__construct();
	}

    ### MIGRADO
    public function add_by_product($sale_id)
    {
        $data = array();
        $products = $this->input->post('product');
        $sizes = $this->input->post('size');
        $quantities = $this->input->post('qty');
        $prices = $this->input->post('price');
        $subs = $this->input->post('subtotal');
        $costs = $this->input->post('cost');

        for ($i = 0; $i < count($products); $i++) {
            $this->db->select('product_barcodes.id');
            $this->db->from('product_barcodes');
            $this->db->join('product_details', 'product_barcodes.product_detail_id = product_details.id');
            $this->db->where('product_details.product_id', $products[$i]);
            $this->db->where('product_barcodes.size_id', $sizes[$i]);
            $query = $this->db->get();

            if ($query->num_rows() > 0) {
                $product_detail = $query->row();

                array_push($data, array(
                    'sale_id' => $sale_id,
                    'quantity' => $quantities[$i],
                    'subtotal' => $subs[$i],
                    'price' => $prices[$i],
                    'cost' => $costs[$i],
                    'product_barcode_id' => $product_detail->id
                ));
            }
        }

        if (count($data) < 1) {
            exit("NO HAY DATOS");
        }

        if ($this->db->insert_batch('sale_details', $data)) {
            return TRUE;
        } else {
            return FALSE;
        }
    }

    ### MIGRADO
    public function add($sale_id)
    {
        $data = array();
        $product_details = $this->input->post('product_detail');
        $quantities = $this->input->post('quantity');
        $prices = $this->input->post('price');
        $subs = $this->input->post('subtotal');
        $costs = $this->input->post('cost');

        for ($i = 0; $i < count($product_details); $i++) {
            array_push($data, array(
                'sale_id' => $sale_id,
                'quantity' => $quantities[$i],
                'subtotal' => $subs[$i],
                'price' => $prices[$i],
                'cost' => $costs[$i],
                'product_barcode_id' => $product_details[$i]
            ));
        }

        if (count($data) > 0) {
            if ($this->db->insert_batch('sale_details', $data)) {
                return TRUE;
            } else {
                return FALSE;
            }
        } else {
            return FALSE;
        }
    }

    function save_all($sale_info) // Guarda varios registros de ventas
    {
        $data = $this->input->post('sales');

        if (count($data) === count($sale_info)) {
            foreach ($data as $sale_index => $sale) {
                if (isset($sale['sale_details']) AND count($sale['sale_details'])) {
                    $detail_stocks = array();

                    foreach ($sale['sale_details'] as $detail_index => $sale_detail) {
                        $sale['sale_details'][$detail_index]['sale_id'] = $sale_info[$sale_index]->id;

                        if (empty($sale['sale_details'][$detail_index]['pack_list_id'])) {
                            $sale['sale_details'][$detail_index]['pack_list_id'] = NULL;
                        }

                        array_push($detail_stocks, '{' .
                            '"product_barcode_id":' . intval($sale_detail['product_barcode_id']) . ',' .
                            '"branch_id":' . intval($this->session->userdata('user_branch')) . ',' .
                            '"increment":' . ($sale['voucher'] === 'NOTA DE CREDITO' ? 1 : -1) * intval($sale_detail['quantity']) . /* Negativo porque se está vendiendo (reduce el stock) */
                        '}');

                    }

                    $stock_args = "ARRAY['" . implode("'::JSON, '", $detail_stocks) . "'::JSON]";

                    if (
                        !$this->db->insert_batch('sale_details', $sale['sale_details']) OR
                        !$this->db->simple_query("SELECT increase_store_stock($stock_args, TRUE)")
                    ) {
                        return FALSE;
                    }
                }
            }

            return TRUE;
        } else {
            return FALSE;
        }
    }

    ### MIGRADO
    public function get_for_operations($sale_id)
    {
        $this->db->select("
            sale_details.id,
            sale_details.quantity,
            sale_details.subtotal,
            sale_details.price,
            sale_details.cost,
            product_barcodes.id AS product_detail,
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
        $this->db->where('sale_details.sale_id', $sale_id);

        $query = $this->db->get();

        if ($query->num_rows() > 0) {
            return $query->result();
        }

        return FALSE;
    }

    public function get_by_sale($sale_id)
    {
        $this->db->select("
            sale_details.id,
            sale_details.quantity,
            sale_details.subtotal,
            sale_details.price,
            sale_details.cost,
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

        $this->db->where('sale_details.sale_id', $sale_id);

        $query = $this->db->get();

        return $query->result();
    }

    function get_refunded_by_sale($sale_id)
    {
        $this->db->select("
            id,
            quantity,
            old_quantity,
            product_barcode_id,
            refunded_quantity
        ");
        $this->db->from('v_refunded_sale_details');

        $this->db->where('sale_id', $sale_id);

        $query = $this->db->get();

        return $query->result();
    }

}

/* End of file sales_model.php */
/* Location: ./application/models/sales_model.php */
