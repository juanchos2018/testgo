<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Customer_Model extends MY_Model {

	var $nro_inticard = '';
	var $barcode_inticard = '';
	var $barcode_card2 = '';
	var $name = '';
    var $last_name = '';
    var $doc_type  = '';
	var $id_number = '';
	var $address = '';
	var $born_date = '';
	var $city = '';
	var $phone_number = '';
	var $mobile_phone_number = '';
	var $mobile_phone_number2 = '';
	var $email = '';
	var $web = '';
	var $workplace = '';
	// var $registered_at = ''; # Este campo se omite porque la base de datos genera la fecha y hora actual
	var $last_purchase = '';
	var $level = '';
	var $gender = '';
	var $points = '';
	var $current_points = '';
	var $active = '';
	var $type = '';
	var $registered_by = '';
	var $registered_in = '';
	var $country = '';
	var $facebook = '';
	var $associate_dni = NULL;
	var $associate_name = NULL;
	var $associate_relationship = NULL;
	
	function __construct()
    {
        parent::__construct();
    }

    function getCliente($id)
	{
		try {
			$this->db->select('*');
			$this->db->from('customers');		
			$this->db->where('id',$id);
			//$this->db->join('maestro_detalle mad', 'mad.id_mad = cliente.id_actividad');	//? wdm! 
			//$this->db->join('maestro mas', 'mas.id_mas = mad.id_maestro');	
			$query = $this->db->get();

			if ($query->num_rows() > 0) {
				return $query->row_array();
			} else {
				return FALSE;
			}
		} catch (Exception $e) {
			echo "ERROR: ".$e->getMessage();
		}
	}

	function get_customers(){
		try {
			$this->db->select('*');
			$this->db->from('customers');		
			//$this->db->where('id',$id);
			//$this->db->join('maestro_detalle mad', 'mad.id_mad = cliente.id_actividad');	
			//$this->db->join('maestro mas', 'mas.id_mas = mad.id_maestro');	
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

    // Al parecer el siguiente controlador no se usa
    // function get_list()
    // {
    //     $this->db->select("
    //         id,
    //         id_number,
    //         TRIM(name || ' ' || COALESCE(last_name, '')) as full_name,
    //         barcode_inticard,
    //         active
    //     ", FALSE);

    //     $this->db->from('customers');
    //     $this->db->order_by('full_name asc');
    //     //$this->db->limit(5);
    //     $query = $this->db->get();

    //     return $query->result_array();
    // }


	function get_for_sale(){
		try {
			$this->db->select("
				id,
				name || ' ' || last_name as full_name,
				barcode_inticard,
				id_number
				");
			$this->db->from('customers');		
			//$this->db->where('id',$id);
			//$this->db->join('maestro_detalle mad', 'mad.id_mad = cliente.id_actividad');	
			//$this->db->join('maestro mas', 'mas.id_mas = mad.id_maestro');
			//$this->db->limit(1);	
			$this->db->limit(5);
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

	function get_for_sale2($terms, $field){
		try {
			$this->db->select("
				id,
				name || ' ' || last_name as full_name,
				barcode_inticard,
				id_number,
				address
				");
			$this->db->from('customers');		
			//$this->db->where('id',$id);
			//$this->db->join('maestro_detalle mad', 'mad.id_mad = cliente.id_actividad');	
			//$this->db->join('maestro mas', 'mas.id_mas = mad.id_maestro');
			//$this->db->limit(1);
			$this->db->where($field, $terms);
			$this->db->limit(1);
			$data = $this->db->get();
			
			
			if ($data->num_rows() > 0) {
				return $data->row_array();
			} else {
				return FALSE;
			}
		} catch (Exception $e) {
			echo "ERROR: ".$e->getMessage();
		}
	}

	function get_for_sale_by($terms)
	{
		$this->db->select("
			id,
            TRIM(name || ' ' || COALESCE(last_name, '')) as full_name,
            doc_type,
            id_number,
            address,
			type,
			barcode_inticard,
			barcode_card2
		", FALSE);

		$this->db->from('customers');
		$this->db->where("(id_number = '$terms' OR barcode_inticard = '$terms' OR barcode_card2 = '$terms' OR associate_dni = '$terms')");
		$this->db->where('active', 't');
		//$this->db->limit(1);

		$data = $this->db->get();
		
		if ($data->num_rows() > 1) {
			return $data->result_array();
		} else if ($data->num_rows() == 1) {
            return $data->row_array();
        } else {
			return FALSE;
		}
	}

	function get_list_for_sale($type, $start, $limit, $terms = NULL, $filter = NULL)
	{
		$this->db->select("
			id,
            TRIM(name || ' ' || COALESCE(last_name, '')) as full_name,
            doc_type,
			id_number,
			type,
			barcode_inticard,
			barcode_card2,
            address
		", FALSE);

		$this->db->from('customers');
		$this->db->where('active', 't');
		$this->db->limit($limit, $start);
		$this->db->order_by('name ASC');
        
        if (!is_null($type)) {
            $this->db->where('type', $type);
        }

		if (!is_null($terms)) {
			$this->db->where("(TRIM(name || ' ' || COALESCE(last_name, '')) ILIKE '%$terms%' OR id_number ILIKE '%$terms%')");
		}

        if (!is_null($filter)) {
            $this->db->where($filter['key'], $filter['value']);
        }

		$query = $this->db->get();
		
		if ($query->num_rows() > 0) {
			$data = $query->result_array();

			$this->db->from('customers');
			$this->db->where('active', 't');
        
            if (!is_null($type)) {
                $this->db->where('type', $type);
            }

			if (!is_null($terms)) {
				$this->db->where("(TRIM(name || ' ' || COALESCE(last_name, '')) ILIKE '%$terms%' OR id_number ILIKE '%$terms%')");
			}

            if (!is_null($filter)) {
                $this->db->where($filter['key'], $filter['value']);
            }

			array_unshift($data, $this->db->count_all_results());

			return $data;
		} else {
			return array(0);
		}
	}

	function get_list($type, $start, $limit, $terms = NULL, $filter = NULL)
	{
		$this->db->select("
			id,
			TRIM(name || ' ' || COALESCE(last_name, '')) as full_name,
			id_number,
			type,
			barcode_inticard,
			barcode_card2,
            address,
            active
		", FALSE);

		$this->db->from('customers');
		$this->db->limit($limit, $start);
		$this->db->order_by('name ASC');
        
        if (!is_null($type)) {
            $this->db->where('type', $type);
        }

		if (!is_null($terms)) {
			$this->db->where("(TRIM(name || ' ' || COALESCE(last_name, '')) ILIKE '%$terms%' OR id_number ILIKE '%$terms%' OR barcode_inticard ILIKE '%$terms%')");
		}

        if (!is_null($filter)) {
            $this->db->where($filter['key'], $filter['value']);
        }

		$query = $this->db->get();
		
		if ($query->num_rows() > 0) {
			$data = $query->result_array();

			$this->db->from('customers');
        
            if (!is_null($type)) {
                $this->db->where('type', $type);
            }

			if (!is_null($terms)) {
				$this->db->where("(TRIM(name || ' ' || COALESCE(last_name, '')) ILIKE '%$terms%' OR id_number ILIKE '%$terms%')");
			}

            if (!is_null($filter)) {
                $this->db->where($filter['key'], $filter['value']);
            }

			array_unshift($data, $this->db->count_all_results());

			return $data;
		} else {
			return array(0);
		}
	}

	function getOneCustomer($id)
    {
        return $this->db->get_where("customers", array("id_number" => $id))->row();
    }

    function add() {

    	$data = array(
		   'barcode_inticard' => $this->input->post('barcode_inticard') ,
		   'id_number' => $this->input->post('id_number') ,
		   'name' => $this->input->post('name'),
		   'last_name' => $this->input->post('last_name')
		);

        if ($this->db->insert('customers', $data)) {
            return $this->db->insert_id();
        } else {
            return FALSE;
        }
    }
    
    /*
        save devuelve FALSE en caso de que no se pueda insertar el registro y
        0 en caso de que se haya registrado el cliente pero no la empresa (si la hubiera)
    */
    function save()
    {
        if ($this->input->post('type') === 'PERSONA') {
            $nro_inticard = get_value('nro_inticard');
            $barcode_inticard = get_value('barcode_inticard');
            
            if ($barcode_inticard) {
                $this->nro_inticard = $nro_inticard;
                $this->barcode_inticard = $barcode_inticard;
            } else {
                $this->nro_inticard = NULL;
                $this->barcode_inticard = NULL;
            }
            
            $this->barcode_card2 = get_value('barcode_card2');
            $this->name = $this->input->post('name');
            $this->last_name = get_value('last_name');
            $this->doc_type = $this->input->post('doc_type');
            $this->id_number = $this->input->post('id_number');
            $this->address = get_value('address');
            $this->born_date = $this->input->post('born_date');
            $this->city = get_value('city');
            $this->phone_number = get_value('phone_number');
            $this->mobile_phone_number = get_value('mobile_phone_number');
            $this->mobile_phone_number2 = NULL;
            $this->email = get_value('email');
            $this->web = get_value('web');
            $this->workplace = get_value('workplace');
            $this->last_purchase = NULL;
            $this->level = NULL; // (PENDIENTE) Es una cadena(30) ¿qué va aquí?
            $this->gender = $this->input->post('gender');
            $this->points = 0;
            $this->current_points = 0;
            $this->active = 't';
            $this->type = 'PERSONA';
            $this->registered_by = $this->session->userdata('user_id'); // ID del usuario que está registrando al cliente
            $this->registered_in = $this->session->userdata('user_branch'); // ID de la sucursal donde se está registrando el cliente
            $this->country = get_value('country');
            $this->facebook = get_value('facebook');
            
            $partner = get_value('partner'); //si es asociado
            
            if (!is_null($partner) AND !empty($partner['id_number']) AND !empty($partner['full_name'])) {
                $this->associate_dni = $partner['id_number'];
                $this->associate_name = $partner['full_name'];
                $this->associate_relationship = $partner['relationship'];
            }
            
            if ($this->db->insert('customers', $this)) {
                $company = get_value('company');
                
                 // (Para caja) Si no se debe emitir el ticket a nombre de la empresa
                if (is_null($company) OR empty($company['id_number']) OR empty($company['name'])) {

                    $query = $this->db->query('SELECT LAST_INSERT_ID()');
                    $row = $query->row_array();
                    $LastIdInserted = $row['LAST_INSERT_ID()'];
                    return array(
                        'mi_registro' => 'mio 0',
                       // 'id' => $this->db->insert_id(),
                        'id' =>  $LastIdInserted,
                        'full_name' => $this->name . ($this->last_name ? ' ' . $this->last_name : ''),
                        'id_number' => $this->id_number,
                        'type' => $this->type,
                        'barcode_inticard' => $barcode_inticard,
                        'barcode_card2' => $this->barcode_card2
                    );
                } else {
                    $company_data = array(
                        'nro_inticard' => $this->nro_inticard,
                        'barcode_inticard' => $this->barcode_inticard,
                        'barcode_card2' => $this->barcode_card2,
                        'name' => $company['name'],
                        'doc_type' => $company['doc_type'],
                        'id_number' => $company['id_number'],
                        'address' => $company['address'],
                        'type' => 'EMPRESA',
                        'registered_by' => $this->registered_by,
                        'registered_in' => $this->registered_in
                    );
                    
                    $query = $this->db->get_where('customers', array(
                        'id_number' => $company['id_number'],
                        'type' => 'EMPRESA'
                    ));
                    
                    if ($query->num_rows()) { // La empresa ya se encontraba registrada previamente
                        $company_row = $query->row();
                        
                        // Se deben actualizar los datos de la empresa con los del nuevo cliente
                        if ($this->db->update('customers', $company_data, "id = $company_row->id")) {
                            return array(
                                'id' => $company_row->id,
                                'full_name' => $company_data['name'],
                                'doc_type' => $company['doc_type'],
                                'id_number' => $company_data['id_number'],
                                'address' => $company['address'],
                                'type' => $company_data['type'],
                                'mi_registro' => 'mio 1',
                                'barcode_inticard' => $company_data['barcode_inticard'],
                                'barcode_card2' => $company_data['barcode_card2']
                            );
                        } else {
                            return 0;
                        }
                    } else { // Se debe registrar la empresa
                        if ($this->db->insert('customers', $company_data)) {

                            $query = $this->db->query('SELECT LAST_INSERT_ID()');
                            $row = $query->row_array();
                            $LastIdInserted = $row['LAST_INSERT_ID()'];

                            
                            return array(
                                //'id' => $this->db->insert_id(),
                                'id' => $$LastIdInserted,
                                'full_name' => $company_data['name'],
                                'doc_type' => $company['doc_type'],
                                'id_number' => $company_data['id_number'],
                                'address' => $company['address'],
                                'type' => $company_data['type'],
                                'mi_registro' => 'mio 2',
                                'barcode_inticard' => $company_data['barcode_inticard'],
                                'barcode_card2' => $company_data['barcode_card2']
                            );
                        } else {
                            return 0; // No se pudo registrar la empresa
                        }
                    }
                }


                
            } else {
                return FALSE; // No se pudo insertar el registro
            }

        } else { // Se registra una empresa
            $customer_id = $this->input->post('customer_id');
            
            if ($customer_id) { // Se le debe relacionar con una empresa
                $this->db->select("
                    nro_inticard,
                    barcode_inticard,
                    barcode_card2
                ");
                $this->db->where('active', 't');
                $this->db->where('type', 'PERSONA');
                $this->db->where("(id_number LIKE '$customer_id' OR barcode_inticard LIKE '$customer_id' OR barcode_card2 LIKE '$customer_id')");
                
                $query = $this->db->get('customers');
                
                if ($query->num_rows()) {
                    $customer_row = $query->row();
                    
                    $this->nro_inticard = $customer_row->nro_inticard;
                    $this->barcode_inticard = $customer_row->barcode_inticard;
                    $this->barcode_card2 = $customer_row->barcode_card2;
                } else {
                    return 0; // El N° de tarjeta o documento no pertenece a ningún cliente
                }
            } else { // La empresa a registrar no está vinculada con ningún cliente
                $this->nro_inticard = NULL;
                $this->barcode_inticard = NULL;
                $this->barcode_card2 = NULL;
            }
            $this->doc_type = 6;
            $this->id_number = $this->input->post('id_number');
            $this->name = $this->input->post('name');
            $this->address = $this->input->post('address');

            unset($this->last_name);
            unset($this->born_date);
            unset($this->city);
            unset($this->phone_number);
            unset($this->mobile_phone_number);
            unset($this->mobile_phone_number2);
            unset($this->email);
            unset($this->web);
            unset($this->workplace);
            unset($this->last_purchase);
            unset($this->level);
            unset($this->gender);
            unset($this->points);
            unset($this->current_points);
            unset($this->country);
            unset($this->facebook);
            
            // Verificamos si ya existe una empresa registrada con ese RUC
            $this->db->select('id');
            $this->db->where('id_number', $this->id_number);
            $this->db->where('type', 'EMPRESA');
            
            $query = $this->db->get('customers');
            
            if ($query->num_rows()) {
                unset($this->active);
                unset($this->type);
                unset($this->registered_by);
                unset($this->registered_in);
                
                $customer_row = $query->row();
                
                if ($this->db->update('customers', $this, "id = $customer_row->id")) {
                    return array(
                        'id' => $customer_row->id,
                        'doc_type' => $this->doc_type,
                        'full_name' => $this->name,
                        'id_number' => $this->id_number,
                        'address' => $this->address,
                        'type' => 'EMPRESA',
                        'barcode_inticard' => $this->barcode_inticard,
                        'barcode_card2' => $this->barcode_card2
                    );
                } else {
                    return FALSE; // No se pudo actualizar el registro
                }
            } else {
                $this->active = 't';
                $this->type = 'EMPRESA';
                $this->registered_by = $this->session->userdata('user_id'); // ID del usuario que está registrando al cliente
                $this->registered_in = $this->session->userdata('user_branch'); // ID de la sucursal donde se está registrando el cliente
                
                if ($this->db->insert('customers', $this)) {

                    $query = $this->db->query('SELECT LAST_INSERT_ID()');
                    $row = $query->row_array();
                    $LastIdInserted = $row['LAST_INSERT_ID()'];

                    return array(
                        //'id' => $this->db->insert_id(),
                        'id' => $LastIdInserted,
                        'full_name' => $this->name,
                        'doc_type' => $this->doc_type,
                        'id_number' => $this->id_number,
                        'address' => $this->address,
                        'type' => 'EMPRESA',
                        'barcode_inticard' => $this->barcode_inticard,
                        'barcode_card2' => $this->barcode_card2
                    );
                } else {
                    return FALSE; // No se pudo agregar el registro
                }
            }
        }
    }

    function update()
    {
        $id = $this->input->post('id');
      
        if ($this->input->post('type') === 'PERSONA') {
            $nro_inticard = get_value('nro_inticard');
            $barcode_inticard = get_value('barcode_inticard');
            
            if ($barcode_inticard) {
                $this->nro_inticard = $nro_inticard;
                $this->barcode_inticard = $barcode_inticard;
            } else {
                $this->nro_inticard = NULL;
                $this->barcode_inticard = NULL;
            }
            if ($this->input->post('born_date') == '') {
                $this->born_date = NULL;
            } else {
                $this->born_date = $this->input->post('born_date');
            }
            
            $this->barcode_card2 = get_value('barcode_card2');
            $this->name = $this->input->post('name');
            $this->last_name = get_value('last_name');
            $this->doc_type = get_value('doc_type');
            $this->id_number = $this->input->post('id_number');
            $this->address = get_value('address');
           
            $this->city = get_value('city');
            $this->phone_number = get_value('phone_number');
            $this->mobile_phone_number = get_value('mobile_phone_number');
            $this->mobile_phone_number2 = NULL;
            $this->email = get_value('email');
            $this->web = get_value('web');
            $this->workplace = get_value('workplace');
            $this->last_purchase = NULL;
            $this->level = NULL; // (PENDIENTE) Es una cadena(30) ¿qué va aquí?
            $this->gender = $this->input->post('gender');
            $this->points = 0;
            $this->current_points = 0;
            $this->active = 't';
            $this->type = 'PERSONA';
            $this->registered_by = $this->session->userdata('user_id'); // ID del usuario que está registrando al cliente
            $this->registered_in = $this->session->userdata('user_branch'); // ID de la sucursal donde se está registrando el cliente
            $this->country = get_value('country');
            $this->facebook = get_value('facebook');
        } else { // si es una EMPRESA
            $nro_inticard = get_value('nro_inticard');
            $barcode_inticard = get_value('barcode_inticard');

            $this->doc_type = get_value('doc_type');
            $this->id_number = $this->input->post('id_number');
            $this->address = get_value('address');
            $this->name = $this->input->post('name');
            if ($barcode_inticard) {
                $this->nro_inticard = $nro_inticard;
                $this->barcode_inticard = $barcode_inticard;
            } else {
                $this->nro_inticard = NULL;
                $this->barcode_inticard = NULL;
            }
            if ($this->input->post('born_date') == '') { // born_data en EMPRESA puede ser para ANIVERSARIO
                $this->born_date = NULL;
            } else {
                $this->born_date = $this->input->post('born_date');
            }
            //Por defecto
            $this->active = 't';
            $this->type = 'EMPRESA';
            $this->points = 0;
            $this->current_points = 0;
            $this->registered_by = $this->session->userdata('user_id'); // ID del usuario que está registrando al cliente
            $this->registered_in = $this->session->userdata('user_branch'); // ID de la sucursal donde se está registrando el cliente
            $this->last_purchase = NULL;
            $this->level = NULL;
        }
        

        return $this->db->update('customers', $this, array('id' => $id));
    }
    
    function get_correlatives()
    {
        $branch_id = $this->session->userdata('user_branch');
        
        $this->db->select("
            nro_inticard, barcode_card2
        ", FALSE);

        $this->db->where('registered_in', $branch_id);
        $this->db->where('type', 'PERSONA');
        $this->db->where('nro_inticard IS NOT NULL AND barcode_card2 IS NOT NULL');
        $this->db->order_by('id DESC');
        $this->db->limit(1);

        $query = $this->db->get('customers');
        
        return $query->row();
    }
    
    function get_detail($id)
    {
        $this->db->select("
            customers.type,
            customers.id_number,
            customers.name,
            customers.gender,
            customers.born_date,
            customers.last_name,
            customers.address,
            customers.city,
            customers.country,
            customers.phone_number,
            customers.mobile_phone_number,
            customers.email,
            customers.facebook,
            customers.workplace,
            customers.web,
            customers.barcode_card2,
            customers.nro_inticard,
            customers.barcode_inticard,
            customers.current_points,
            CONCAT(employees.name, ' ', employees.last_name) AS registered_by
        ", FALSE);
        $this->db->where('customers.active', 't');
        $this->db->where('customers.id', $id);
        
        $this->db->from('customers');
        $this->db->join('users', 'customers.registered_by = users.id', 'left');
        $this->db->join('employees', 'users.id = employees.user_id', 'left');
        
        $query = $this->db->get();
        
        if ($query->num_rows()) {
            return $query->row_array();
        } else {
            return array();
        }
    }

    function get_for_concar()
    {
        try {
            $this->db->select("id_number, name || ' ' || last_name AS full_name", FALSE);
            $this->db->from('customers');
            $this->db->where('active', 't');
            $this->db->where('id < 100');

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
    
    function get_countries_array()
    {
        $this->db->select('country');
        $this->db->from('customer_countries');
        
        $query = $this->db->get();
        
        return $query->result();
    }
    
    function get_cities_array()
    {
        $this->db->select('city');
        $this->db->from('customer_cities');
        
        $query = $this->db->get();
        
        return $query->result();
    }
   
    function activate()
    {
        $id = $this->input->post('id');
        $value = $this->input->post('active');
        
        $this->db->update('customers', array('active' => $value), array('id' => $id));

        return $this->db->affected_rows() > 0;          
    }

    function delete()
    {
        $id = $this->input->post('id');
        return $this->db->delete('customers', array('id' => $id));
     
    }
    
    function remote_search()
    {
        $result = array();
		$page = ($this->input->get('page') ? $this->input->get('page') : 1);
		$display = ($this->input->get('display') ? $this->input->get('display') : 10);
        
        $this->_remote_search();
        
        $result['total_count'] = $this->db->count_all_results();
        
        if ($result['total_count'] > 0) {
			$this->db->select("
				customers.id,
				customers.barcode_card2,
				customers.barcode_inticard,
				TRIM(customers.name || ' ' || COALESCE(customers.last_name, '')) AS full_name,
				customers.id_number,
				customers.type
			", FALSE);

			$this->_remote_search();

			$this->db->limit($display, ($page - 1) * $display);
			$this->db->order_by('customers.name ASC, customers.last_name ASC');

			$query = $this->db->get();
			$result['results'] = $query->result_array();
			$result['pagination'] = array(
			    'more' => ($result['total_count'] > $page * $display)
			);
		} else {
			$result['results'] = array();
			$result['pagination'] = array(
			    'more' => FALSE
			);
		}

		return $result;
    }
    
    function _remote_search()
    {
        $query = trim($this->input->get('q'));
        
        $this->db->from('customers');
        $this->db->where('customers.active', 't');

        if (strpos($query, ' ') !== FALSE) {
            $terms = explode(' ', preg_replace("/[[:blank:]]+/", ' ', $query));

            $this->db->where("(TRIM(customers.name || ' ' || COALESCE(customers.last_name, '')) ILIKE '%" . implode('%', $terms) . "%')");
        } else {
            $this->db->where("(customers.name ILIKE '%$query%' OR customers.last_name ILIKE '%$query%' OR id_number ILIKE '%$query%' OR barcode_inticard ILIKE '%$query%' OR barcode_card2 ILIKE '%$query%')");
        }
    }

    function get_purchase_report($all = FALSE)
    {
        if (!$all) {
            $page = ($this->input->get('page') ? $this->input->get('page') : 1);
            $display = ($this->input->get('display') ? $this->input->get('display') : 10);

            $this->_get_purchase_report();

            $result = array(
                'page' => $page,
                'total_count' => $this->db->count_all_results(),
                'items' => array()
            );
        } else {
            $this->db->select("SUM(CASE WHEN sales.voucher = 'NOTA DE CREDITO' OR sales.voucher = 'TICKET NOTA DE CREDITO' THEN -sales.total_amount ELSE sales.total_amount END) AS amount", FALSE);
            $this->_get_purchase_report();
            
            $query = $this->db->get();
            $result = array('items' => array());
            
            if ($query->num_rows() > 0) {
                $row = $query->row_array();
                
                $result['total_amount'] = floatval($row['amount']);
            } else {
                $result['total_amount'] = 0;
            }
        }

        if ((isset($result['total_count']) and $result['total_count'] > 0) or (isset($result['total_amount']) and $result['total_amount'] > 0)) {
            // refund_origin_id / refund_target_id - o en la otra tabla?
            $date_selection = $all ? "TO_CHAR(sales.sale_date, 'DD/MM/YYYY') AS sale_date" : 'sales.sale_date';
            
            $this->db->select("
                cashiers.name || ' ' || cashiers.last_name AS cashier,
                $date_selection,
                sales.id AS sale_id,
                sales.total_amount,
                sales.voucher,
                sales.regime,
                sales.serie,
                sales.serial_number,
                branches.alias AS branch,
                companies.name AS company
            ", FALSE);

            $this->_get_purchase_report();

            $this->db->join('employees cashiers', 'sales.cashier_id = cashiers.user_id', 'left');
            $this->db->join('branches', 'sales.branch_id = branches.id');
            $this->db->join('companies', 'sales.company_id = companies.id');

            if (!$all) {
                $this->db->limit($display, ($page - 1) * $display);
            }

            $this->db->order_by('sales.sale_date DESC');

            $query = $this->db->get();

            $result['items'] = $query->result_array();
        }

        return $result;
    }

    function _get_purchase_report()
    {
        $this->set_date_report();
        
        $customer_id = $this->input->get('customer_id');

        $this->db->from('sales');

        $this->db->where('sales.customer_id', $customer_id);
        $this->db->where('sales.active', 't');
        $this->db->where('sales.state !=', 'CANCELED');
    }
    
    function get_for_report($id)
    {
        $this->db->select("
			TRIM(name || ' ' || COALESCE(last_name, '')) as full_name,
            id_number,
            CASE type WHEN 'EMPRESA'::customer_type THEN 'RUC' ELSE (CASE CHAR_LENGTH(id_number) WHEN 8 THEN 'DNI' ELSE 'Doc' END) END AS doc_type,
			barcode_inticard,
			barcode_card2
		", FALSE);

		$this->db->from('customers');
		$this->db->where('id', $id);
		$this->db->where('active', 't');

		$data = $this->db->get();
		
		if ($data->num_rows() > 0) {
			return $data->row_array();
		} else {
			return array();
		}
    }

    function get_purchase_report_detail($type)
    {
        $page = ($this->input->get('page') ? $this->input->get('page') : 1);
        $single_type = ($type === 'categories' ? 'category' : 'brand'); // Solo puede ser categories o brands
        $result = array('page' => $page);

        $this->db->select("
            COUNT(DISTINCT COALESCE(products.${single_type}_id, 0)) AS numrows
        ", FALSE);

        $this->_get_purchase_report_detail();

        $query = $this->db->get();

        if ($query->num_rows() > 0) {
            $row = $query->row_array();

            $result['total_count'] = intval($row['numrows']);
        } else {
            $result['total_count'] = 0;
        }

        if ($result['total_count'] > 0) {
            $this->db->select("
                COALESCE($type.description, '(NINGUNA)') AS key,
                SUM(CASE WHEN sales.voucher = 'NOTA DE CREDITO'::voucher_type OR sales.voucher = 'TICKET NOTA DE CREDITO'::voucher_type THEN -sale_details.subtotal ELSE sale_details.subtotal END) AS y
            ", FALSE);

            $this->_get_purchase_report_detail();
            $this->set_pagination_limit();

            $this->db->join("$type", "products.${single_type}_id = $type.id", 'left');
            $this->db->order_by('y', 'DESC');
            $this->db->group_by("$type.id");

            $query = $this->db->get();

            $result['items'] = $query->result_array();
        } else {
            $result['items'] = array();
        }

        return $result;
    }

    function _get_purchase_report_detail()
    {
        $this->set_date_report();
        
        $customer_id = $this->input->get('customer_id');

        $this->db->from('sale_details');
        $this->db->join('sales', 'sale_details.sale_id = sales.id');
        $this->db->join('product_barcodes', 'sale_details.product_barcode_id = product_barcodes.id');
        $this->db->join('product_details', 'product_barcodes.product_detail_id = product_details.id');
        $this->db->join('products', 'product_details.product_id = products.id');

        $this->db->where('sales.customer_id', $customer_id);
        $this->db->where('sales.active', 't');
        $this->db->where('sales.state !=', 'CANCELED');
    }

    private function set_date_report()
    {
        $start_date = $this->input->get('start_date');
        $end_date = $this->input->get('end_date');
        
        if ($start_date === 'year') {
            $this->db->where('EXTRACT(YEAR FROM sales.sale_date) =', $end_date);
            // $date_cond = "EXTRACT(YEAR FROM sales.sale_date) = $end_date";
        } elseif($start_date === 'month') {
            list($year, $month) = explode('-', $end_date);

            $this->db->where('EXTRACT(YEAR FROM sales.sale_date) =', $year);
            $this->db->where('EXTRACT(MONTH FROM sales.sale_date) =', $month);
            // $date_cond = "EXTRACT(YEAR FROM sales.sale_date) = $year AND EXTRACT(MONTH FROM sales.sale_date) = $month";
        } else {
            $this->db->where('sales.sale_date >=', $start_date);
            $this->db->where("sales.sale_date < DATE '$end_date' + 1", NULL, FALSE);
            // $date_cond = "sales.sale_date >= '$start_date' AND sales.sale_date < DATE '$end_date' + 1";
        }
    }
}

/* End of file customer_Model.php */
/* Location: ./application/models/customer_Model.php */