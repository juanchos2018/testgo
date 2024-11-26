<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Purchases extends MY_Controller {

	public function __construct()
	{
		parent::__construct();
	}
	
	public function index()
	{
		$this->load->model('purchase_model');

		$data['records'] = $this->purchase_model->get_all(array(
			'branch_id' => $this->session->userdata('user_branch')
		));

		$this->load->view('purchases/index', $data);
	}

	public function detail($id)
	{
		$this->load->model('purchase_model');

		$detail = $this->purchase_model->get($id);

		if ($detail !== FALSE) {
			$detail['details'] = $this->purchase_model->get_details($id);

			$this->load->view('purchases/detail', array('detail' => $detail));
		} else {
			$this->load->view('app/redirect', array(
				'url' => 'purchases',
				'message' => 'Ocurrió un error al intentar obtener el registro'
			));
		}
	}

	public function add()
	{
		$this->load->model('purchase_order_model');
		$this->load->model('purchase_model');
		$this->load->model('product_model');

		$single_tables = $this->product_model->get_single_tables();

		$data['next_id'] = $this->purchase_model->next_id();
		//$data['next_id'] = 1;

		$data['categories'] = $single_tables[0]['records'];
		$data['genders'] = $single_tables[1]['records'];
		$data['ages'] = $single_tables[2]['records'];
		$data['uses'] = $single_tables[3]['records'];
		$data['brands'] = $single_tables[4]['records'];
		$data['subcategories'] = $single_tables[5]['records'];
		$data['sizes'] = $single_tables[6]['records'];

		$data['purchase_orders'] = $this->purchase_order_model->get_list(array('active' => 't'));

		$this->load->view('purchases/add', $data);
	}

	public function save()
	{
		$this->form_validation->set_rules('supplier_id', 'Proveedor', 'required|is_integer');
		$this->form_validation->set_rules('company_id', 'Empresa', 'required|is_integer');
		$this->form_validation->set_rules('input_date', 'Fecha de ingreso', 'required|is_date');
		$this->form_validation->set_rules('amount', 'Monto de compra', 'required|is_real');
		$this->form_validation->set_rules('utility', 'Utilidad', 'required|is_integer');
		$this->form_validation->set_rules('expenses', 'Gasto total', 'required|is_real');
		$this->form_validation->set_rules('igv', 'IGV', 'required|is_real');

		$this->form_validation->set_rules('details', 'Detalles de compra', 'required|is_array');
		$this->form_validation->set_rules('invoices', 'Facturas', 'required|is_array');
		$this->form_validation->set_rules('product_details', 'Detalles de producto', 'required|is_array');

		$this->form_validation->set_message('required', 'El campo %s es requerido');
		$this->form_validation->set_message('exact_length', 'El campo %s no tiene un formato válido');
		$this->form_validation->set_message('is_integer', 'El campo %s no es un entero válido');
		$this->form_validation->set_message('is_real', 'El campo %s no es un número válido');
		$this->form_validation->set_message('is_array', 'El campo %s no tiene un formato válido');
		$this->form_validation->set_message('is_date', 'El campo %s no es una fecha válida');

		if ($this->form_validation->run() !== FALSE) {
			$this->load->model('purchase_model');
			
			$inserted = $this->purchase_model->save();

			if ($inserted !== FALSE) {
				$this->json_output(array(
					'ok' => TRUE,
					'id' => $inserted
				));
			} else {
				$this->json_output(array('error' => 'Ocurrió un error al guardar el registro'));
			}
		} else {
			$errors = $this->form_validation->error_array();
			$message = array_shift($errors);
			$this->json_output(array('error' => $message));
		}
	}

	public function template()
	{
		$this->load->model('purchase_order_model');

		$data['purchase_orders'] = $this->purchase_order_model->get_list(array('active' => 't'));

		$this->load->view('purchases/template', $data);
	}

	public function data_for_template($source)
	{
		if ($source === 'purchase_order') { // Los datos se forman a partir de un pedido
			$this->load->model('purchase_order_model');

			$id = $this->input->post('id');
			$stock = ($this->input->post('stock') == 1);

			$products = $this->purchase_order_model->data_for_purchase($id, $stock);
		} elseif ($source === 'products') {
			$this->load->model('product_model');

			$stock = ($this->input->post('stock') == 1);
			$active = ($this->input->post('active') == 1);

			// $group = $this->input->post('group');
			$company = $this->input->post('company');
			$filters = $this->input->post('filters');
			$regime = $this->input->post('regime');

			$products = $this->product_model->data_for_purchase($active, $stock, $company, $regime, $filters);
		}

		$this->json_output(array(
			'ok' => TRUE,
			'items' => $products
		));
	}

	public function template_old($action = NULL, $only_active = 1, $group = NULL)
	{
		if (is_null($action)) {
			$this->load->view('purchases/template');
		} else {
			if ($action === 'data') {
				$this->load->model('product_model');

				// OJO!!!!! EL SIGUIENTE METODO TIENE QUE SER REEMPLAZADO POR get_for_purchase
				$products = $this->product_model->get_for_purchase_template(1 == $only_active, $group);

				if ($products !== FALSE) {
					$this->json_output($products);
				} else {
					$this->error_output('400', '$products is FALSE');
				}
			} elseif ($action === 'file') {
				$this->set_header_template();
				$this->generate_template($group);
			}
		}
	}

	private function set_header_template()
	{
		header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		header('Content-Disposition: attachment; filename="purchase_template.xlsx"');
	}

	private function generate_template($group_by = NULL)
	{
		$excel = new PHPExcel();

		$excel->getProperties()
			->setCreator("Go!")
			->setLastModifiedBy("Go!")
			->setTitle("Ingreso de Productos")
			->setSubject("Ingreso de Productos")
			->setDescription("Ingreso de Productos");

		if ($group_by === 'category' || $group_by === 'brand') {
			$this->load->model('product_model');

			$groups = $this->product_model->get_group_for_purchase_template($group_by);

			foreach ($groups as $index => $group) {
				$this->build_sheet($excel, $group, $index);
			}
		} else {
			$this->build_sheet($excel);
		}

        $writer = PHPExcel_IOFactory::createWriter($excel, 'Excel2007');
		$writer->save('php://output');
	}

	private function build_sheet(&$excel, $title = NULL, $index = NULL)
	{
		if (is_null($title) || is_null($index)) {
			$sheet = $excel->setActiveSheetIndex(0);
        	$sheet->setTitle('Hoja 1');
		} else {
			if ($index) {
				$sheet = $excel->createSheet($index);
			} else {
				$sheet = $excel->setActiveSheetIndex(0);
			}

        	$sheet->setTitle($title);
		}

        $sheet->mergeCells('A2:O3');
		$sheet->setCellValue('A2', 'Inventario Inicial');

		$style = array(
			'borders' => array(
				'allborders' => array(
					'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
					'color' => array('rgb' => '000000'),
				)
			),
			'fill' => array(
	            'type' => PHPExcel_Style_Fill::FILL_SOLID,
	            'color' => array('rgb' => 'C0C0C0')
	        ),
	        'alignment' => array(
	            'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
	            'vertical' => PHPExcel_Style_Alignment::VERTICAL_CENTER
	        ),
	        'font'  => array(
		        'bold'  => false,
		        'color' => array('rgb' => '3366FF'),
		        'size'  => 24,
		        'name'  => 'Calibri'
		    )
		);

		$sheet->getStyle('A2:O3')->applyFromArray($style);

		$sheet->setCellValue('A5', 'CODIGO');
		$sheet->setCellValue('B5', 'TALLA');
		$sheet->setCellValue('C5', 'STOCK');
		$sheet->setCellValue('D5', 'CODIGO DE BARRA');
		$sheet->setCellValue('E5', 'LINEA');
		$sheet->setCellValue('F5', 'GENERO');
		$sheet->setCellValue('G5', 'DESCRIPCION');
		$sheet->setCellValue('H5', 'REGIMEN');
		$sheet->setCellValue('I5', 'TIPO');
		$sheet->setCellValue('J5', 'MARCA');
		$sheet->setCellValue('K5', 'CATEGORIA');
		$sheet->setCellValue('L5', 'DECLARACION DE SALIDA');
		$sheet->setCellValue('M5', 'COSTO');
		$sheet->setCellValue('N5', 'PRECIO');
		$sheet->setCellValue('O5', 'PRECIO OFERTA');

		$style = array(
			'borders' => array(
				'allborders' => array(
					'style' => PHPExcel_Style_Border::BORDER_THIN,
					'color' => array('rgb' => '000000'),
				)
			),
			'fill' => array(
	            'type' => PHPExcel_Style_Fill::FILL_SOLID,
	            'color' => array('rgb' => 'C0C0C0')
	        ),
	        'alignment' => array(
	            'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
	            'vertical' => PHPExcel_Style_Alignment::VERTICAL_CENTER,
	            'wrap' => TRUE
	        ),
	        'font'  => array(
		        'bold'  => TRUE,
		        'color' => array('rgb' => 'FFFFFF'),
		        'size'  => 7.5,
		        'name'  => 'Calibri'
		    )
		);

		$sheet->getStyle('A5:O5')->applyFromArray($style);

		$style = array(
			'borders' => array(
				'allborders' => array(
					'style' => PHPExcel_Style_Border::BORDER_THIN,
					'color' => array('rgb' => '000000'),
				)
			),
	        'alignment' => array(
	            'vertical' => PHPExcel_Style_Alignment::VERTICAL_CENTER,
	            'wrap' => FALSE
	        ),
	        'font'  => array(
		        'size'  => 8,
		        'name'  => 'Calibri'
		    )
		);

		$sheet->getStyle('A6:O6')->applyFromArray($style);

		$sheet->freezePane('D6');

		$sheet->setAutoFilter('A5:O6');

		$sheet->getColumnDimension('A')->setWidth(71.35/7);
		$sheet->getColumnDimension('B')->setWidth(62.65/7);
		$sheet->getColumnDimension('C')->setWidth(53.90/7);
		$sheet->getColumnDimension('D')->setWidth(95.15/7);
		$sheet->getColumnDimension('E')->setWidth(81.65/7);
		$sheet->getColumnDimension('F')->setWidth(63.40/7);
		$sheet->getColumnDimension('G')->setWidth(245.00/7);
		$sheet->getColumnDimension('H')->setWidth(72.95/7);
		$sheet->getColumnDimension('I')->setWidth(72.95/7);
		$sheet->getColumnDimension('J')->setWidth(72.95/7);
		$sheet->getColumnDimension('K')->setWidth(72.95/7);
		$sheet->getColumnDimension('L')->setWidth(140.35/7);
		$sheet->getColumnDimension('M')->setWidth(63.40/7);
		$sheet->getColumnDimension('N')->setWidth(63.40/7);
		$sheet->getColumnDimension('O')->setWidth(63.40/7);

		// Formatos de celdas

		$text_format = array(
		    'numberformat' => array(
		        'code' => PHPExcel_Style_NumberFormat::FORMAT_TEXT
		    )
		);

		$sheet->getStyle('A6:B6')->applyFromArray($text_format);
		$sheet->getStyle('D6:L6')->applyFromArray($text_format);

        $sheet->getRowDimension(1)->setRowHeight(19.50);
        $sheet->getRowDimension(2)->setRowHeight(12.60);
        $sheet->getRowDimension(3)->setRowHeight(21.00);
        $sheet->getRowDimension(4)->setRowHeight(21.75);
        $sheet->getRowDimension(5)->setRowHeight(33.75);
	}

}
