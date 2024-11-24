<?php

class LogQueryHook {

    function log_queries() {
        $CI =& get_instance();
        $times = $CI->db->query_times;
        $dbs    = array();
        $output = NULL;     
        $queries = $CI->db->queries;

        if (count($queries) > 0) {
            foreach ($queries as $key => $query){
                $took = round(doubleval($times[$key]), 3);
                $output .= "/* " . date('d-M H:i A') . " ({$took}ms) */\n";

                $output .= $query . "\n\n";
            }
        }

        $CI->load->helper('file');

        if ( ! write_file(APPPATH  . "/logs/queries.sql", $output, 'a+')){
             log_message('debug','Unable to write query the file');
        }   
    }
}