<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Manpower extends MY_Controller {

	public function __construct()
	{
		parent::__construct();
	}	

    public function reports()
    {
    	$this->load->model('employee_model');

    	$employees = $this->employee_model->get_list(array('employees.active' => 't'));

        $this->load->view('manpower/reports', compact('employees'));
    }

    public function summary_report()
    {
    	$this->load->model('employee_model');

    	$data = $this->employee_model->get_summary_report();

    	$this->json_output($data);
    }

    public function sale_report()
    {
        $this->load->model('employee_model');

        $data = $this->employee_model->get_sale_report();

        $this->json_output($data);
    }

    public function summary_printable()
    {
        $company_id = $this->input->get('company_id');
        $start_date = $this->input->get('start_date');
        $end_date = $this->input->get('end_date');
        $user_companies = json_decode($this->session->userdata('user_companies'), TRUE);
        $branch_name = $this->session->userdata('user_branch_name');
        $company_key = array_search($company_id, array_column($user_companies, 'company_id'));
        $company = $company_key !== FALSE ? $user_companies[$company_key] : array();
        $months = array('Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre');
        
        switch ($start_date) {
            case 'year':
                $date_text = $end_date;
                break;
            case 'month':
                list($year, $month) = explode('-', $end_date);
                $date_text = $months[$month - 1] . " $year";
                break;
            default:
                $start_datetime = new DateTime($start_date);
                $end_datetime = new DateTime($end_date);
                
                $date_text = $start_datetime->format('d/m/Y') . ' — ' . $end_datetime->format('d/m/Y');
        }
        
        $this->load->model('employee_model');
        $this->load->library('printable_report', array(
            'title' => 'Resumen de ventas por vendedores',
            'info_width' => array(0, 60),
            'info' => array(
                'Empresa'   => $company['company_name'],
                'Sucursal'  => $branch_name,
                'Período'   => $date_text
            )
        ), 'pdf');

        $data = $this->employee_model->get_all_summary_report();
        
        $this->pdf->Cell(10, 0, 'Nº', 1, FALSE, 'C', TRUE, '', 0, FALSE);
        $this->pdf->Cell(15, 0, 'Cód.', 1, FALSE, 'C', TRUE, '', 0, FALSE);
        $this->pdf->Cell($this->pdf->getRemainingWidth() - 50, 0, 'Nombres y apellidos', 1, FALSE, 'C', TRUE, '', 0, FALSE);
        $this->pdf->Cell(30, 0, 'Monto', 1, FALSE, 'C', TRUE, '', 0, FALSE);
        $this->pdf->Cell(20, 0, 'Cantidad', 1, FALSE, 'C', TRUE, '', 0, FALSE);
        
        $this->pdf->Ln();
        
        $this->pdf->setFillColor(221, 221, 221);
        
        if (count($data) > 0) {
            foreach ($data as $index => $item) {
                $no_sales = intval($item['quantity']) === 0;
                
                $this->pdf->Cell(10, 0, $index + 1, 1, FALSE, 'C', $no_sales, '', 0, FALSE);
                $this->pdf->Cell(15, 0, str_pad($item['id'], 4, '0', STR_PAD_LEFT), 1, FALSE, 'L', $no_sales, '', 0, FALSE);
                $this->pdf->MultiCell($this->pdf->getRemainingWidth() - 50, 0, $item['full_name'], 1, 'L', $no_sales, 0, '', '', TRUE, 0, FALSE, TRUE, $this->pdf->getLastH(), 'T', TRUE);
                $this->pdf->Cell(30, 0, 'S/' . number_format($item['amount'], 2), 1, FALSE, 'R', $no_sales, '', 0, FALSE);
                $this->pdf->Cell(20, 0, number_format($item['quantity']), 1, FALSE, 'C', $no_sales, '', 0, FALSE);
                $this->pdf->Ln();
            }
        }
        
        $this->pdf->Output('resumen_de_ventas.pdf', 'I');
    }
    
    public function sale_printable()
    {
        $employee_id = $this->input->get('employee_id');
        $company_id = $this->input->get('company_id');
        $start_date = $this->input->get('start_date');
        $end_date = $this->input->get('end_date');
        $user_companies = json_decode($this->session->userdata('user_companies'), TRUE);
        $branch_name = $this->session->userdata('user_branch_name');
        $company_key = array_search($company_id, array_column($user_companies, 'company_id'));
        $company = $company_key !== FALSE ? $user_companies[$company_key] : '';
        $months = array('Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre');
        
        switch ($start_date) {
            case 'year':
                $date_text = $end_date;
                break;
            case 'month':
                list($year, $month) = explode('-', $end_date);
                $date_text = $months[$month - 1] . " $year";
                break;
            default:
                $start_datetime = new DateTime($start_date);
                $end_datetime = new DateTime($end_date);
                
                $date_text = $start_datetime->format('d/m/Y') . ' — ' . $end_datetime->format('d/m/Y');
        }
        
        $this->load->model('employee_model');
        $employee = $this->employee_model->get($employee_id);
        
        $this->load->library('printable_report', array(
            'title' => 'Detalle de ventas de vendedor',
            'info' => array(
                'Empresa'       => $company['company_name'],
                'Sucursal'      => $branch_name,
                'Período'       => $date_text,
                'Trabajador'    => $employee['code'] . ' - ' . $employee['full_name']
            )
        ), 'pdf');
        
        
        $data = $this->employee_model->get_all_sale_report();
        
        $this->pdf->Cell(35, 0, 'Fecha', 1, FALSE, 'C', TRUE, '', 0, FALSE);
        $this->pdf->Cell(35, 0, 'Día', 1, FALSE, 'C', TRUE, '', 0, FALSE);
        $this->pdf->Cell(30, 0, 'Monto', 1, FALSE, 'C', TRUE, '', 0, FALSE);
        $this->pdf->Cell(25, 0, 'Cantidad', 1, FALSE, 'C', TRUE, '', 0, FALSE);
        
        $this->pdf->Ln();
        
        $this->pdf->setFillColor(221, 221, 221);
        
        if (count($data) > 0) {
            $initial_dow = intval(date('w', strtotime($data[0]['date'])));
            $days = array('Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado');
            
            foreach ($data as $index => $item) {
                $no_sales = intval($item['quantity']) === 0;
                
                $this->pdf->Cell(35, 0, date('d/m/Y', strtotime($item['date'])), 1, FALSE, 'C', $no_sales, '', 0, FALSE);
                $this->pdf->Cell(35, 0, $days[($initial_dow + $index) % 7], 1, FALSE, 'L', $no_sales, '', 0, FALSE);
                $this->pdf->Cell(30, 0, 'S/' . number_format($item['amount'], 2), 1, FALSE, 'R', $no_sales, '', 0, FALSE);
                $this->pdf->Cell(25, 0, number_format($item['quantity']), 1, FALSE, 'C', $no_sales, '', 0, FALSE);
                $this->pdf->Ln();
            }
        }
        
        $this->pdf->Output('detalle_de_ventas.pdf', 'I');
    }

}
