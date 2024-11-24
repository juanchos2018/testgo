<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class MY_Model extends CI_Model
{
	function __construct()
    {
        parent::__construct();
    }

    function quick_save($table, $return_id = FALSE)
    {
        $this->_set_post_values();

        $inserted = $this->db->insert($table, $this);

        if ($inserted) {
            if ($return_id) {
                return $this->db->insert_id();
            } else {
                return TRUE;
            }
        } else {
            return FALSE;
        }
    }

    function quick_update($table, $id)
    {
        $this->_set_post_values();
        $this->db->where('id', $id);

        return $this->db->update($table, $this);
    }

    function quick_trash($table)
    {
        $ids = $this->input->post('id');
        $return = TRUE;

        $data = array(
            'active' => 'f'
        );

        foreach ($ids as $id) {
            $this->db->where('id', $id);
            if (!$this->db->update($table, $data)) {
                $return = FALSE;
            }
        }

        return $return;
    }

    function quick_restore($table)
    {
        $ids = $this->input->post('id');
        $return = TRUE;

        $data = array(
            'active' => 't'
        );

        foreach ($ids as $id) {
            $this->db->where('id', $id);
            if (!$this->db->update($table, $data)) {
                $return = FALSE;
            }
        }

        return $return;
    }

    function quick_remove($table)
    {
        $ids = $this->input->post('id');
        $return = TRUE;

        foreach ($ids as $id) {
            $this->db->where('id', $id);
            if (!$this->db->delete($table)) {
                $return = FALSE;
            }
        }

        return $return;
    }

    function escape_json($str)
    {
        if (is_string($str)) {
            if (strlen($str) > 0) {
                $str = '"'.$this->db->escape_str($str).'"';
            } else {
                $str = 'null';
            }
        } elseif (is_bool($str)) {
            $str = ($str === FALSE) ? 0 : 1;
        } elseif (is_null($str)) {
            $str = 'null';
        }

        return $str;
    }

    function _set_post_values()
    {
        array_walk(get_object_vars($this), function ($value, $key) {
            $post_value = $this->input->post($key);

            if (empty($post_value)) {
                $this->$key = NULL;
            } else {
                $this->$key = $post_value;
            }
        });
    }

    protected function set_pagination_limit()
    {
        $page = ($this->input->get('page') ? $this->input->get('page') : 1);
        $display = ($this->input->get('display') ? $this->input->get('display') : 10);

        $this->db->limit($display, ($page - 1) * $display);
    }

}
