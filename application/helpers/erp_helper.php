<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

if ( ! function_exists('erp_datatable'))
{
    function erp_datatable($ng_repeat, $options, $selection = NULL, $model = NULL)
    {
        $attrs = '';
        $ajax = isset($options['ajax']) && $options['ajax'] === TRUE;
        $class = (isset($options['class']) ? $options['class'] : '');

        if (is_null($selection) || $ajax) {
            $head = '';
            $body = '';
        } else {
            $control = ($selection === 'single' ? 'radio' : 'checkbox');
            $attrs .= 'data-selection="' . $selection . '" ';
            $vars = explode(' in ', $ng_repeat);

            if (count($vars) !== 2) return '';

            $head = ($selection === 'multiple' ? '
                <th width="20" class="text-center">
                    <label class="checkbox m-n i-checks">
                        <input type="checkbox" data-custom ng-model="allSelected" ng-checked="datatable.isAllSel(this, ' . $vars[1] . ')" ng-click="datatable.selAll(this, ' . $vars[1] . (is_null($model) ? '' : ', ' . $model) . ')" style="width: 0; height: 0" />
                        <i></i>
                    </label>
                </th>
            ' : '
                <th width="20">
                    &nbsp;
                </th>
            ');

            $body = '
                <td class="text-center">
                    <label class="checkbox m-n i-checks">
                        <input type="' . $control . '" style="width: 0; height: 0" ng-model="' . current($vars) . '.selected"' . (is_null($model) ? '' : ' ng-change="datatable.changeSel(' . current($vars) . ', ' . $model . ')"') . ' />
                        <i></i>
                    </label>
                </td>
            ';
        }

        if (isset($options['DOM'])) {
            $attrs .= 'data-dom="' . $options['DOM'] . '" ';
        }

        if (isset($options['lang'])) {
            foreach ($options['lang'] as $key => $value) {
                $attrs .= 'data-lang-' . $key . '="' . $value . '" ';
            }
        }

        if (isset($options['hide_id'])) {
            $attrs .= 'data-hide-id="true" ';
        }

        if (isset($options['hide_cols'])) {
            $attrs .= 'data-hide-cols="' . json_encode($options['hide_cols']) . '" ';
        }

        if (isset($options['order'])) {
            $attrs .= "data-order='" . json_encode($options['order']) . "' ";
        }

        $labels = $options['labels'];

        foreach ($labels as $label) {
            $head .= '<th>' . $label . '</th>';
        }

        if (!$ajax) {
            $fields = $options['fields'];

            foreach ($fields as $field) {
                $body .= '<td>' . $field . '</td>';
            }

            $tbody = '
                <tbody>
                    <tr ng-repeat="' . $ng_repeat . '" ng-click="datatable.rowClick($event, ' . $vars[0] . (is_null($model) ? '' : ', ' . $model) . ')">
                        ' . $body . '
                    </tr>
                </tbody>
            ';
        } else {
            $tbody = '';
        }

        return '
            <div class="table-responsive">
                <table class="table table-hover b-t b-light ' . $class . '" erp-table ' . ($ajax ? 'data-ajax = "' . $ng_repeat . '"' : '') . ' ' . $attrs . '>
                    <thead>
                        <tr>
                            ' . $head . '
                        </tr>
                    </thead>
                    ' . $tbody . '
                </table>
            </div>
        ';
    }
}

if ( ! function_exists('erp_number_format'))
{
    function erp_number_format($serie, $serial)
    {
        return
            str_pad($serie, 3, '0', STR_PAD_LEFT) . '-' .
            str_pad($serial, 7, '0', STR_PAD_LEFT);
    }
}

if ( ! function_exists('erp_escape'))
{
    function erp_escape($string, $char = "'")
    {
        return str_replace($char, "\\" . $char, $string);
    }
}

/*
    get_value devuelve el valor de $field en $_POST y devuelve $default por defecto
    en caso de que no exista o tengo un valor vacío
*/

if ( ! function_exists('get_value'))
{
    function get_value($field, $default = NULL)
    {
        if (isset($_POST[$field]) AND !empty($_POST[$field])) {
            return $_POST[$field];
        } else {
            return $default;
        }
    }
}

/*
    date_format transforma una fecha en formato dd/mm/yyyy usada comúnmente para mostrarse al cliente
    a un formato yyyy-mm-dd usada para guardarla en la base de datos
*/

if ( ! function_exists('date_db_format'))
{
    function date_db_format($date)
    {
        if (is_valid_date($date)) {
            return implode('-', array_reverse(explode('/', $date)));
        } else {
            return NULL;
        }
    }
}

if ( ! function_exists('has_string_keys'))
{
    function has_string_keys($array)
    {
        return count(array_filter(array_keys($array), 'is_string')) > 0;
    }
}

/*
    pg_json transforma un arreglo de datos PHP en variables JSON de PostgreSQL
*/

if ( ! function_exists('pg_json'))
{
    function pg_json($data, $inside_json = FALSE)
    {
        if (is_array($data)) {
            $parts = array();

            if (has_string_keys($data)) {
                foreach ($data as $key => $value) {
                    $parts[] = '"' . $key . '":' . pg_json($value, TRUE);
                }

                if ($inside_json) {
                    return "{" . implode(',', $parts) . "}";
                } else {
                    return "'{" . implode(',', $parts) . "}'::JSON";
                }
            } else {
                foreach ($data as $value) {
                    $parts[] = pg_json($value, $inside_json);
                }

                if ($inside_json) {
                    return '[' . implode(',', $parts) . ']';
                } else {
                    return "ARRAY[" . implode(',', $parts) . "]::" . pg_json_array_type($data);
                }
            }
        } elseif (is_numeric($data)) {
            return "$data";
        } elseif (is_null($data)) {
            return 'null';
        } elseif (is_bool($data)) {
            return ($data ? 'true' : 'false');
        } elseif (is_string($data)) {
            if (strlen($data) === 0) {
                return 'null';
            } else {
                return '"' . str_replace("'", "''", str_replace('"', '\"', trim($data))) . '"';
            }
        } else {
            return '"' . $data . '"';
        }
    }
}


if ( ! function_exists('pg_json_array_type'))
{
    function pg_json_array_type($data)
    {
        if (is_array($data)) {
            $current = current($data);
            if (is_array($current) and has_string_keys($current)) {
                return 'JSON[]';
            } else {
                if (is_integer($current)) {
                    return 'INTEGER[]';
                } elseif (is_numeric($current)) {
                    return 'REAL[]';
                } elseif (is_string($current)) {
                    return 'CHARACTER VARYING[]';
                }
            }
        }
    }
}
