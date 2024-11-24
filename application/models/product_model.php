<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Product_model extends CI_Model {

	var $description = '';
	var $brand_id = '';
	var $category_id = '';
	var $subcategory_id = '';
	var $uses_id = '';
	var $ages_id = '';
	var $measurement = '';
	var $regime = '';
	var $currency_id = '';
	var $currency_cost = '';
	var $code = '';
	var $description2 = '';
	var $cost = '';
	var $replenishment_cost = '';
	var $last_input = '';
	var $last_output = '';
	var $profit_margin = '';
	var $min_profit_margin = '';
	var $consignment = '';
	var $comments = '';
	var $barcode = '';
	var $image = '';

	function __construct()
    {
        parent::__construct();
    }
	function get($id) {
		try {
			$this->db->from('products');
			$this->db->where('id', $id);
			$data = $this->db->get();

			if ($data->num_rows() > 0) {
				return $data->row();
			} else {
				return FALSE;
			}
		} catch (Exception $e) {
			echo "ERROR: ".$e->getMessage();
		}
	}

	function getProducts()
	{
		try {
			$this->db->select('p.id, p.description, b.description as marca,c.description as category,s.description as subcategory');
			$this->db->from('products p');
			//$this->db->where('id',$id);
			$this->db->join('brands b', 'b.id = p.brand_id');
			$this->db->join('categories c', 'c.id = p.category_id');
			$this->db->join('subcategories s', 's.id = p.subcategory_id');
			$data = $this->db->get();

			if ($data->num_rows() > 0) {
				return $data->result();
			} else {
				return FALSE;
			}
		} catch (Exception $e) {
			echo "ERROR: ".$e->getMessage();
		}
	}

	function get_by_id($id) {
		$this->db->select('
			products.id as id,
			products.code as code,
			regime,
			output_statement,
			products.description,
			brands.id as brand_id,
			brands.description as brand,
			subcategories.id as subcategory_id,
			subcategories.description as subcategory,
			categories.id as category_id,
			categories.description as category,
			uses.id as use_id,
			uses.description as use,
			ages.id as age_id,
			ages.description as age,
			genders.id as gender_id,
			genders.description as gender,
			measurements.id as measurement_id,
			measurements.code as measurement_code,
			measurements.description as measurement,
			currencies.description as currency,
			currency_cost,
			description2,
			cost,
			replenishment_cost,
			last_input,
			last_output,
			profit_margin,
			min_profit_margin,
			consignment,
			comments,
			products.image,
			price,
			products.active
		');
		//$this->db->from('products');
		
		//$this->db->limit(1);

		
		$this->db->from('products');
		$this->db->join('brands', 'products.brand_id = brands.id', 'left');
		$this->db->join('categories', 'products.category_id = categories.id', 'left');
		$this->db->join('subcategories', 'products.category_id = subcategories.id', 'left');
		$this->db->join('uses', 'products.uses_id = uses.id', 'left');
		$this->db->join('ages', 'products.ages_id = ages.id', 'left');
		$this->db->join('genders', 'products.gender_id = genders.id', 'left');
		$this->db->join('measurements', 'products.measurement_id = measurements.id', 'left');
		$this->db->join('currencies', 'products.currency_id = currencies.id', 'left');
		$this->db->where('products.id', $id);
		//falta discriminar el precio de empresa ojo // <-- WHAT?
	
		$query = $this->db->get();

		if ($query->num_rows() === 0) {
			return FALSE;
		} else {
			return $query->result();
		}
	}

	function getProductCost($id) {
		try {
			$this->db->select('pd.id, pd.product_id, c.name as company, pd.price, pd.cost, pd.offer_price, pd.invoice_currency, pd.invoice_cost, pd.cost_currency');
			$this->db->from('product_details pd');
			$this->db->where('product_id',$id);
			$this->db->join('companies c', 'c.id = pd.company_id');
			$data = $this->db->get();

			if ($data->num_rows() > 0) {
				return $data->result();
			} else {
				return FALSE;
			}
		} catch (Exception $e) {
			echo "ERROR: ".$e->getMessage();
		}
	}

	function getProductSizes($id) {
		try {

			$this->db->select('pd.id, pd.product_id, c.name as company, pb.old_barcode, pb.barcode, s.id, s.description as talla, st.store_stock as stock, b.alias as almacen');
			$this->db->from('product_details pd');
			$this->db->where('product_id',$id);
			$this->db->join('companies c', 'c.id = pd.company_id');
			$this->db->join('product_barcodes pb', 'pd.id = pb.product_detail_id');
			$this->db->join('size s', 's.id = pb.size_id');
			$this->db->join('stock st', 'st.product_barcode_id = pb.id');
			$this->db->join('branches b', 'st.branch_id = b.id');
			$this->db->order_by('s.description', 'DESC');
			$data = $this->db->get();

			if ($data->num_rows() > 0) {
				return $data->result();
			} else {
				return FALSE;
			}
		} catch (Exception $e) {
			echo "ERROR: ".$e->getMessage();
		}
	}

	function get_for_sale($barcode, $company_id = NULL, $regime = NULL, $branch_id = NULL) {
		if (is_null($branch_id)) {
			$branch_id = $this->session->userdata('user_branch');
		}

		$this->db->select('
			product_barcodes.id AS id,
			products.id AS product_id,
			product_details.id AS product_detail_id,
			products.code,
			products.description,
			product_barcodes.barcode,
			size.id AS size_id,
			size.description AS size,
			products.regime,
			product_details.offer_price,
			product_details.price,
			product_details.cost,
			brands.description AS brand,
			output_statement,
			COALESCE(stock.store_stock, 0) AS stock,
			product_details.company_id,
			companies.name AS company_name
		', FALSE);

		$this->db->from('products');
		$this->db->join('product_details', 'products.id = product_details.product_id', 'left');
		$this->db->join('product_barcodes', 'product_details.id = product_barcodes.product_detail_id', 'left');
		$this->db->join('size', 'product_barcodes.size_id = size.id', 'left');
		$this->db->join('brands', 'products.brand_id = brands.id', 'left');
		$this->db->join('stock', 'product_barcodes.id = stock.product_barcode_id', 'left');
		$this->db->join('companies', 'product_details.company_id = companies.id', 'left');
		//falta discriminar el precio de empresa ojo // <-- WHAT?
		$this->db->where('stock.branch_id', $branch_id);
		$this->db->where("(product_barcodes.barcode ILIKE '%$barcode' OR product_barcodes.old_barcode ILIKE '%$barcode')");

		if (!is_null($company_id)) {
			$this->db->where('product_details.company_id', $company_id);
		}

		if (!is_null($regime)) {
			$this->db->where('products.regime', $regime);
		}

		//$this->db->limit(1);

		$query = $this->db->get();

		if ($query->num_rows() === 0) {
			return FALSE;
		} else {
			return $query->result();
		}
	}

	function get_list_for_sale($start, $limit, $terms = NULL, $filters = NULL, $company_id = NULL, $regime = NULL)
	{
		$branch_id = $this->session->userdata('user_branch');

		$this->db->select("
			product_barcodes.id AS id,
			products.id AS product_id,
			product_details.id AS product_detail_id,
			products.code,
			products.description,
			product_barcodes.barcode,
			size.id AS size_id,
			size.description AS size,
			products.regime,
			product_details.offer_price,
			product_details.price,
			product_details.cost,
			brands.description AS brand,
			output_statement,
			COALESCE(stock.store_stock, 0) AS stock,
			product_details.company_id,
			companies.name AS company_name
		", FALSE);

		$this->db->from('products');
		$this->db->join('product_details', 'products.id = product_details.product_id', 'left');
		$this->db->join('product_barcodes', 'product_details.id = product_barcodes.product_detail_id', 'left');
		$this->db->join('size', 'product_barcodes.size_id = size.id', 'left');
		$this->db->join('brands', 'products.brand_id = brands.id');
		$this->db->join('stock', 'product_barcodes.id = stock.product_barcode_id');
		$this->db->join('companies', 'product_details.company_id = companies.id');

		$this->db->limit($limit, $start);
		$this->db->order_by('products.description ASC');

		$this->db->where('products.active', 't');
		$this->db->where('stock.branch_id', $branch_id);

		if (!is_null($company_id)) {
			$this->db->where('product_details.company_id', $company_id);
		}

		if (!is_null($regime)) {
			$this->db->where('products.regime', $regime);
		}

		if (!is_null($terms)) {
			$this->db->where("(product_barcodes.barcode ILIKE '%$terms%' OR products.code ILIKE '%$terms%' OR products.description ILIKE '%$terms%' OR size.description ILIKE '%$terms%')");
		}

		if (!is_null($filters)) {
			array_walk($filters, function ($item, $key) {
            	$this->db->where($item['key'], $item['value']);
			});
        }

		$query = $this->db->get();

		if ($query->num_rows() > 0) {
			$data = $query->result_array();

			$this->db->from('products');
			$this->db->join('product_details', 'products.id = product_details.product_id', 'left');
			$this->db->join('product_barcodes', 'product_details.id = product_barcodes.product_detail_id', 'left');
			$this->db->join('size', 'product_barcodes.size_id = size.id', 'left');
			$this->db->join('stock', 'product_barcodes.id = stock.product_barcode_id');

			$this->db->where('products.active', 't');
			$this->db->where('stock.branch_id', $branch_id);

			if (!is_null($company_id)) {
				$this->db->where('product_details.company_id', $company_id);
			}

			if (!is_null($regime)) {
				$this->db->where('products.regime', $regime);
			}

			if (!is_null($terms)) {
				$this->db->where("(product_barcodes.barcode ILIKE '%$terms%' OR products.code ILIKE '%$terms%' OR products.description ILIKE '%$terms%' OR size.description ILIKE '%$terms%')");
			}

			if (!is_null($filters)) {
	            array_walk($filters, function ($item, $key) {
	            	$this->db->where($item['key'], $item['value']);
				});
	        }

			array_unshift($data, $this->db->count_all_results());

			return $data;
		} else {
			return array(0);
		}
	}
	function update($id, $product) {
		
		$this->db->update('products', $product, array('id' => $id));

		return $this->db->affected_rows() > 0;     
	}

	function search($term, $page = 1, $display = 10) {
		$result = array();

		$this->_search($term);

		$result['total_count'] = $this->db->count_all_results();

		if ($result['total_count'] > 0) {
			$this->db->select("
				products.id,
				products.code,
				products.description,
				products.regime
			", FALSE);

			$this->_search($term);

			$this->db->limit($display, ($page - 1) * $display);
			$this->db->order_by('products.description ASC');

			$query = $this->db->get();

			$result['items'] = $query->result_array();
		} else {
			$result['items'] = array();
		}

		return $result;
	}

	private function _search($term) {
		$this->db->from('products');

		$this->db->where('products.active', 't');
		$this->db->where("(products.code ILIKE '%$term%' OR products.description ILIKE '%$term%')");
	}

	function search_for_offer($term, $company, $regime, $page = 1, $display = 10) {
		$this->db->select("
			products.id AS product_id,
			products.code,
			products.description,
			products.regime,
			products.output_statement,
			product_details.id AS id,
			product_details.offer_price,
			product_details.price,
			product_details.cost,
			product_details.company_id
		", FALSE);

		$this->db->from('products');
		$this->db->join('product_details', 'products.id = product_details.product_id');

		$this->db->limit($display, ($page - 1) * $display);
		$this->db->order_by('products.description ASC');

		$this->db->where('products.active', 't');
		$this->db->where("(products.code ILIKE '%$term%' OR products.description ILIKE '%$term%')");
		$this->db->where('product_details.company_id', $company);
		$this->db->where('products.regime', $regime);

		$query = $this->db->get();

		if ($query->num_rows() > 0) {
			$data = $query->result_array();

			$this->db->from('products');
			$this->db->join('product_details', 'products.id = product_details.product_id');

			$this->db->where('products.active', 't');
			$this->db->where("(products.code ILIKE '%$term%' OR products.description ILIKE '%$term%')");
			$this->db->where('product_details.company_id', $company);
			$this->db->where('products.regime', $regime);

			return array(
				'total_count' => $this->db->count_all_results(),
				'items' => $data
			);
		} else {
			return array(
				'total_count' => 0,
				'items' => array()
			);
		}
	}

	### MIGRADO
	function get_for_purchase_template($only_active = TRUE, $group_by = NULL) {
		$this->db->select('
			products.id,
			product_barcodes.id AS pd_id,
			products.code,
			products.description,
			product_barcodes.barcode,
			size.id AS size_id,
			size.description AS size,
			products.regime,
			brands.description AS brand,
			products.output_statement,
			categories.description AS type,
			uses.description AS line,
			ages.description AS age,
			genders.description AS gender
		');

		$this->db->from('products');
		$this->db->join('product_details', 'products.id = product_details.product_id', 'left');
		$this->db->join('product_barcodes', 'product_details.id = product_barcodes.product_detail_id', 'left');
		$this->db->join('size', 'product_barcodes.size_id = size.id', 'left');
		$this->db->join('brands', 'products.brand_id = brands.id');
		$this->db->join('categories', 'products.category_id = categories.id', 'left');
		$this->db->join('uses', 'products.uses_id = uses.id', 'left');
		$this->db->join('ages', 'products.ages_id = ages.id', 'left');
		$this->db->join('genders', 'products.gender_id = genders.id', 'left');
		//$this->db->join('product_values', 'product_values.product_id = products.id');
		//$this->db->join('stock', 'product_details.id = stock.product_detail_id');
		//falta discriminar el precio de empresa ojo

		//$this->db->where('stock.branch_id', $branch_id);

		if ($only_active) {
			$this->db->where('products.active', 't');
		}

		$order_by = '';

		if ($group_by === 'category') {
			$order_by = 'categories.description ASC, ';
		} elseif ($group_by === 'brand') {
			$order_by = 'brands.description ASC, ';
		}

		$order_by .= 'products.description ASC';

		$this->db->order_by($order_by);

		$query = $this->db->get();

		if ($query->num_rows() === 0) {
			return FALSE;
		} else {
			return $query->result();
		}
	}

	function data_for_purchase_order($active, $company = NULL, $regime = NULL, $group_by = NULL, $filters = NULL)
	{
		$this->db->select('
			products.code,
			products.description,
			products.regime,
			brands.description AS brand,
			categories.description AS line,
			subcategories.description AS type,
			uses.description AS use,
			ages.description AS age,
			genders.description AS gender
		');

		$this->db->from('products');
		$this->db->join('brands', 'products.brand_id = brands.id');
		$this->db->join('categories', 'products.category_id = categories.id', 'left');
		$this->db->join('subcategories', 'products.subcategory_id = subcategories.id', 'left');
		$this->db->join('uses', 'products.uses_id = uses.id', 'left');
		$this->db->join('ages', 'products.ages_id = ages.id', 'left');
		$this->db->join('genders', 'products.gender_id = genders.id', 'left');

		if (!empty($company)) {
			$this->db->join('product_details', 'products.id = product_details.product_id', 'left');
			$this->db->where('product_details.company_id', $company);
		}

		if (!empty($regime)) {
			$this->db->where('products.regime', $regime);
		}

		if ($active) {
			$this->db->where('products.active', 't');
		}

		if (!empty($filters)) {
			foreach ($filters as $name => $values) {
				$this->db->where("($name.id = " . implode(" OR $name.id = ", $values) . ")");
			}
		}

		if (!empty($group_by)) {
			$order_by = "$group_by.description ASC, products.description ASC";
		} else {
			$order_by = 'products.description ASC';
		}

		$this->db->order_by($order_by);

		$query = $this->db->get();

		return $query->result();
	}

	function data_for_purchase($active, $stock, $company = NULL, $regime = NULL, $filters = NULL)
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

		$this->db->from('products');
		$this->db->join('product_details', 'products.id = product_details.product_id', 'left');
		$this->db->join('product_barcodes', 'product_details.id = product_barcodes.product_detail_id');
		$this->db->join('size', 'product_barcodes.size_id = size.id');
		$this->db->join('brands', 'products.brand_id = brands.id');
		$this->db->join('categories', 'products.category_id = categories.id', 'left');
		$this->db->join('subcategories', 'products.subcategory_id = subcategories.id', 'left');
		$this->db->join('uses', 'products.uses_id = uses.id', 'left');
		$this->db->join('ages', 'products.ages_id = ages.id', 'left');
		$this->db->join('genders', 'products.gender_id = genders.id', 'left');

		if (!empty($company)) {
			//$this->db->join('product_details', 'products.id = product_details.product_id', 'left');
			$this->db->where('product_details.company_id', $company);
		}

		if (!empty($regime)) {
			$this->db->where('products.regime', $regime);
		}

		if ($stock) {
			$branch_id = $this->session->userdata('user_branch');

			$this->db->join('stock', 'product_barcodes.id = stock.product_barcode_id');
			$this->db->where('stock.store_stock > 0', NULL, FALSE);
			$this->db->where('stock.branch_id', $branch_id);
		}

		if ($active) {
			$this->db->where('products.active', 't');
		}

		if (!empty($filters)) {
			foreach ($filters as $name => $values) {
				$this->db->where("($name.id = " . implode(" OR $name.id = ", $values) . ")");
			}
		}

		if (!empty($group_by)) {
			$order_by = "$group_by.description ASC, products.description ASC";
		} else {
			$order_by = 'products.description ASC';
		}

		$this->db->order_by($order_by);

		$query = $this->db->get();

		return $query->result();
	}

	### MIGRADO
	function get_for_template($for = NULL, $active = TRUE, $group_by = NULL, $company = NULL, $filters = NULL) {
		$this->db->select('
			products.id,
			product_barcodes.id AS pd_id,
			products.code,
			products.description,
			product_barcodes.barcode,
			size.id AS size_id,
			size.description AS size,
			products.regime,
			brands.description AS brand,
			products.output_statement,
			categories.description AS line,
			subcategories.description AS type,
			uses.description AS use,
			ages.description AS age,
			genders.description AS gender
		');

		$this->db->from('products');
		$this->db->join('product_details', 'products.id = product_details.product_id', 'left');
		$this->db->join('product_barcodes', 'product_details.id = product_barcodes.product_detail_id', 'left');
		$this->db->join('size', 'product_barcodes.size_id = size.id', 'left');
		$this->db->join('brands', 'products.brand_id = brands.id');
		$this->db->join('categories', 'products.category_id = categories.id', 'left');
		$this->db->join('subcategories', 'products.subcategory_id = subcategories.id', 'left');
		$this->db->join('uses', 'products.uses_id = uses.id', 'left');
		$this->db->join('ages', 'products.ages_id = ages.id', 'left');
		$this->db->join('genders', 'products.gender_id = genders.id', 'left');
		//$this->db->join('product_values', 'product_values.product_id = products.id');
		//$this->db->join('stock', 'product_details.id = stock.product_detail_id');
		//falta discriminar el precio de empresa ojo

		//$this->db->where('stock.branch_id', $branch_id);

		if (!empty($company)) {
			$this->db->join('product_values', 'products.id = product_values.product_id', 'left');
			$this->db->where('product_values.company_id', $company);
		}

		if ($active) {
			$this->db->where('products.active', 't');
		}

		if (!empty($filters)) {
			foreach ($filters as $filter_name => $filter_value) {
				$this->db->where("$filter_name.id", $filter_value);
			}
		}

		$order_by = '';

		if ($group_by === 'category') {
			$order_by = 'categories.description ASC, ';
		} elseif ($group_by === 'brand') {
			$order_by = 'brands.description ASC, ';
		}

		$order_by .= 'products.description ASC';

		$this->db->order_by($order_by);

		$query = $this->db->get();

		if ($query->num_rows() === 0) {
			return FALSE;
		} else {
			return $query->result();
		}
	}

	public function data_for_temporal_stock()
	{
		$query = $this->db->query('
			SELECT stock.id,
			stock.product_barcode_id,
			products.code,
			size.description AS size,
			product_barcodes.old_barcode,
			products.regime,
			products.description,
			stock.store_stock,
			categories.description AS linea,
			subcategories.description AS tipo,
			brands.description AS marca,
			uses.description AS deporte,
			genders.description AS genero,
			ages.description AS edad
			FROM stock
			INNER JOIN product_barcodes ON product_barcodes.id = stock.product_barcode_id
			INNER JOIN size ON "size".id = product_barcodes.size_id
			INNER JOIN product_details ON product_details.id = product_barcodes.product_detail_id
			INNER JOIN products ON products.id = product_details.product_id
			LEFT JOIN brands ON brands.id = products.brand_id
			LEFT JOIN categories ON categories.id = products.category_id
			LEFT JOIN subcategories ON subcategories.id = products.subcategory_id
			LEFT JOIN uses ON uses."id" = products.uses_id
			LEFT JOIN genders ON genders.id = products.gender_id
			LEFT JOIN ages ON ages.id = products.ages_id
			WHERE stock.store_stock > 0
			ORDER BY products.description ASC, size.description ASC, stock.id ASC
		');

		return $query->result_array();
	}

	function group_list_for_template($group_by) {
		$this->db->select('description');
		$this->db->where('active', 't');

		if ($group_by === 'category') {
			$this->db->from('categories');
		} elseif ($group_by === 'brand') {
			$this->db->from('brands');
		}

		$this->db->order_by('description ASC');

		$query = $this->db->get();

		if ($query->num_rows() === 0) {
			return FALSE;
		} else {
			$result = array();

			for ($i = 0; $i < $query->num_rows(); $i++) {
				$result[] = $query->row($i)->description;
			}

			return $result;
		}
	}

	function verify_for_purchase_order($company_id)
	{
		$codes = explode(',', $this->input->post('codes'));
		$branch_id = $this->session->userdata('user_branch');

		// pd.id,
		// CASE WHEN COUNT(s.id) > 0 THEN COUNT(s.id) ELSE NULL END AS stock_id,
		$query = $this->db->query("
			SELECT
				pd.id AS product_detail_id,
				p.id AS product_id,
				p.code,
				pd.invoice_cost,
				pd.invoice_currency,
				pd.cost,
				pd.cost_currency,
				SUM(s.store_stock) AS store_stock
			FROM products p
			LEFT OUTER JOIN product_details pd ON p.id = pd.product_id AND pd.company_id = $company_id
			LEFT OUTER JOIN product_barcodes pb ON pd.id = pb.product_detail_id
			LEFT OUTER JOIN stock s ON pb.id = s.product_barcode_id AND s.branch_id = $branch_id
			WHERE (p.code = '" . implode("' OR p.code = '", $codes) . "')
			GROUP BY pd.id, p.id, pd.price, pd.cost, pd.offer_price, p.code
		");

		return $query->result_array();
	}

	function verify_for_purchase($company_id)
	{
		$codes = explode(',', $this->input->post('codes'));

		$branch_id = $this->session->userdata('user_branch');

		$query = $this->db->query("
			SELECT
				pd.id AS product_detail_id,
				p.id AS product_id,
				p.code,
				pd.invoice_cost,
				pd.invoice_currency,
				pd.cost,
				pd.cost_currency,
				pb.size_id,
				si.description AS size,
				pb.id AS product_barcode_id,
				s.id AS stock_id,
				s.store_stock
			FROM products p
			LEFT OUTER JOIN product_details pd ON p.id = pd.product_id AND pd.company_id = $company_id
			LEFT OUTER JOIN product_barcodes pb ON pd.id = pb.product_detail_id
			LEFT OUTER JOIN size si ON pb.size_id = si.id
			LEFT OUTER JOIN stock s ON pb.id = s.product_barcode_id AND s.branch_id = $branch_id
			WHERE (p.code = '" . implode("' OR p.code = '", $codes) . "')
		");

		return $query->result_array();
	}

	function get_single_tables()
	{
		$query = $this->db->query('SELECT get_tables_for_products() AS records');

		return $query->result_array();
	}

	public function save_single_tables()
	{
		if (is_array($this->input->post('categories'))) {
			$categories = "'" . implode("','", $this->input->post('categories')) . "'";
		} else {
			$categories = '';
		}

		if (is_array($this->input->post('genders'))) {
			$genders = "'" . implode("','", $this->input->post('genders')) . "'";
		} else {
			$genders = '';
		}

		if (is_array($this->input->post('ages'))) {
			$ages = "'" . implode("','", $this->input->post('ages')) . "'";
		} else {
			$ages = '';
		}

		if (is_array($this->input->post('uses'))) {
			$uses = "'" . implode("','", $this->input->post('uses')) . "'";
		} else {
			$uses = '';
		}

		if (is_array($this->input->post('brands'))) {
			$brands = "'" . implode("','", $this->input->post('brands')) . "'";
		} else {
			$brands = '';
		}

		if (is_array($this->input->post('subcategories'))) {
			$subcategories = "'" . implode("','", $this->input->post('subcategories')) . "'";
		} else {
			$subcategories = '';
		}

		if (is_array($this->input->post('sizes'))) {
			$sizes = "'" . implode("','", $this->input->post('sizes')) . "'";
		} else {
			$sizes = '';
		}

		$query = $this->db->query("
			SELECT save_single_tables(
				ARRAY[$categories]::CHARACTER VARYING[],
				ARRAY[$genders]::CHARACTER VARYING[],
				ARRAY[$ages]::CHARACTER VARYING[],
				ARRAY[$uses]::CHARACTER VARYING[],
				ARRAY[$brands]::CHARACTER VARYING[],
				ARRAY[$subcategories]::CHARACTER VARYING[],
				ARRAY[$sizes]::CHARACTER VARYING[]
			) AS result
		");

		return $query->result_array();
	}

	function verify_for_transfer($company_id, $branch_id)
	{
		$codes = explode(',', $this->input->post('codes'));
		
		$query = $this->db->query("
			SELECT
				pd.id AS product_detail_id,
				p.id AS product_id,
				p.code,
				pd.invoice_cost,
				pd.invoice_currency,
				pd.cost,
				pd.cost_currency,
				pb.size_id,
				si.description AS size,
				pb.id AS product_barcode_id,
				s.id AS stock_id,
				s.store_stock
			FROM products p
			LEFT OUTER JOIN product_details pd ON p.id = pd.product_id AND pd.company_id = $company_id
			LEFT OUTER JOIN product_barcodes pb ON pd.id = pb.product_detail_id
			LEFT OUTER JOIN size si ON pb.size_id = si.id
			LEFT OUTER JOIN stock s ON pb.id = s.product_barcode_id AND s.branch_id = $branch_id
			WHERE (p.code = '" . implode("' OR p.code = '", $codes) . "')
		");

		return $query->result_array();
	}
	
	function get_stocks($display, $page, $order = NULL, $filters = NULL)
	{
		$result = array(
			'page' => intval($page)
		);
		
		$size_grouped = FALSE;

		$this->_get_stocks($filters, $size_grouped);

		if ($size_grouped) {
			$this->db->select("
				COUNT(DISTINCT (products.id, product_details.id, companies.id, brands.id)) AS numrows,
				SUM(stock.store_stock) AS total_stock
			", FALSE);
		} else {
			$this->db->select("
				COUNT(*) AS numrows,
				SUM(stock.store_stock) AS total_stock
			", FALSE);
		}

		$query = $this->db->get();
		
		if ($query->num_rows() > 0) {
			$row = $query->row();

			$result['total_count'] = intval($row->numrows);
			$result['extra'] = array(
				'total_stock' => intval($row->total_stock)
			);
		} else {
			$result['total_count'] = 0;
		}
		
		if ($result['total_count'] > 0) {
			$this->db->select("
				products.code,
				products.description AS product,
				products.regime,
				companies.name AS company,
				brands.description AS brand,
				product_details.cost_currency,
				product_details.cost,
				product_details.invoice_currency,
				product_details.invoice_cost
			", FALSE);

			if ($size_grouped) {
				$this->db->select('SUM(stock.store_stock) AS current_stock', FALSE);

				$this->db->group_by(array('products.id', 'product_details.id', 'companies.id', 'brands.id'));
			} else {
				$this->db->select("
					stock.store_stock AS current_stock,
					size.description AS product_size
				", FALSE);

				//$this->db->group_by(array('stock.id', 'companies.id', 'size.id', 'products.id', 'product_details.id', 'brands.id'));
			}

			$this->_get_stocks($filters, $size_grouped);

			$this->db->limit($display, ($page - 1) * $display);

			if (!is_null($order)) {
				$this->db->order_by("$order, products.id asc");
			}

			$query = $this->db->get();

			$result['items'] = $query->result_array();
		} else {
			$result['items'] = array();
		}
		
		return $result;
	}

	function _get_stocks($filters, &$size_grouped)
	{
		$branch_id = $this->session->userdata('user_branch');

		$this->db->from('stock');
		$this->db->join('product_barcodes', 'stock.product_barcode_id = product_barcodes.id');
		$this->db->join('product_details', 'product_barcodes.product_detail_id = product_details.id');
		$this->db->join('companies', 'product_details.company_id = companies.id');
		$this->db->join('products', 'product_details.product_id = products.id');
		$this->db->join('brands', 'products.brand_id = brands.id', 'left');
		
		$this->db->where('stock.branch_id', $branch_id);
		
		if (!is_null($filters)) {
			foreach ($filters as $filter) {
				foreach ($filter as $name => $query) {
					switch ($name) {
						/*case ':':
							foreach ($query as $value) {
								$this->db->where("(products.description ILIKE '%$value%' OR products.code ILIKE '%$value%')");
							}
							break;*/
						case 'product':
							$this->db->where("products.description ILIKE '%$query%'");
							break;
						case 'code':
							$this->db->where("products.code ILIKE '%$query%'");
							break;
						case 'regime':
							$this->db->where('products.regime', $query);
							break;
						case 'company':
							$this->db->where('companies.id', $query);
							break;
						case 'invoice_currency':
							$this->db->where('product_details.invoice_currency', $query);
							break;
						case 'cost_currency':
							$this->db->where('product_details.cost_currency', $query);
							break;
						case 'stock':
							$this->db->where('stock.store_stock >', 0);
							break;
						case 'brand':
							$this->db->where('brands.id', $query);
							break;
						case 'size':
							$this->db->where("size.description ILIKE '%$query%'");
							break;
						case 'group':
							$size_grouped = TRUE;
							break;
					}
				}
			}
		}

		if (!$size_grouped) {
			$this->db->join('size', 'product_barcodes.size_id = size.id');
		}
	}
	
	function get_initial_stocks($year)
	{
		if (is_null($year)) {
			$year = intval(date('Y'));
		}
		
		$display = (empty($this->input->get('display')) ? 10 : $this->input->get('display'));
		$page = (empty($this->input->get('page')) ? 1 : $this->input->get('page'));
		/*$order = (empty($this->input->get('order')) ? NULL : $this->input->get('order'));
		$size_grouped = $this->input->get('size_grouped') !== FALSE;
		$has_stock = !empty($this->input->get('has_stock'));*/
		//$result = array('page' => $page);
		
		$this->_get_initial_stocks($year);
		
		$result = array(
			'page' => $page,
			'total_count' => $this->db->count_all_results()
		);
		
		if ($result['total_count'] > 0) {
			$this->db->select("
				branch_details.company_id,
				initial_stocks.product_id,
				initial_stocks.store_stock
			", FALSE);
			
			$this->_get_initial_stocks($year);
			
			$this->db->limit($display, ($page - 1) * $display);
			
			/*
			if ($size_grouped) {
				$this->db->group_by(array('initial_stocks.product_id', 'branch_details.company_id'));
			} else {
				$this->db->group_by(array('initial_stocks.product_id', 'branch_details.company_id', 'product_barcodes.size_id'));
			}
			*/

			$query = $this->db->get();

			$result['items'] = $query->result_array();
		} else {
			$result['items'] = array();
		}
		
		return $result;
	}
	
	function _get_initial_stocks($year)
	{
		$branch_id = $this->session->userdata('user_branch');
		
		$this->db->from('initial_stocks');
		$this->db->join('branch_details',  'initial_stocks.branch_detail_id = branch_details.id');
		
		/*
		if (!$size_grouped) {
			$this->db->join('stock', 'branch_details.branch_id = stock.branch_id');
			$this->db->join('product_barcodes', 'stock.product_barcode_id = product_barcodes.id');
		}
		*/
		
        $this->db->where('initial_stocks.store_stock > 0');
		$this->db->where('initial_stocks.year', $year);
		$this->db->where('branch_details.branch_id', $branch_id);
	}
	
	function get_summary_sales($year, $month)
	{
		if (is_null($year)) {
			$year = intval(date('Y'));
		}
		
		$display = (empty($this->input->get('display')) ? 10 : $this->input->get('display'));
		$page = (empty($this->input->get('page')) ? 1 : $this->input->get('page'));
		/*$order = (empty($this->input->get('order')) ? NULL : $this->input->get('order'));
		$has_stock = !empty($this->input->get('has_stock'));*/
		$size_grouped = $this->input->get('size_grouped') !== FALSE;
		$result = array('page' => $page);
		
		$this->_get_summary_sales($year, $month);
		
		if ($size_grouped) {
			$this->db->select("
				COUNT(DISTINCT (product_details.product_id, sales.company_id)) AS numrows
			", FALSE);
		} else {
			$this->db->select("
				COUNT(DISTINCT (product_details.product_id, sales.company_id, product_barcodes.size_id)) AS numrows
			", FALSE);
		}
		
		$query = $this->db->get();
			
		if ($query->num_rows() > 0) {
			$result['total_count'] = intval($query->row()->numrows);
		} else {
			$result['total_count'] = 0;
		}
		
		if ($result['total_count'] > 0) {
			$this->db->select("
                product_details.product_id,
                sales.company_id,
                SUM(sale_details.quantity) AS quantity
            ", FALSE);
            
            $this->_get_summary_sales($year, $month);
            
            $this->db->limit($display, ($page - 1) * $display);
            
            if ($size_grouped) {
            	$this->db->group_by(array('product_details.product_id', 'sales.company_id'));
            } else {
            	$this->db->select('product_barcodes.size_id', FALSE);
            	
            	$this->db->group_by(array('product_details.product_id', 'sales.company_id', 'product_barcodes.size_id'));
            }
            
            $query = $this->db->get();
            
            if ($query->num_rows() > 0) {
            	$result['items'] = $query->result_array();
            } else {
            	$result['items'] = array();
            }
		} else {
			$result['items'] = array();
		}
		
		return $result;
	}
	
	function _get_summary_sales($year, $month)
	{
		$branch_id = $this->session->userdata('user_branch');
		
		$this->db->from('sale_details');
        $this->db->join('sales', 'sale_details.sale_id = sales.id');
        $this->db->join('product_barcodes', 'sale_details.product_barcode_id = product_barcodes.id');
        $this->db->join('product_details', 'product_barcodes.product_detail_id = product_details.id');

        $this->db->where('sales.active', 't');
        $this->db->where('sales.state !=', 'CANCELED');
        $this->db->where('sales.branch_id', $branch_id);
        $this->db->where('sales.voucher::TEXT', "ANY(VALUES ('TICKET'), ('BOLETA'), ('FACTURA'))", FALSE);
        $this->db->where('EXTRACT(YEAR FROM sales.sale_date) =', $year);

        if ($month > 0) {
        	$this->db->where('EXTRACT(MONTH FROM sales.sale_date) <=', $month);
        }
	}
	
	function get_summary_refunds($year, $month)
	{
		if (is_null($year)) {
			$year = intval(date('Y'));
		}
		
		$display = (empty($this->input->get('display')) ? 10 : $this->input->get('display'));
		$page = (empty($this->input->get('page')) ? 1 : $this->input->get('page'));
		$size_grouped = $this->input->get('size_grouped') !== FALSE;
		$result = array('page' => $page);
		
		$this->_get_summary_refunds($year, $month);
		
		if ($size_grouped) {
			$this->db->select("
				COUNT(DISTINCT (product_details.product_id, sales.company_id)) AS numrows
			", FALSE);
		} else {
			$this->db->select("
				COUNT(DISTINCT (product_details.product_id, sales.company_id, product_barcodes.size_id)) AS numrows
			", FALSE);
		}
		
		$query = $this->db->get();
			
		if ($query->num_rows() > 0) {
			$result['total_count'] = intval($query->row()->numrows);
		} else {
			$result['total_count'] = 0;
		}
		
		if ($result['total_count'] > 0) {
			$this->db->select("
                product_details.product_id,
                sales.company_id,
                SUM(sale_details.quantity) AS quantity
            ", FALSE);
            
            $this->_get_summary_refunds($year, $month);
            
            $this->db->limit($display, ($page - 1) * $display);
            
            if ($size_grouped) {
            	$this->db->group_by(array('product_details.product_id', 'sales.company_id'));
            } else {
            	$this->db->select('product_barcodes.size_id', FALSE);
            	
            	$this->db->group_by(array('product_details.product_id', 'sales.company_id', 'product_barcodes.size_id'));
            }
            
            $query = $this->db->get();
            
            if ($query->num_rows() > 0) {
            	$result['items'] = $query->result_array();
            } else {
            	$result['items'] = array();
            }
		} else {
			$result['items'] = array();
		}
		
		return $result;
	}
	
	function _get_summary_refunds($year, $month)
	{
		$branch_id = $this->session->userdata('user_branch');
		
		$this->db->from('sale_details');
        $this->db->join('sales', 'sale_details.sale_id = sales.id');
        $this->db->join('product_barcodes', 'sale_details.product_barcode_id = product_barcodes.id');
        $this->db->join('product_details', 'product_barcodes.product_detail_id = product_details.id');

        $this->db->where('sales.active', 't');
        $this->db->where('sales.state !=', 'CANCELED');
        $this->db->where('sales.branch_id', $branch_id);
        $this->db->where('sales.voucher::TEXT', "ANY(VALUES ('NOTA DE CREDITO'), ('TICKET NOTA DE CREDITO'))", FALSE);
        $this->db->where('EXTRACT(YEAR FROM sales.sale_date) =', $year);

        if ($month > 0) {
        	$this->db->where('EXTRACT(MONTH FROM sales.sale_date) <=', $month);
        }
	}
	
	function get_summary_purchases($year, $month)
	{
		if (is_null($year)) {
			$year = intval(date('Y'));
		}
		
		$display = (empty($this->input->get('display')) ? 10 : $this->input->get('display'));
		$page = (empty($this->input->get('page')) ? 1 : $this->input->get('page'));
		$size_grouped = $this->input->get('size_grouped') !== FALSE;
		$result = array('page' => $page);
		
		$this->_get_summary_purchases($year, $month);
		
		if ($size_grouped) {
			$this->db->select("
				COUNT(DISTINCT (product_details.product_id, branch_details.company_id)) AS numrows
			", FALSE);
		} else {
			$this->db->select("
				COUNT(DISTINCT (product_details.product_id, branch_details.company_id, product_barcodes.size_id)) AS numrows
			", FALSE);
		}
		
		$query = $this->db->get();
			
		if ($query->num_rows() > 0) {
			$result['total_count'] = intval($query->row()->numrows);
		} else {
			$result['total_count'] = 0;
		}
		
		if ($result['total_count'] > 0) {
			$this->db->select("
                product_details.product_id,
                branch_details.company_id,
                SUM(purchase_details.quantity) AS quantity
            ", FALSE);
            
            $this->_get_summary_purchases($year, $month);
            
            $this->db->limit($display, ($page - 1) * $display);
            
            if ($size_grouped) {
            	$this->db->group_by(array('product_details.product_id', 'branch_details.company_id'));
            } else {
            	$this->db->select('product_barcodes.size_id', FALSE);
            	
            	$this->db->group_by(array('product_details.product_id', 'branch_details.company_id', 'product_barcodes.size_id'));
            }
            
            $query = $this->db->get();
            
            if ($query->num_rows() > 0) {
            	$result['items'] = $query->result_array();
            } else {
            	$result['items'] = array();
            }
		} else {
			$result['items'] = array();
		}
		
		return $result;
	}
	
	function _get_summary_purchases($year, $month)
	{
		$branch_id = $this->session->userdata('user_branch');
		
		$this->db->from('purchase_details');
        $this->db->join('purchases', 'purchase_details.purchase_id = purchases.id');
        $this->db->join('product_barcodes', 'purchase_details.product_barcode_id = product_barcodes.id');
        $this->db->join('product_details', 'product_barcodes.product_detail_id = product_details.id');
        $this->db->join('branch_details', 'purchases.branch_detail_id = branch_details.id');

		$this->db->where('purchases.approved_state', 'A. GERENCIA');
		$this->db->where('branch_details.branch_id', $branch_id);
        $this->db->where('EXTRACT(YEAR FROM purchases.input_date) =', $year);

        if ($month > 0) {
        	$this->db->where('EXTRACT(MONTH FROM purchases.input_date) <=', $month);
        }
	}
	
	function get_summary_transfers_received($year, $month)
	{
		if (is_null($year)) {
			$year = intval(date('Y'));
		}
		
		$display = (empty($this->input->get('display')) ? 10 : $this->input->get('display'));
		$page = (empty($this->input->get('page')) ? 1 : $this->input->get('page'));
		$size_grouped = $this->input->get('size_grouped') !== FALSE;
		$result = array('page' => $page);
		
		$this->_get_summary_transfers_received($year, $month);
		
		if ($size_grouped) {
			$this->db->select("
				COUNT(DISTINCT (product_details.product_id, branch_details.company_id)) AS numrows
			", FALSE);
		} else {
			$this->db->select("
				COUNT(DISTINCT (product_details.product_id, branch_details.company_id, product_barcodes.size_id)) AS numrows
			", FALSE);
		}
		
		$query = $this->db->get();
			
		if ($query->num_rows() > 0) {
			$result['total_count'] = intval($query->row()->numrows);
		} else {
			$result['total_count'] = 0;
		}
		
		if ($result['total_count'] > 0) {
			$this->db->select("
                product_details.product_id,
                branch_details.company_id,
                SUM(transfer_details.quantity) AS quantity
            ", FALSE);
            
            $this->_get_summary_transfers_received($year, $month);
            
            $this->db->limit($display, ($page - 1) * $display);
            
            if ($size_grouped) {
            	$this->db->group_by(array('product_details.product_id', 'branch_details.company_id'));
            } else {
            	$this->db->select('product_barcodes.size_id', FALSE);
            	
            	$this->db->group_by(array('product_details.product_id', 'branch_details.company_id', 'product_barcodes.size_id'));
            }
            
            $query = $this->db->get();
            
            if ($query->num_rows() > 0) {
            	$result['items'] = $query->result_array();
            } else {
            	$result['items'] = array();
            }
		} else {
			$result['items'] = array();
		}
		
		return $result;
	}
	
	function _get_summary_transfers_received($year, $month)
	{
		$branch_id = $this->session->userdata('user_branch');
		
		$this->db->from('transfer_details');
        $this->db->join('transfers', 'transfer_details.transfer_id = transfers.id');
        $this->db->join('product_barcodes', 'transfer_details.product_barcode_id = product_barcodes.id');
        $this->db->join('product_details', 'product_barcodes.product_detail_id = product_details.id');
        $this->db->join('branch_details', 'transfers.branch_detail_target_id = branch_details.id');

		$this->db->where('transfers.approved_state', 'A. GERENCIA');
		$this->db->where('branch_details.branch_id', $branch_id);
        $this->db->where('EXTRACT(YEAR FROM transfers.transfer_date) =', $year);

        if ($month > 0) {
        	$this->db->where('EXTRACT(MONTH FROM transfers.transfer_date) <=', $month);
        }
	}
	
	function get_summary_transfers_sent($year, $month)
	{
		if (is_null($year)) {
			$year = intval(date('Y'));
		}
		
		$display = (empty($this->input->get('display')) ? 10 : $this->input->get('display'));
		$page = (empty($this->input->get('page')) ? 1 : $this->input->get('page'));
		$size_grouped = $this->input->get('size_grouped') !== FALSE;
		$result = array('page' => $page);
		
		$this->_get_summary_transfers_sent($year, $month);
		
		if ($size_grouped) {
			$this->db->select("
				COUNT(DISTINCT (product_details.product_id, branch_details.company_id)) AS numrows
			", FALSE);
		} else {
			$this->db->select("
				COUNT(DISTINCT (product_details.product_id, branch_details.company_id, product_barcodes.size_id)) AS numrows
			", FALSE);
		}
		
		$query = $this->db->get();
			
		if ($query->num_rows() > 0) {
			$result['total_count'] = intval($query->row()->numrows);
		} else {
			$result['total_count'] = 0;
		}
		
		if ($result['total_count'] > 0) {
			$this->db->select("
                product_details.product_id,
                branch_details.company_id,
                SUM(transfer_details.quantity) AS quantity
            ", FALSE);
            
            $this->_get_summary_transfers_sent($year, $month);
            
            $this->db->limit($display, ($page - 1) * $display);
            
            if ($size_grouped) {
            	$this->db->group_by(array('product_details.product_id', 'branch_details.company_id'));
            } else {
            	$this->db->select('product_barcodes.size_id', FALSE);
            	
            	$this->db->group_by(array('product_details.product_id', 'branch_details.company_id', 'product_barcodes.size_id'));
            }
            
            $query = $this->db->get();
            
            if ($query->num_rows() > 0) {
            	$result['items'] = $query->result_array();
            } else {
            	$result['items'] = array();
            }
		} else {
			$result['items'] = array();
		}
		
		return $result;
	}
	
	function _get_summary_transfers_sent($year, $month)
	{
		$branch_id = $this->session->userdata('user_branch');
		
		$this->db->from('transfer_details');
        $this->db->join('transfers', 'transfer_details.transfer_id = transfers.id');
        $this->db->join('product_barcodes', 'transfer_details.product_barcode_id = product_barcodes.id');
        $this->db->join('product_details', 'product_barcodes.product_detail_id = product_details.id');
        $this->db->join('branch_details', 'transfers.branch_detail_origin_id = branch_details.id');

		$this->db->where('transfers.approved_state', 'A. GERENCIA');
		$this->db->where('branch_details.branch_id', $branch_id);
        $this->db->where('EXTRACT(YEAR FROM transfers.transfer_date) =', $year);

        if ($month > 0) {
        	$this->db->where('EXTRACT(MONTH FROM transfers.transfer_date) <=', $month);
        }
	}
	
	function get_for_summary()
	{
		$ids = $this->input->post('ids');
        
        $this->db->select("
        	products.id,
        	products.code,
        	products.description,
        	products.regime,
        	brands.description AS brand,
        	product_details.company_id,
        	product_details.invoice_currency,
        	product_details.invoice_cost,
        	product_details.cost_currency,
        	product_details.cost
        ", FALSE);
        
        $this->db->where('products.id IN', '(' . implode($ids, ',') . ')', FALSE);
        $this->db->from('products');
        $this->db->join('brands', 'products.brand_id = brands.id');
        $this->db->join('product_details', 'products.id = product_details.product_id');

        $query = $this->db->get();

        return $query->result_array();
	}

}
