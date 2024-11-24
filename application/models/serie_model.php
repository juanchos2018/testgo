<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Serie_model extends CI_Model {

	var $serie = '';
	var $serial_number = '';
	var $voucher = '';
	var $regime = '';
	var $subsidiary_journal = '';
	var $sale_point_id = '';
	var $branch_detail_id = '';

	function __construct()
    {
        parent::__construct();
    }

    function get($id) {
        $this->db->select("
            id,
            serie,
            serial_number,
            CASE WHEN voucher = 'TICKET NOTA DE CREDITO' THEN 'NOTA DE CREDITO' ELSE voucher END AS voucher,
            subsidiary_journal,
            company_id,
            CASE WHEN voucher = 'TICKET NOTA DE CREDITO' THEN TRUE ELSE FALSE END AS by_ticket_printer,
			regime
        ", FALSE);

        $this->db->from('v_series');
        $this->db->where('id', $id);

        $query = $this->db->get();

        if ($query->num_rows()) {
            return $query->row_array();
        } else {
            return FALSE;
        }
    }

    function get_for_ticket()
    {
    	//$sale_point_id = $this->session->userdata('user_sale_point');

    	$this->db->select('
			series.serie,
			series.serial_number
		');

		$this->db->from('series');

		$this->db->where('series.voucher', 'TICKET');
		//$this->db->where('series.sale_point_id', $sale_point_id);

		$query = $this->db->get();

		if ($query->num_rows() === 0) {
			return FALSE;
		} else {
			return $query->row();
		}
    }

    function get_list($branch_id = NULL)
    {
        if (is_null($branch_id)) {
            $branch_id = $this->session->userdata('user_branch');
        }

        $this->db->select("
            id,
            serie,
            serial_number,
            CASE WHEN voucher = 'TICKET NOTA DE CREDITO' THEN 'NOTA DE CREDITO' ELSE voucher END AS voucher,
            subsidiary_journal,
            company_name AS company,
            sale_point_id,
            sale_point_name,
			regime
        ", FALSE);

        $this->db->from('v_series');

        $this->db->where('branch_id', $branch_id);

        $this->db->order_by('company_name ASC, voucher ASC, serie ASC, serial_number ASC');

        $query = $this->db->get();

        return $query->result_array();
    }

    function get_next($voucher, $company_id, $regime = NULL, $branch_id = NULL)
    {
        if (is_null($branch_id)) {
            $branch_id = $this->session->userdata('user_branch');
        }

    	$this->db->select('
			series.serie,
			series.serial_number
		');

		$this->db->from('series');
        $this->db->join('branch_details', 'series.branch_detail_id = branch_details.id');

		$this->db->where('branch_details.company_id', $company_id);
		$this->db->where('branch_details.branch_id', $branch_id);

		$this->db->where('series.voucher', $voucher);

		if (strpos($voucher, 'TICKET') === FALSE) { // Se trata de una venta/nota de crédito manual por lo que sale_point_id debe ser NULL
		    $this->db->where('series.sale_point_id', NULL);

			if (($voucher === 'BOLETA' or $voucher === 'FACTURA') and !empty($regime)) { // Si es BOLETA o FACTURA manual, se discrimina por regime
				$this->db->where('series.regime', $regime);
			}
		}

		$this->db->limit(1);

		$query = $this->db->get();

		if ($query->num_rows() === 0) {
			return FALSE;
		} else {
			return $query->row_array();
		}
    }

    function save($data = NULL) {
        if (is_null($data)) {
            $this->serie = $this->input->post('serie');
            $this->serial_number = (empty($this->input->post('serial_number')) ? 1 : $this->input->post('serial_number'));
            $this->voucher = $this->input->post('voucher');
            $this->subsidiary_journal = (empty($this->input->post('subsidiary_journal')) ? NULL : $this->input->post('subsidiary_journal'));
            $this->sale_point_id = (empty($this->input->post('sale_point_id')) ? NULL : $this->input->post('sale_point_id'));
            $this->branch_detail_id = $this->input->post('branch_detail_id');

			if ($this->voucher === 'BOLETA' or $this->voucher === 'FACTURA') {
				$this->regime = $this->input->post('regime');
			} else {
				$this->regime = NULL;
			}

            $inserted = $this->db->insert('series', $this);
        } else {
            $inserted = $this->db->insert('series', $data);
        }

    	if ($inserted) {
            return $this->db->insert_id();
        } else {
            return FALSE;
        }
    }

    function update($data = NULL)
    {
        if (is_null($data)) {
            $id = $this->input->post('id');

            $this->serie = $this->input->post('serie');
            $this->serial_number = (empty($this->input->post('serial_number')) ? 1 : $this->input->post('serial_number'));
            $this->voucher = $this->input->post('voucher');
            $this->subsidiary_journal = (empty($this->input->post('subsidiary_journal')) ? NULL : $this->input->post('subsidiary_journal'));
            $this->branch_detail_id = $this->input->post('branch_detail_id');

			if ($this->voucher === 'BOLETA' or $this->voucher === 'FACTURA') {
				$this->regime = $this->input->post('regime');
			} else {
				$this->regime = NULL;
			}

			unset($this->sale_point_id); // No se puede editar el punto de venta de una ticketera mediante edición simple (debe ser por puntos de venta)

            $this->db->update('series', $this, array('id' => $id));
        } else { // Se pretenden guardar varios datos a la vez
    	   $this->db->update_batch('series', $data, 'id');
        }

        if ($this->db->affected_rows()) {
            return TRUE;
        } else {
            return FALSE;
        }
    }

    function update_subsidiary()
    {
        $id = $this->input->post('id');
        $subsidiary = $this->input->post('subsidiary');

        $this->db->update('series', array('subsidiary_journal' => $subsidiary), array('id' => $id));

        if ($this->db->affected_rows()) {
            return TRUE;
        } else {
            return FALSE;
        }
    }

    function delete($ids = NULL)
    {
        if (is_null($ids)) {
            $id = $this->input->post('id');

            return $this->db->delete('series', array('id' => $id));
        } else { // Se quiere eliminar varios registros
        	$where = TRUE;

        	foreach ($ids as $id) {
        		if ($where) {
        			$where = FALSE;
        			$this->db->where('id', $id);
        		} else {
        			$this->db->or_where('id', $id);
        		}
        	}

        	return $this->db->delete('series');
        }
    }

    function get_for_update_sale_point($sale_point_id, $branch_id = NULL)
    {
    	if (is_null($branch_id)) {
    		$branch_id = $this->session->userdata('user_branch');
    	}

    	$this->db->select('
    		series.id AS serie_id,
    		branch_details.company_id,
    		ticket_printers.id AS ticket_printer_id
    	');

    	$this->db->from('series');
    	$this->db->join('branch_details', 'series.branch_detail_id = branch_details.id');
    	$this->db->join('ticket_printers', 'series.id = ticket_printers.serie_id');

    	$this->db->where('series.sale_point_id', $sale_point_id);
    	$this->db->where('branch_details.branch_id', $branch_id);

    	$query = $this->db->get();

    	return $query->result();
    }

    function get_by_voucher($voucher, $sale_point_id = NULL, $branch_id = NULL)
    {

    	$this->db->select('
			series.serie,
			series.serial_number,
			series.voucher
		');

		$this->db->from('series');

		if (!is_null($sale_point_id)) {
			$this->db->where('series.sale_point_id', $sale_point_id);
		}

		if (!is_null($branch_id)) {
			$this->db->where('series.branch_detail_id', $branch_id);
		}

		$this->db->where('series.voucher', $voucher);

		$query = $this->db->get();

		if ($query->num_rows() === 0) {
			return FALSE;
		} else {
			return $query->result();
		}
    }

    function increase_by_voucher($voucher, $belongs_to = NULL, $regime = NULL)
    {
    	// Arreglar
    	if (($voucher === 'TICKET' OR $voucher === 'NOTA DE CREDITO') AND is_null($belongs_to)) {
    		$belongs_to = $this->session->userdata('user_sale_point');
    	}

    	if ($voucher === 'TICKET' OR $voucher === 'NOTA DE CREDITO') {
	    	$this->db->simple_query("
	    		UPDATE series SET serial_number = serial_number + 1 WHERE voucher = '" . $voucher . "' AND sale_point_id = '$belongs_to'
	    	");
    	} else {
	    	$this->db->simple_query("
	    		UPDATE series SET serial_number = serial_number + 1 WHERE voucher = '" . $voucher . "' AND regime = '$regime' AND branch_id = '$belongs_to'
	    	");
    	}
    }
}
