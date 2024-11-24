<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Purchase_order_model extends CI_Model {

    var $code = ''; # varchar(10)
    var $description = ''; # varchar(100)
    var $start_date = ''; # date
    var $finish_date = ''; # date
    var $paid_date = ''; # date
    var $supplier_id = ''; # integer
    var $active = ''; # boolean

	public function __construct()
	{
		parent::__construct();
	}

    function simple_list($supplier_id = -1, $active = 't')
    {
        try {
            $this->db->select('id, code AS text', FALSE);
            $this->db->from('purchase_orders');

            if ($supplier_id > -1) {
                $this->db->where('supplier_id', $supplier_id);
            }

            $this->db->order_by('code');

            $query = $this->db->get();

            if ($query->num_rows() > 0) {
                return $query->result();
            } else {
                return array();
            }
        } catch (Exception $e) {
            exit(var_dump($e->getMessage));
        }
    }

    function next_id()
	{
        $this->db->select('last_value + increment_by AS result', FALSE);

        $query = $this->db->get('purchase_orders_id_seq');

        if ($query->num_rows() > 0) {
            $data = $query->row();

            return $data->result;
        } else {
            return 1;
        }
	}

    function save()
    {
        $purchase_order = pg_json(array(
            'description' => $this->input->post('description'),
            'start_date' => $this->input->post('start_date'),
            'finish_date' => $this->input->post('finish_date'),
            'paid_date' => $this->input->post('paid_date'),
            'active' => $this->input->post('active'),
            'supplier_id' => $this->input->post('supplier_id'),
            'company_id' => $this->input->post('company_id'),
            'branch_id' => $this->session->userdata('user_branch')
        ));

        $purchase_order_details = pg_json($this->input->post('details'));

        $query = $this->db->query("SELECT save_purchase_order($purchase_order, $purchase_order_details) AS result");

        if ($query->num_rows() > 0) {
            $row = $query->row();

            return $row->result;
        } else {
            return FALSE;
        }
    }

    function update($id)
    {
        $purchase_order = pg_json(array(
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

        $purchase_order_details = pg_json($details);

        $query = $this->db->query("SELECT update_purchase_order($id, $purchase_order, $purchase_order_details) AS result");

        if ($query->num_rows() > 0) {
            return $id;
        } else {
            return FALSE;
        }
    }

    function get_all($where = NULL)
    {
        $this->db->select('id, code, description, active, finish_date, supplier, company, quantity, arrived_quantity');

        if (!is_null($where)) {
            $this->db->where($where);
        }

        $this->db->order_by('registered_at DESC');
        $query = $this->db->get('v_purchase_orders');

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
        $query = $this->db->get('v_purchase_orders');

        return $query->result_array();
    }

    function get($id)
    {
        $this->db->select("
            po.id,
            po.code,
            po.description,
            po.start_date,
            po.finish_date,
            po.paid_date,
            po.active,
            po.supplier_id,
            po.registered_at,
            bd.company_id
        ");

        $this->db->from('purchase_orders po');
        $this->db->join('branch_details bd', 'po.branch_detail_id = bd.id');
        $this->db->where('po.id', $id);
        $this->db->where('bd.branch_id', $this->session->userdata('user_branch'));

        $query = $this->db->get();

        if ($query->num_rows() === 1) {
            return $query->row_array();
        } else {
            return FALSE;
        }
    }

    function get_details($purchase_order_id)
    {
        $branch_id = $this->session->userdata('user_branch');

        $this->db->select("
            id,
            product_id,
            code,
            quantity,
            arrived_quantity,
            get_stock_by_detail(product_detail_id, $branch_id) AS store_stock,
            product_detail_id,
            cost,
            cost_currency,
            invoice_cost,
            invoice_currency,
            description,
            category,
            gender,
            age,
            use,
            brand,
            subcategory,
            regime
        ", FALSE);
        $this->db->from('v_purchase_order_details');
        $this->db->where('purchase_order_id', $purchase_order_id);

        $query = $this->db->get();

        return $query->result_array();
    }

    function delete()
    {
        $id = $this->input->post('id');

        return $this->db->delete('purchase_orders', array('id' => $id));
    }

    function data_for_purchase($id, $stock)
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

		$this->db->from('purchase_order_details');
		$this->db->join('product_details', 'purchase_order_details.product_detail_id = product_details.id');
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
			$this->db->where('purchase_order_details.arrived_quantity < purchase_order_details.quantity', NULL, FALSE);
		}

		$this->db->where('purchase_order_details.purchase_order_id', $id);

		$this->db->order_by('products.description ASC, size.description ASC');

		$query = $this->db->get();

		return $query->result();
	}
}
