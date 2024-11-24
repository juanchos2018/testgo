<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Products extends MY_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->model('product_model');
	}

	public function index()
	{
		 $this->load->view('logistic/products');
	}

	public function update()
    {	
		$json = json_decode(file_get_contents('php://input'));
		if (!empty($json)) {
			
			$product = $this->product_model->get($json->id);

			$product->code = $json->data->code;
			$product->description   = $json->data->description;
			$product->brand_id = $json->data->brand_id;
			$product->category_id    = $json->data->category_id;
			$product->subcategory_id = $json->data->subcategory_id;
			$product->description2 = $json->data->description2;
			$product->gender_id = $json->data->gender_id;
			$product->ages_id = $json->data->ages_id;
			$product->uses_id = $json->data->uses_id;
			$product->measurement_id = $json->data->measurement_id;


			$saved = $this->product_model->update($json->id, $product);
			if($saved) {
				$this->json_output('200', 'Producto Actualizado');
			} else {
				$this->json_output('500', 'No se realizo actualización');
			}
		} else {
			$this->error_output('400','No se recibieron datos');
		}
	}
	
	public function detail($id)
	{

		if ($id !== FALSE) {
			$detail['details'] = $this->product_model->get_by_id($id);

			$this->load->view('products/detail', array('detail' => $detail, 'id' => $id));
		} else {
			$this->load->view('app/redirect', array(
				'url' => 'products',
				'message' => 'Ocurrió un error al intentar obtener el registro'
			));
		}
	}

	public function cost_detail($id) 
	{
		try {
			$data = $this->product_model->getProductCost($id);
			$this->json_output($data);
		} catch (\Throwable $th) {
			$this->json_output($th);
		}
		$this->json_output($data);
	}

	public function size_detail($id) 
	{
		try {
			$data = $this->product_model->getProductSizes($id);
			$this->json_output($data);
		} catch (\Throwable $th) {
			$this->json_output($th);
		}
		$this->json_output($data);
	}

	public function lists()
    {
    	echo json_encode($this->product_model->getProducts());
    }

    ### MIGRADO
    public function list_for_logistic()
	{
		$this->load->database();
        $this->load->library('SSP');

        $table = 'stock LEFT JOIN product_barcodes ON stock.product_barcode_id = product_barcodes.id
        			LEFT JOIN product_details ON product_barcodes.product_detail_id = product_details.id
        			LEFT JOIN products ON product_details.product_id = products.id
        			LEFT JOIN brands ON products.brand_id = brands.id
        			LEFT JOIN categories ON products.category_id = categories.id
        			LEFT JOIN size ON product_barcodes.size_id = size.id';
        $primaryKey = 'stock.id';
        $columns = array(
            array( 'db' => 'stock.id', 'dt' => 0 ),
            array( 'db' => 'products.code', 'dt' => 1 ),
            array( 'db' => "CONCAT(products.description, ' (T.', size.description,')' ) AS description", 'dt' => 2 ),
            array( 'db' => "categories.description AS category", 'dt' => 3 ),
            array( 'db' => "brands.description AS marca", 'dt' => 4 ),
            array( 'db' => 'stock.first_entry', 'dt' => 5, 'formatter' => function ($value, $data) {
            	return date('d/m/Y h:i A', strtotime($value));
            } ),
            array( 'db' => "store_stock" ,'dt' => 6, 'formatter' => function ($value, $data) {
            	return number_format($value, 2);
            }),
            array( 'db' => "depot_stock" ,'dt' => 7, 'formatter' => function ($value, $data) {
            	return number_format($value, 2);
            }),
            array( 'db' => "product_details.cost" ,'dt' => 8, 'formatter' => function ($value, $data) {
            	return number_format($value, 2);
            }),
            array( 'db' => "(product_details.cost * (stock.store_stock + depot_stock)) AS total" ,'dt' => 9, 'formatter' => function ($value, $data) {
            	return number_format($value, 2);
            })

        );
        $sql_details = array(
            'user' => $this->db->username,
            'pass' => $this->db->password,
            'db' => $this->db->database,
            'host' => $this->db->hostname
        );

        // OJO CON ESTO: PORQUE AHORA SOLO SE FILTRA LA RAMA Y SE MUESTRAN LOS DATOS DE TODAS LAS EMPRESAS
        //falta capturar variables de sesion
        $where = "(stock.branch_id = 2 AND product_details.company_id = 2)";

        $this->output
            ->set_content_type('application/json')
            ->set_output(json_encode($this->ssp->simple( $_GET, $sql_details, $table, $primaryKey, $columns, $where )));
	}

	public function get_for_sale($barcode, $company_id = NULL, $regime = NULL)
	{
		$product = $this->product_model->get_for_sale($barcode, $company_id, $regime);

		if ($product !== FALSE) {
			$this->json_output($product);
		} else {
			$this->error_output('400', 'Producto no encontrado');
		}
	}

	public function list_for_sale2()
	{
		$this->load->database();
		$this->load->library('SSP');

		$table = 'products';
		$primaryKey = 'id';
		$columns = array(
			array( 'db' => 'id', 'dt' => 0 ),
			array( 'db' => 'code', 'dt' => 1 ),
			array( 'db' => 'description', 'dt' => 2 )
			/*array(
				'db' => 'start_date',
				'dt' => 4,
				'formatter' => function( $d, $row ) {
					return date( 'jS M y', strtotime($d));
				}
			),
			array(
				'db' => 'salary',
				'dt' => 5,
				'formatter' => function( $d, $row ) {
					return '$'.number_format($d);
				}
			)*/
		);
		$sql_details = array(
			'user' => $this->db->username,
			'pass' => $this->db->password,
			'db' => $this->db->database,
			'host' => $this->db->hostname
		);

		$this->output
			->set_content_type('application/json')
			->set_output(json_encode($this->ssp->simple( $_GET, $sql_details, $table, $primaryKey, $columns )));
	}

	public function get_list_for_sale($company_id = NULL, $regime = NULL)
	{
		$start = ($this->input->get('start') ? $this->input->get('start') : 0);
        $limit = ($this->input->get('limit') ? $this->input->get('limit') : 10);
        $query = ($this->input->get('query') ? $this->input->get('query') : NULL);
        $filter = ($this->input->get('filter') ? $this->input->get('filter') : NULL);

        $data = $this->product_model->get_list_for_sale($start, $limit, $query, $filter, $company_id, $regime);

        $this->output
            ->set_content_type('application/json')
            ->set_output(json_encode($data));
	}

	public function search()
	{
		$term = ($this->input->get('term') ? $this->input->get('term') : NULL);
		$page = ($this->input->get('page') ? $this->input->get('page') : 1);
		$display = ($this->input->get('display') ? $this->input->get('display') : 10);

		$data = $this->product_model->search($term, $page, $display);

		$this->json_output($data);
	}

	/*
		Función search genérica para dropdown. no incluye búsqueda en código de barras,
		solo busca productos activos y por product_detail_id (se puede repetir el mismo producto si existiera en más de una empresa)
	*/
	public function search_for_offer()
	{
		$term = ($this->input->get('term') ? $this->input->get('term') : NULL);
		$company = ($this->input->get('company') ? $this->input->get('company') : NULL);
		$regime = ($this->input->get('regime') ? $this->input->get('regime') : NULL);
		$page = ($this->input->get('page') ? $this->input->get('page') : 1);
		$display = ($this->input->get('display') ? $this->input->get('display') : 10);

		$data = $this->product_model->search_for_offer($term, $company, $regime, $page, $display);

		$this->json_output($data);
	}

	

	### MIGRADO
	public function list_for_sale()
	{
		$this->load->database();
		$this->load->library('SSP');

		$table = 'product_barcodes INNER JOIN product_details ON product_barcodes.product_detail_id = product_details.id
				  INNER JOIN products ON product_details.product_id = products.id
				  INNER JOIN size ON product_barcodes.size_id = size.id
				  INNER JOIN stock ON product_barcodes.id = stock.product_barcode_id';
		$primaryKey = 'product_barcodes.id';
		$columns = array(
			array( 'db' => 'product_barcodes.id', 'dt' => 0 ),
			array( 'db' => 'products.code', 'dt' => 1 ),
			array( 'db' => 'products.description', 'dt' => 2 ),
			array( 'db' => "size.description AS size", 'dt' => 3),
			array( 'db' => 'COALESCE(store_stock, 0) AS stock', 'dt' => 4 )
			/*array(
				'db' => 'start_date',
				'dt' => 4,
				'formatter' => function( $d, $row ) {
					return date( 'jS M y', strtotime($d));
				}
			),
			array(
				'db' => 'salary',
				'dt' => 5,
				'formatter' => function( $d, $row ) {
					return '$'.number_format($d);
				}
			)*/
		);
		$sql_details = array(
			'user' => $this->db->username,
			'pass' => $this->db->password,
			'db' => $this->db->database,
			'host' => $this->db->hostname
		);

		$where = 'stock.branch_id = ' . $this->session->userdata('user_branch');

		$this->output
			->set_content_type('application/json')
			->set_output(json_encode($this->ssp->simple( $_GET, $sql_details, $table, $primaryKey, $columns, $where )));
	}

	### MIGRADO
	public function list_for_sale_by($field, $value)
	{
		$this->load->database();
		$this->load->library('SSP');

		$table = 'product_barcodes INNER JOIN product_details ON product_barcodes.product_detail_id = product_details.id
				  INNER JOIN products ON product_details.product_id = products.id
				  INNER JOIN size ON product_barcodes.size_id = size.id
				  INNER JOIN stock ON product_barcodes.id = stock.product_barcode_id';
		$primaryKey = 'product_barcodes.id';
		$columns = array(
			array( 'db' => 'product_barcodes.id', 'dt' => 0 ),
			array( 'db' => 'products.code', 'dt' => 1 ),
			array( 'db' => 'products.description', 'dt' => 2 ),
			array( 'db' => "size.description AS size", 'dt' => 3),
			array( 'db' => 'COALESCE(store_stock, 0) AS stock', 'dt' => 4 )
			/*array(
				'db' => 'start_date',
				'dt' => 4,
				'formatter' => function( $d, $row ) {
					return date( 'jS M y', strtotime($d));
				}
			),
			array(
				'db' => 'salary',
				'dt' => 5,
				'formatter' => function( $d, $row ) {
					return '$'.number_format($d);
				}
			)*/
		);
		$sql_details = array(
			'user' => $this->db->username,
			'pass' => $this->db->password,
			'db' => $this->db->database,
			'host' => $this->db->hostname
		);

		$where = 'stock.branch_id = ' . $this->session->userdata('user_branch') . ' AND ' .
				 $field . " = '$value'";

		$this->output
			->set_content_type('application/json')
			->set_output(json_encode($this->ssp->simple( $_GET, $sql_details, $table, $primaryKey, $columns, $where )));
	}

	public function verify_for_purchase_order($company_id)
	{
		$data = $this->product_model->verify_for_purchase_order($company_id);

		$this->json_output($data);
	}

	public function verify_for_purchase($company_id)
	{
		$data = $this->product_model->verify_for_purchase($company_id);

		$this->json_output($data);
	}

	public function verify_for_transfer($company_id, $branch_id)
	{
		$data = $this->product_model->verify_for_transfer($company_id, $branch_id);

		$this->json_output($data);
	}

	public function data_for_temporal_stock()
	{
		$data = $this->product_model->data_for_temporal_stock();

		$this->json_output($data);
	}

	public function save_single_tables()
	{
		$data = $this->product_model->save_single_tables();

		$this->json_output(array(
			'categories' => $data[0]['result'],
			'genders' => $data[1]['result'],
			'ages' => $data[2]['result'],
			'uses' => $data[3]['result'],
			'brands' => $data[4]['result'],
			'subcategories' => $data[5]['result'],
			'sizes' => $data[6]['result']
		));
	}
	
	public function stocks()
	{
		$this->load->model('brand_model');
		
		$brands = $this->brand_model->all();
		
		$this->load->view('products/stocks', compact('brands'));
	}
	
	public function get_stocks()
	{
        $display = (empty($this->input->get('display')) ? 10 : $this->input->get('display'));
		$page = (empty($this->input->get('page')) ? 1 : $this->input->get('page'));
		$order = (empty($this->input->get('order')) ? NULL : $this->input->get('order'));
		$filters = (empty($this->input->get('filters')) ? NULL : $this->input->get('filters'));
        
        $data = $this->product_model->get_stocks($display, $page, $order, $filters);

        $this->json_output($data);
	}
	
	public function get_initial_stocks($year = NULL)
	{
		$data = $this->product_model->get_initial_stocks($year);

		$this->json_output($data);
	}
	
	public function get_summary_sales($year = NULL, $month = 0)
	{
		$data = $this->product_model->get_summary_sales($year, $month);

		$this->json_output($data);
	}
	
	public function get_summary_refunds($year = NULL, $month = 0)
	{
		$data = $this->product_model->get_summary_refunds($year, $month);

		$this->json_output($data);
	}
	
	public function get_summary_purchases($year = NULL, $month = 0)
	{
		$data = $this->product_model->get_summary_purchases($year, $month);

		$this->json_output($data);
	}
	
	public function get_summary_transfers_received($year = NULL, $month = 0)
	{
		$data = $this->product_model->get_summary_transfers_received($year, $month);

		$this->json_output($data);
	}
	
	public function get_summary_transfers_sent($year = NULL, $month = 0)
	{
		$data = $this->product_model->get_summary_transfers_sent($year, $month);

		$this->json_output($data);
	}
	
	public function get_for_summary()
	{
		$data = $this->product_model->get_for_summary();

		$this->json_output($data);
	}
	
	public function get_product_kardex($product_id, $target, $company_id, $period, $year_month)
	{
		$data = $this->product_model->get_product_kardex($product_id, $target, $company_id, $period, $year_month);

		$this->json_output($data);
	}

}
