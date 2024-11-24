<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Customers extends MY_Controller {

    public function __construct()
    {
        parent::__construct();
        $this->load->model('customer_model');
        
    }

    public function index()
    {
        //$this->load->view('marketing/customers');    
       /* $start = ($this->input->get('start') ? $this->input->get('start') : 0);
        $limit = ($this->input->get('limit') ? $this->input->get('limit') : 10);
        $query = ($this->input->get('query') ? $this->input->get('query') : NULL);
        $filter = ($this->input->get('filter') ? $this->input->get('filter') : NULL);
        $type = NULL;
        $data['records'] = $this->customer_model->get_list_for_sale($type, $start, $limit, $query, $filter);
*/

        // $data['records'] = $this->customer_model->get_list();
        $data = array();
        $this->load->view('customers/index', $data);

    }

    public function search()
    {
    	$id=$this->input->post("cod");
   
    	echo json_encode($this->customer_model->getOneCustomer($id));
    }

    public function lists()
    {
    	echo json_encode($this->customer_model->get_customers());
    }

    public function get_for_sale_by($terms)
    {
        $customer = $this->customer_model->get_for_sale_by($terms);

        if ($customer !== FALSE) {
            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode($customer));
        } else {
            $this->error_output('400');
        }
    }

    public function get_for_sale($terms, $field = 'barcode_inticard')
    {
        $product = $this->customer_model->get_for_sale2($terms, $field);

        if ($product !== FALSE) {
            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode($product));
        } else {
            $this->error_output('400');
        }
    }

    public function get_list_for_sale($type = NULL)
    {
        $start = ($this->input->get('start') ? $this->input->get('start') : 0);
        $limit = ($this->input->get('limit') ? $this->input->get('limit') : 10);
        $query = ($this->input->get('query') ? $this->input->get('query') : NULL);
        $filter = ($this->input->get('filter') ? $this->input->get('filter') : NULL);
        
        $data = $this->customer_model->get_list_for_sale($type, $start, $limit, $query, $filter);

        $this->output
            ->set_content_type('application/json')
            ->set_output(json_encode($data));
    }

    public function get_list($type = NULL)
    {
        $start = ($this->input->get('start') ? $this->input->get('start') : 0);
        $limit = ($this->input->get('limit') ? $this->input->get('limit') : 10);
        $query = ($this->input->get('query') ? $this->input->get('query') : NULL);
        $filter = ($this->input->get('filter') ? $this->input->get('filter') : NULL);
        
        $data = $this->customer_model->get_list($type, $start, $limit, $query, $filter);

        $this->output
            ->set_content_type('application/json')
            ->set_output(json_encode($data));
    }

    /* OJO: el siguiente método se debería eliminar una vez que se deje de usar dataTable */
    public function people_list_for_sale()
    {
        $this->load->database();
        $this->load->library('SSP');

        $table = 'customers';
        $primaryKey = 'id';
        $columns = array(
            array( 'db' => 'id', 'dt' => 0 ),
            array( 'db' => 'id_number', 'dt' => 1 ),
            array( 'db' => 'name', 'dt' => 2 ),
            array( 'db' => 'last_name', 'dt' => 3 ),
            array( 'db' => 'barcode_card2' ,'dt' => 4)
        );
        $sql_details = array(
            'user' => $this->db->username,
            'pass' => $this->db->password,
            'db' => $this->db->database,
            'host' => $this->db->hostname
        );

        $where = "type = 'PERSONA'";

        $this->output
            ->set_content_type('application/json')
            ->set_output(json_encode($this->ssp->simple( $_GET, $sql_details, $table, $primaryKey, $columns, $where )));
    }

    public function company_list_for_sale()
    {
        $this->load->database();
        $this->load->library('SSP');

        $table = 'customers';
        $primaryKey = 'id';
        $columns = array(
            array( 'db' => 'id', 'dt' => 0 ),
            array( 'db' => 'id_number', 'dt' => 1 ),
            array( 'db' => 'name', 'dt' => 2 )
        );
        $sql_details = array(
            'user' => $this->db->username,
            'pass' => $this->db->password,
            'db' => $this->db->database,
            'host' => $this->db->hostname
        );

        $where = "type = 'EMPRESA'";

        $this->output
            ->set_content_type('application/json')
            ->set_output(json_encode($this->ssp->simple( $_GET, $sql_details, $table, $primaryKey, $columns, $where )));
    }
    public function edit($id)
    {
        $data['record'] = $this->customer_model->getCliente($id);

        $this->load->view('customers/edit', $data);
    }
    
    public function save()
    {
        if ($this->input->is_post()) {
            $is_company = ($this->input->post('type') === 'EMPRESA');
            
            if (!$is_company) {
                $this->form_validation->set_rules('id_number', 'DNI o documento', 'required|is_unique[customers.id_number]');
                $this->form_validation->set_rules('name', 'Nombre', 'required');
                $this->form_validation->set_rules('born_date', 'Fecha de nacimiento', 'required|is_valid_date');
                $this->form_validation->set_rules('gender', 'Sexo', 'required|exact_length[1]');
            } else {
                $this->form_validation->set_rules('id_number', 'RUC', 'required|numeric|exact_length[11]');
                $this->form_validation->set_rules('name', 'Razón social', 'required');
            }
            
            $this->form_validation->set_message('required', 'El campo %s es requerido');
            $this->form_validation->set_message('is_unique', 'Ya existe otro cliente con el %s especificado');
            $this->form_validation->set_message('is_valid_date', 'La %s no es válida');
            $this->form_validation->set_message('exact_length', 'El formato de %s no es válido');
            $this->form_validation->set_message('numeric', 'El formato de %s no es válido');
            
            if ($this->form_validation->run() !== FALSE) {
                $saved = $this->customer_model->save();
                
                if ($saved) {
                    $this->json_output($saved);
                } else {
                    if (!$is_company) {
                        if ($saved === 0) {
                            $this->error_output('400', 'Se ha registrado el cliente, pero no se pudo registrar la empresa');
                        } else {
                            $this->error_output('400', 'Hubo un error al intentar guardar');
                        }
                    } else {
                        if ($saved === 0) {
                            $this->error_output('400', 'No se pudo encontrar el cliente al que se desea vincular');
                        } else {
                            $this->error_output('400', 'Hubo un error al intentar guardar');
                        }
                    }
                }
            } else {
                $errors = $this->form_validation->error_array();
                
                if (count($errors)) {
                    $message = array_shift($errors);
                } else {
                    $message = 'Ocurrió un error';
                }
                
                $this->error_output('400', $message);
            }
        }
    }
    
    public function save_from_sale()
    {
        if ($this->input->is_post()) {
            $is_company = ($this->input->post('type') === 'EMPRESA');
            
            if (!$is_company) {
                $this->form_validation->set_rules('id_number', 'DNI o documento', 'required|is_unique[customers.id_number]');
                $this->form_validation->set_rules('name', 'Nombre', 'required');
                $this->form_validation->set_rules('born_date', 'Fecha de nacimiento', 'required|is_valid_date');
                $this->form_validation->set_rules('gender', 'Sexo', 'required|exact_length[1]');
            } else {
                $this->form_validation->set_rules('id_number', 'RUC', 'required|numeric|exact_length[11]');
                $this->form_validation->set_rules('name', 'Razón social', 'required');
            }
            
            $this->form_validation->set_message('required', 'El campo %s es requerido');
            $this->form_validation->set_message('is_unique', 'Ya existe otro cliente con el %s especificado');
            $this->form_validation->set_message('is_valid_date', 'La %s no es válida');
            $this->form_validation->set_message('exact_length', 'El formato de %s no es válido');
            $this->form_validation->set_message('numeric', 'El formato de %s no es válido');
            
            if ($this->form_validation->run() !== FALSE) {
                //$has_company = (!empty($_POST['company']['id_number']) AND !empty($_POST['company']['name']));
                
                $saved = $this->customer_model->save();
                
                if ($saved) {
                    $this->json_output($saved);
                } else {
                    if (!$is_company) {
                        if ($saved === 0) {
                            $this->error_output('400', 'Se ha registrado el cliente, pero no se pudo registrar la empresa');
                        } else {
                            $this->error_output('400', 'Hubo un error al intentar guardar');
                        }
                    } else {
                        if ($saved === 0) {
                            $this->error_output('400', 'No se pudo encontrar el cliente al que se desea vincular');
                        } else {
                            $this->error_output('400', 'Hubo un error al intentar guardar');
                        }
                    }
                }
            } else {
                $errors = $this->form_validation->error_array();
                
                if (count($errors)) {
                    $message = array_shift($errors);
                } else {
                    $message = 'Ocurrió un error';
                }
                
                $this->error_output('400', $message);
            }
        }
    }

    public function update()
    {
        if (!empty($this->input->is_post())){
            $is_company = ($this->input->post('type') === 'EMPRESA');
            
            if (!$is_company) {
                $this->form_validation->set_rules('doc_type', 'Tipo de Documento', 'required');
                $this->form_validation->set_rules('id_number', 'DNI o documento', 'required');
                $this->form_validation->set_rules('name', 'Nombre', 'required');
                $this->form_validation->set_rules('born_date', 'Fecha de nacimiento', 'is_valid_date');
                $this->form_validation->set_rules('gender', 'Sexo', 'required|exact_length[1]');
            } else {
                $this->form_validation->set_rules('id_number', 'RUC', 'required|numeric|exact_length[11]');
                $this->form_validation->set_rules('name', 'Razón social', 'required');
            }
            
            $this->form_validation->set_message('required', 'El campo %s es requerido');
            $this->form_validation->set_message('is_unique', 'Ya existe otro cliente con el %s especificado');
            $this->form_validation->set_message('is_valid_date', 'La %s no es válida');
            $this->form_validation->set_message('exact_length', 'El formato de %s no es válido');
            $this->form_validation->set_message('numeric', 'El formato de %s no es válido');
            
            if ($this->form_validation->run() !== FALSE) {
                $updated = $this->customer_model->update();

                if ($updated) {
                    $this->json_output($updated);
                } else {
                    $this->error_output('400', 'Hubo un error al intentar guardar');
                }
            } else {
                $errors = $this->form_validation->error_array();
                
                if (count($errors)) {
                    $message = array_shift($errors);
                } else {
                    $message = 'Ocurrió un error';
                }
                
                $this->error_output('400', $message);
            }
        } else {
            $this->error_output('400','No se recibieron datos');
        }
    }

    public function get_countries_array()
    {
        $data = $this->customer_model->get_countries_array();
        $result = array();
        
        foreach ($data as $row) {
            array_push($result, $row->country);
        }
        
        $this->json_output($result);
    }
    
    public function get_cities_array()
    {
        $data = $this->customer_model->get_cities_array();
        $result = array();
        
        foreach ($data as $row) {
            array_push($result, $row->city);
        }
        
        $this->json_output($result);
    }
    
    public function get_correlatives()
    {
        $data = $this->customer_model->get_correlatives();
        
        $this->json_output(array(
            'nro_inticard' => intval($data->nro_inticard),
            'barcode_card2' => intval($data->barcode_card2)
        ));
    }
    
    public function get_detail($id)
    {
        $data = $this->customer_model->get_detail($id);
        
        $this->json_output($data);
    }

    public function add()
    {
       /* $id_number = $this->input->post('id_number');
        if (!empty($id_number)) {
            $insert = $this->customer_model->add();
            
            if ($insert) {
                $this->output
                    ->set_content_type('application/json')
                    ->set_output(json_encode(array(
                        'id' => $insert,
                        'full_name' => $this->input->post('name') . ' ' . $this->input->post('last_name')
                    )));
            } // else: mostrar algún JSON de error
            
        } else {*/
            // Mostrar el formulario para agregar empleados
            $this->load->view('customers/add');
        //}
    }

    public function activate()
    {
        if ($this->input->is_post()) {
            if ($this->customer_model->activate()) {
                $this->output->set_output('ok');
            } else {
                $this->error_output('400','No se pudo actualizar el estado');
            }
        } else {
            $this->error_output('400','No se recibieron datos');
        }
    }

    public function delete()
    {
        if ($this->input->is_post()) {
            if ($this->customer_model->delete()) {
                $this->output->set_output('ok');
            } else {
                $this->error_output('400', 'Ocurrió un error al intentar eliminar el registro');
            }
        } else {
            $this->error_output('400', 'No se recibieron datos');
        }
    }
    
    public function reports()
    {
        $this->load->view('customers/reports');
    }
    
    public function remote_search()
    {
        $data = $this->customer_model->remote_search();
        
        $this->json_output($data);
    }

    public function purchase_report()
    {
        $data = $this->customer_model->get_purchase_report();
        
        $this->json_output($data);
    }

    public function purchase_report_detail($type = 'categories')
    {
        if ($type === 'categories' or $type === 'brands') {
            $data = $this->customer_model->get_purchase_report_detail($type);

            $this->json_output($data);
        } else {
            $this->error_output(400, "Tipo no permitido: $type");
        }
    }
    
    public function purchase_report_printable()
    {
        $customer_id = $this->input->get('customer_id');
        $start_date = $this->input->get('start_date');
        $end_date = $this->input->get('end_date');
        
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
        
        $customer = $this->customer_model->get_for_report($customer_id);
        $info = array();

        if (!is_null($customer['full_name'])) {
            $info['Cliente'] = $customer['full_name'];
        }

        $info[$customer['doc_type'] . ' Nª'] = $customer['id_number'];

        if (!is_null($customer['barcode_card2'])) {
            $info['Tarjeta Nº'] = $customer['barcode_card2'];
        } elseif (!is_null($customer['barcode_inticard'])) {
            $info['Tarj. Inticard'] = $customer['barcode_inticard'];
        }
        
        $info['Período'] = $date_text;
        
        $this->load->library('printable_report', array(
            'orientation' => 'L',
            'title' => 'Historial de compras',
            'info_width' => array(35),
            'info' => $info
        ), 'pdf');

        $this->pdf->Cell(10, 0, 'Nº', 1, FALSE, 'C', TRUE, '', 0, FALSE);
        $this->pdf->Cell(25, 0, 'Fecha', 1, FALSE, 'C', TRUE, '', 0, FALSE);
        $this->pdf->Cell($this->pdf->getRemainingWidth() - 150, 0, 'Cajero', 1, FALSE, 'C', TRUE, '', 0, FALSE);
        $this->pdf->Cell(40, 0, 'Documento', 1, FALSE, 'C', TRUE, '', 0, FALSE);
        $this->pdf->Cell(25, 0, 'Régimen', 1, FALSE, 'C', TRUE, '', 0, FALSE);
        $this->pdf->Cell(25, 0, 'Empresa', 1, FALSE, 'C', TRUE, '', 0, FALSE);
        $this->pdf->Cell(30, 0, 'Sucursal', 1, FALSE, 'C', TRUE, '', 0, FALSE);
        $this->pdf->Cell(30, 0, 'Monto', 1, FALSE, 'C', TRUE, '', 0, FALSE);
        
        $this->pdf->Ln();
        
        $vouchers = array(
            'TICKET' => 'TCK',
            'BOLETA' => 'BOL',
            'FACTURA' => 'FAC',
            'NOTA DE CREDITO' => 'NC',
            'TICKET NOTA DE CREDITO' => 'TCK. NC'
        );
        
        $data = $this->customer_model->get_purchase_report(TRUE);

        if (count($data['items']) > 0) {
            foreach ($data['items'] as $index => $item) {
                $this->pdf->Cell(10, 0, $index + 1, 1, FALSE, 'C', FALSE, '', 0, FALSE);
                $this->pdf->Cell(25, 0, $item['sale_date'], 1, FALSE, 'C', FALSE, '', 0, FALSE);
                $this->pdf->MultiCell($this->pdf->getRemainingWidth() - 150, 0, $item['cashier'], 1, 'L', FALSE, 0, '', '', TRUE, 0, FALSE, TRUE, $this->pdf->getLastH(), 'T', TRUE);
                $this->pdf->Cell(40, 0, $vouchers[$item['voucher']] . '. ' . str_pad($item['serie'], 3, '0', STR_PAD_LEFT) . '-' . str_pad($item['serial_number'], 7, '0', STR_PAD_LEFT), 1, FALSE, 'L', FALSE, '', 0, FALSE);
                $this->pdf->Cell(25, 0, ucfirst(strtolower($item['regime'])), 1, FALSE, 'L', FALSE, '', 0, FALSE);
                $this->pdf->Cell(25, 0, $item['company'], 1, FALSE, 'L', FALSE, '', 0, FALSE);
                $this->pdf->Cell(30, 0, $item['branch'], 1, FALSE, 'L', FALSE, '', 0, FALSE);
                $this->pdf->Cell(30, 0, 'S/' . number_format((strpos($item['voucher'], 'NOTA DE CREDITO') === FALSE ? 1 : -1) * $item['total_amount'], 2), 1, FALSE, 'R', FALSE, '', 0, FALSE);
                $this->pdf->Ln();
            }
            
            $this->pdf->Cell($this->pdf->getRemainingWidth() - 30, 0, 'TOTAL', 0, FALSE, 'R', FALSE, '', 0, FALSE);
            $this->pdf->Cell(30, 0, 'S/' . number_format($data['total_amount'], 2), 1, FALSE, 'R', FALSE, '', 0, FALSE);
        }
        
        $this->pdf->Output('historial_de_compras.pdf', 'I');
    }

}

/* End of file MY_Controller.php */
/* Location: ./application/core/MY_Controller.php */