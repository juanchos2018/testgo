<?php

class Ticket_printer_model extends CI_Model
{
    var $sale_point_id = '';
    var $branch_detail_id = '';
    var $printer_serial = '';
    var $printer_name = '';

    function save($data)
    {
        return $this->db->insert_batch('ticket_printers', $data);
    }

    function update($data)
    {
    	$this->db->update_batch('ticket_printers', $data, 'id');
    }

    function get_by_sale_point($sale_point_id)
    {
    	$this->db->select("
    		ticket_printers.id AS ticket_printer_id,
            companies.id AS company_id,
			companies.name AS company_name,
			ticket_printers.printer_name,
			ticket_printers.printer_serial,
            series.serie AS ticket_serie,
            series.serial_number AS ticket_serial
    	", FALSE);

        $this->db->from('ticket_printers');
    	$this->db->join('series', 'ticket_printers.serie_id = series.id');
    	$this->db->join('branch_details', 'series.branch_detail_id = branch_details.id');
    	$this->db->join('companies', 'branch_details.company_id = companies.id');

    	$this->db->where('series.sale_point_id', $sale_point_id);

    	$query = $this->db->get();

    	return $query->result_array();
    }
}