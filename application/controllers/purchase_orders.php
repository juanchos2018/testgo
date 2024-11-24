<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Purchase_orders extends MY_Controller {

	public function __construct()
	{
		parent::__construct();
	}

	public function template()
	{
		$this->load->view('purchase_orders/template');
	}

	public function data_for_template()
	{
		$this->load->model('product_model');

		$active = ($this->input->post('active') == 1);

		$group = $this->input->post('group');
		$company = $this->input->post('company');
		$regime = $this->input->post('regime');
		$filters = $this->input->post('filters');

		$products = $this->product_model->data_for_purchase_order($active, $company, $regime, $group, $filters);

		$this->json_output(array(
			'ok' => TRUE,
			'items' => $products
		));
	}

	public function file_for_template()
	{
		header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

		$excel = new PHPExcel();
		$group = $this->input->get('group');

		$excel->getProperties()->setCreator("Go!")->setTitle("Pedido");

		if (empty($group)) { // Hoja única
			$sheet = $excel->setActiveSheetIndex(0);
        	$sheet->setTitle('Hoja1');

			$this->fill_sheet($sheet);
		} else {
			if ($group === 'categories') {
				$this->load->model('category_model', 'model');
			} else { // brands
				$this->load->model('brand_model', 'model');
			}

			$groups = $this->model->simple_list();

			foreach ($groups as $index => $item) {
				if ($index === 0) {
					$sheet = $excel->setActiveSheetIndex(0);
				} else {
					$sheet = $excel->createSheet($index);
				}

	        	$sheet->setTitle($item->text);

				$this->fill_sheet($sheet);
			}
		}

		$writer = PHPExcel_IOFactory::createWriter($excel, 'Excel2007');
		$writer->save('php://output');
	}

	public function index()
	{
		$this->load->model('purchase_order_model');

		$data['records'] = $this->purchase_order_model->get_all(array(
			'branch_id' => $this->session->userdata('user_branch')
		));

		$this->load->view('purchase_orders/index', $data);
	}

	public function add()
	{
		$this->load->model('purchase_order_model');
		$this->load->model('product_model');

		$data['next_id'] = $this->purchase_order_model->next_id();

		$single_tables = $this->product_model->get_single_tables();

		$data['categories'] = $single_tables[0]['records'];
		$data['genders'] = $single_tables[1]['records'];
		$data['ages'] = $single_tables[2]['records'];
		$data['uses'] = $single_tables[3]['records'];
		$data['brands'] = $single_tables[4]['records'];
		$data['subcategories'] = $single_tables[5]['records'];

		$this->load->view('purchase_orders/add', $data);
	}

	public function save()
	{
		//$this->form_validation->set_rules('code', 'Código', 'required|exact_length[6]');
		$this->form_validation->set_rules('description', 'Descripción', 'required');
		$this->form_validation->set_rules('active', 'Estado', 'required|exact_length[1]');
		$this->form_validation->set_rules('supplier_id', 'Proveedor', 'required|is_integer');
		$this->form_validation->set_rules('company_id', 'Empresa', 'required|is_integer');
		$this->form_validation->set_rules('details', 'Detalles de pedido', 'required|is_array');

		$this->form_validation->set_message('required', 'El campo %s es requerido');
		$this->form_validation->set_message('exact_length', 'El campo %s no tiene un formato válido');
		$this->form_validation->set_message('is_integer', 'El campo %s no es un ID válido');
		// $this->form_validation->set_message('regex_match', 'El campo %s no es una fecha válida');
		$this->form_validation->set_message('is_array', 'El campo %s no tiene un formato válido');

		if ($this->form_validation->run() !== FALSE) {
			$this->load->model('purchase_order_model');

			$inserted = $this->purchase_order_model->save();

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

	public function delete()
	{
		if ($this->input->is_post()) {
			$this->load->model('purchase_order_model');

            if ($this->purchase_order_model->delete()) {
            	$this->json_output(array('ok' => TRUE));
            } else {
            	$this->json_output(array('error' => 'No se pudo eliminar el registro'));
            }
        } else {
            $this->json_output(array('error' => 'No se recibieron datos'));
        }
	}

	public function detail($id)
	{
		$this->load->model('purchase_order_model');

		$detail = $this->purchase_order_model->get($id);

		if ($detail !== FALSE) {
			$detail['details'] = $this->purchase_order_model->get_details($id);

			$this->load->view('purchase_orders/detail', array('detail' => $detail));
		} else {
			$this->load->view('app/redirect', array(
				'url' => 'purchase-orders',
				'message' => 'Ocurrió un error al intentar obtener el registro'
			));
		}
	}

	public function edit($id)
	{
		$this->load->model('purchase_order_model');
		$this->load->model('product_model');

		$detail = $this->purchase_order_model->get($id);

		if ($detail !== FALSE) {
			$detail['details'] = $this->purchase_order_model->get_details($id);

			$single_tables = $this->product_model->get_single_tables();

			$data['detail'] = $detail;
			$data['categories'] = $single_tables[0]['records'];
			$data['genders'] = $single_tables[1]['records'];
			$data['ages'] = $single_tables[2]['records'];
			$data['uses'] = $single_tables[3]['records'];
			$data['brands'] = $single_tables[4]['records'];
			$data['subcategories'] = $single_tables[5]['records'];

			$this->load->view('purchase_orders/edit', $data);
		} else {
			$this->load->view('app/redirect', array(
				'url' => 'purchase-orders',
				'message' => 'Ocurrió un error al intentar editar el registro'
			));
		}
	}

	public function update($id)
	{
		//$this->form_validation->set_rules('code', 'Código', 'required|exact_length[6]');
		$this->form_validation->set_rules('description', 'Descripción', 'required');
		$this->form_validation->set_rules('active', 'Estado', 'required|exact_length[1]');
		$this->form_validation->set_rules('supplier_id', 'Proveedor', 'required|is_integer');
		$this->form_validation->set_rules('company_id', 'Empresa', 'required|is_integer');
		$this->form_validation->set_rules('details', 'Detalles de pedido', 'required|is_array');

		$this->form_validation->set_message('required', 'El campo %s es requerido');
		$this->form_validation->set_message('exact_length', 'El campo %s no tiene un formato válido');
		$this->form_validation->set_message('is_integer', 'El campo %s no es un ID válido');
		// $this->form_validation->set_message('regex_match', 'El campo %s no es una fecha válida');
		$this->form_validation->set_message('is_array', 'El campo %s no tiene un formato válido');

		if ($this->form_validation->run() !== FALSE) {
			$this->load->model('purchase_order_model');

			$inserted = $this->purchase_order_model->update($id);

			if ($inserted !== FALSE) {
				$this->json_output(array(
					'ok' => TRUE,
					'id' => $inserted
				));
			} else {
				$this->json_output(array('error' => 'Ocurrió un error al actualizar el registro'));
			}
		} else {
			$errors = $this->form_validation->error_array();
			$message = array_shift($errors);
			$this->json_output(array('error' => $message));
		}
	}

	private function fill_sheet(&$sheet)
	{
		$sheet->mergeCells('A1:K1');
		$sheet->setCellValue('A1', 'Pedido de productos');

		$style = array(
	        'alignment' => array(
	            'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
	            'vertical' => PHPExcel_Style_Alignment::VERTICAL_CENTER
	        ),
	        'font'  => array(
		        'bold'  => false,
		        'color' => array('rgb' => '000000'),
		        'size'  => 14,
		        'name'  => 'Arial'
		    )
		);

		$sheet->getStyle('A1:J1')->applyFromArray($style);

		$sheet->setCellValue('A3', 'N°');
		$sheet->setCellValue('B3', 'CODIGO');
		$sheet->setCellValue('C3', 'CANT.');
		$sheet->setCellValue('D3', 'LINEA');
		$sheet->setCellValue('E3', 'GENERO');
		$sheet->setCellValue('F3', 'EDAD');
		$sheet->setCellValue('G3', 'DEPORTE');
		$sheet->setCellValue('H3', 'MARCA');
		$sheet->setCellValue('I3', 'TIPO');
		$sheet->setCellValue('J3', 'REGIMEN');
		$sheet->setCellValue('K3', 'DESCRIPCION');

		$style = array(
			'borders' => array(
				'allborders' => array(
					'style' => PHPExcel_Style_Border::BORDER_THIN,
					'color' => array('rgb' => '663300'),
				)
			),
			'fill' => array(
	            'type' => PHPExcel_Style_Fill::FILL_SOLID,
	            'color' => array('rgb' => 'FFCC00')
	        ),
	        'alignment' => array(
	            'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
	            'vertical' => PHPExcel_Style_Alignment::VERTICAL_CENTER,
	            'wrap' => TRUE
	        ),
	        'font'  => array(
		        'bold'  => TRUE,
		        'color' => array('rgb' => '000000'),
		        'size'  => 10,
		        'name'  => 'Arial Narrow'
		    )
		);

		$sheet->getStyle('A3:K3')->applyFromArray($style);

		$style = array(
			'borders' => array(
				'allborders' => array(
					'style' => PHPExcel_Style_Border::BORDER_THIN,
					'color' => array('rgb' => '663300'),
				)
			),
	        'alignment' => array(
	            'vertical' => PHPExcel_Style_Alignment::VERTICAL_CENTER,
	            'wrap' => FALSE
	        ),
	        'font'  => array(
		        'size'  => 11,
		        'name'  => 'Calibri'
		    )
		);

		$sheet->getStyle('A4:K4')->applyFromArray($style);

		$sheet->freezePane('D4');

		$sheet->setAutoFilter('A3:K4');

		$sheet->getColumnDimension('A')->setWidth(6);
		$sheet->getColumnDimension('B')->setWidth(18);
		$sheet->getColumnDimension('C')->setWidth(7);
		$sheet->getColumnDimension('D')->setWidth(21);
		$sheet->getColumnDimension('E')->setWidth(11);
		$sheet->getColumnDimension('F')->setWidth(11);
		$sheet->getColumnDimension('G')->setWidth(14);
		$sheet->getColumnDimension('H')->setWidth(14);
		$sheet->getColumnDimension('I')->setWidth(14);
		$sheet->getColumnDimension('J')->setWidth(14);
		$sheet->getColumnDimension('K')->setWidth(40);

		// Formatos de celdas

		$text_format = array(
		    'numberformat' => array(
		        'code' => PHPExcel_Style_NumberFormat::FORMAT_TEXT
		    )
		);

		$sheet->getStyle('B4')->applyFromArray($text_format);
		$sheet->getStyle('D4:J4')->applyFromArray($text_format);

		$text_format = array(
			'alignment' => array(
	            'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
	            'vertical' => PHPExcel_Style_Alignment::VERTICAL_CENTER
	        )
		);

		$sheet->getStyle('A4')->applyFromArray($text_format);
		$sheet->getStyle('C4')->applyFromArray($text_format);

        $sheet->getRowDimension(1)->setRowHeight(27.75);
        $sheet->getRowDimension(3)->setRowHeight(30.75);
	}

}
