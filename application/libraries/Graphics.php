<?php if ( ! defined('BASEPATH')) exit('No se permite el acceso directo al script');

class Graphics {
   var $intermediate;
   var $output;
   
   function convert($data) {

	    $intermediate = array();

	    // This intermediate steps is used just to group all rows with
	    // the same key
	    foreach($data as $item) {
	        list($key, $date, $value) = array_values($item);
	        $intermediate[$key][] = array($date, (float)$value);
	    }

	    $output = array();

	    foreach($intermediate as $key => $values) {
	        $output[] = array(
	            'key' => $key,
	            'values' => $values
	        );
	    }

	    return $output;
	}

}
?>