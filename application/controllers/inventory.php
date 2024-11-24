<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Inventory extends MY_Controller {

	public function __construct()
	{
		parent::__construct();
		//$this->load->model('brand_model','model');
	}

	public function initial_inventory()
	{
		$this->load->view('inventory/initial_inventory');
	}

	public function index()
	{
		$this->load->model('Sunat_table_model');

		$sunat_tables = $this->Sunat_table_model->get_for_inventory();

		$this->load->view('inventory/index', compact('sunat_tables'));
	}

	public function get_initial_stocks($target, $company_or_branch_detail, $start_date_or_period, $end_date)
	{
		$this->load->model('stock_model');

		$data = $this->stock_model->get_initial_stocks($target, $company_or_branch_detail, $start_date_or_period, $end_date);

		$this->json_output($data);
	}

	public function get_sales($type, $target, $company_id, $start_date_or_period, $end_date)
	{
		$this->load->model('sale_model');

		if ($type === 'FISICO') {
			$data = $this->sale_model->get_inventory($target, $company_id, $start_date_or_period, $end_date);
		} elseif ($type === 'VALORIZADO') {
			// Obtener ventas para inventario valorizado
			$data = array();
		}

		$this->json_output($data);
	}

	public function get_purchases($type, $target, $company_or_branch_detail, $start_date_or_period, $end_date)
	{
		$this->load->model('purchase_model');

		if ($type === 'FISICO') {
			$data = $this->purchase_model->get_inventory($target, $company_or_branch_detail, $start_date_or_period, $end_date);
		} elseif ($type === 'VALORIZADO') {
			// Obtener compras para inventario valorizado
			$data = array();
		}

		$this->json_output($data);
	}

	public function get_transfers($type, $target, $branch_detail_id, $start_date_or_period, $end_date)
	{
		$this->load->model('transfer_model');

		$data = array();

		if ($type === 'FISICO') {
			if ($target === 'branch') { // Solo se obtienen traslados entre almacenes si es inventario por sucursal (almacén)
				$data = $this->transfer_model->get_inventory($branch_detail_id, $start_date_or_period, $end_date);
			}
		} elseif ($type === 'VALORIZADO') {
			// Obtener traslados para inventario valorizado
		}

		$this->json_output($data);
	}

	public function get_previous_sales($type, $target, $company_id, $start_date_or_period, $end_date)
	{
		$data = array();

		if ($start_date_or_period !== 'year') {
			$this->load->model('stock_model');
			
			if ($type === 'FISICO') {
				$data = $this->stock_model->get_previous_sales($target, $company_id, $start_date_or_period, $end_date);
			} elseif ($type === 'VALORIZADO') {

			}
		}

		$this->json_output($data);
	}

	public function get_previous_refunds($type, $target, $company_id, $start_date_or_period, $end_date)
	{
		$this->load->model('stock_model');

		$data = array();

		if ($start_date_or_period !== 'year') {
			if ($type === 'FISICO') {
				$data = $this->stock_model->get_previous_refunds($target, $company_id, $start_date_or_period, $end_date);
			} elseif ($type === 'VALORIZADO') {

			}
		}

		$this->json_output($data);
	}

	public function get_previous_purchases($type, $target, $company_or_branch_detail, $start_date_or_period, $end_date)
	{
		$this->load->model('stock_model');

		$data = array();

		if ($start_date_or_period !== 'year') {
			if ($type === 'FISICO') {
				$data = $this->stock_model->get_previous_purchases($target, $company_or_branch_detail, $start_date_or_period, $end_date);
			} elseif ($type === 'VALORIZADO') {

			}
		}

		$this->json_output($data);
	}

	public function get_previous_transfers_received($type, $target, $branch_detail_id, $start_date_or_period, $end_date)
	{
		$this->load->model('stock_model');

		$data = array();

		if ($start_date_or_period !== 'year' && $target === 'branch') {
			if ($type === 'FISICO') {
				$data = $this->stock_model->get_previous_transfers_received($branch_detail_id, $start_date_or_period, $end_date);
			} elseif ($type === 'VALORIZADO') {

			}
		}

		$this->json_output($data);
	}

	public function get_previous_transfers_sent($type, $target, $branch_detail_id, $start_date_or_period, $end_date)
	{
		$this->load->model('stock_model');

		$data = array();

		if ($start_date_or_period !== 'year' && $target === 'branch') {
			if ($type === 'FISICO') {
				$data = $this->stock_model->get_previous_transfers_sent($branch_detail_id, $start_date_or_period, $end_date);
			} elseif ($type === 'VALORIZADO') {

			}
		}

		$this->json_output($data);
	}

	public function get_products($type)
	{
		$this->load->model('stock_model');

		if ($type === 'FISICO') {
			$data = $this->stock_model->get_products();
		} elseif ($type === 'VALORIZADO') {
			$data = array();
		}

		$this->json_output($data);
	}

	public function kardex()
	{
		$this->load->model('Sunat_table_model');

		$sunat_tables = $this->Sunat_table_model->get_for_inventory();

		$this->load->view('inventory/kardex', compact('sunat_tables'));
	}

	public function get_kardex_initial_stock($product_id, $target, $company_id, $period, $year_month)
	{
		$this->load->model('stock_model');

		$data = $this->stock_model->get_kardex_initial_stock($product_id, $target, $company_id, $period, $year_month);

		$this->json_output(array(
			'total_count' => 1,
			'items' => array($data)
		));
	}

	public function get_kardex_sales_refunds($product_id, $target, $company_id, $period, $year_month)
	{
		$this->load->model('sale_model');

		$data = $this->sale_model->get_product_kardex($product_id, $target, $company_id, $period, $year_month);

		$this->json_output(array(
			'total_count' => count($data),
			'items' => $data
		));
	}

	public function get_kardex_purchases($product_id, $target, $company_id, $period, $year_month)
	{
		$this->load->model('purchase_model');

		$data = $this->purchase_model->get_product_kardex($product_id, $target, $company_id, $period, $year_month);

		$this->json_output(array(
			'total_count' => count($data),
			'items' => $data
		));
	}

	public function get_kardex_transfers($product_id, $target, $company_id, $period, $year_month)
	{
		$this->load->model('transfer_model');

		$data = $this->transfer_model->get_product_kardex($product_id, $target, $company_id, $period, $year_month);

		$this->json_output(array(
			'total_count' => count($data),
			'items' => $data
		));
	}

}
