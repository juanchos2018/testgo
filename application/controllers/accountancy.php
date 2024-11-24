<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Accountancy extends MY_Controller {

	public function __construct()
	{
		parent::__construct();
	}

	public function customers() {
		
		$this->load->view('accountancy/customers');
	}

	public function get_customers()
	{
		$this->load->model('customer_model');
		$data = $this->customer_model->get_for_concar();
		$this->json_output($data);
	}

	public function get_sales()
	{
		$this->load->model('sale_model');
		$data = $this->sale_model->get_for_concar(NULL,NULL);
		$this->json_output($data);
	}

	public function sales()
	{
		$this->load->view('accountancy/sales');
	}

	public function exchange_rates()
	{
		$this->load->model('exchange_rate_model');

		$data['records'] = $this->exchange_rate_model->get_all();

		$this->load->view('accountancy/exchange_rates', $data);
	}

	public function edit_exchange_rate($id)
	{
		$this->load->model('exchange_rate_model');

		$data['record'] = $this->exchange_rate_model->get($id);

		$this->load->view('accountancy/edit_exchange_rate', $data);
	}

	public function update_exchange_rate()
	{
		$this->load->model('exchange_rate_model');

		if ($this->input->is_post()) {
			if ($this->exchange_rate_model->update()) {
				$this->output->set_output('ok');
			} else {
				$this->error_output(400, 'Ocurrió un error al actualizar el tipo de cambio');
			}
		} else {
			$this->error_output(400, 'No se recibieron datos');
		}
	}

	public function test()
	{
		$this->load->model('sale_model');
		$data = $this->sale_model->get_for_concar(NULL,NULL);
		print_r('<pre>');
		print_r($data);
		print_r('</pre>');
	}

	public function template($action, $begin_date, $end_date)
	{
		if($action === 'data'){
			$this->load->model('sale_model');

			$sales = $this->sale_model->get_for_concar($begin_date,$end_date);

			if($sales !== FALSE){
				$this->json_output($sales);
			}else{
				$this->error_output('400','$sales is FALSE');
			}
		} elseif ($action === 'file') {
			$this->set_header_template();
			$this->generate_template($begin_date,$end_date);
		}
	}

	private function set_header_template()
	{
		header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		header('Content-Disposition: attachment; filename="reporte_de_ventas.xlsx"');
	}

	private function generate_template()
	{
		$this->load->library('PHPExcel');

		$excel = new PHPExcel();

		$excel->getProperties()
			->setCreator("Go!")
			->setLastModifiedBy("Go!")
			->setTitle("Registro de ventas-Concar")
			->setSubject("Registro de ventas")
			->setDescription("Registro de ventas");

		/*if ($begin_date !== 'category' || $end_date !== 'brand') {
			$this->load->model('product_model');

			$groups = $this->product_model->get_group_for_purchase_template($group_by);

			foreach ($groups as $index => $group) {
				$this->build_sheet($excel, $group, $index);
			}
		} else {
			$this->build_sheet($excel);
		}*/
		$this->build_sheet($excel);
        $writer = PHPExcel_IOFactory::createWriter($excel, 'Excel2007');
		$writer->save('php://output');
	}

}

/* End of file accountant.php */
/* Location: ./application/controllers/accountant.php */