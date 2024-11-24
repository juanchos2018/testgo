<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class MY_Controller extends CI_Controller
{
    protected $allowed_uris = array();
    public $state_type = array();
    public $voucher_type = array();

    var $menu = array(
        array(
            'name' => 'dashboard',
            'text' => 'Inicio',
            'icon' => 'i i-home icon',
            'url' => '#/'
        ),
        /*array(
            'name' => 'planning',
            'text' => 'Planificación',
            'icon' => 'fa fa-calendar icon',
            'items' => array(
                array(
                    'name' => 'history',
                    'text' => 'Historial de Compras',
                    'url' => '#/historial-compras' // OJO con el inglés
                ),
                array(
                    'name' => 'projections',
                    'text' => 'Proyecciones',
                    'url' => '#/proyecciones' // OJO con el inglés
                ),
                array(
                    'name' => 'market',
                    'text' => 'Estudio de Mercado',
                    'url' => '#/estudio-mercado' // OJO con el inglés
                ),
                array(
                    'name' => 'competition',
                    'text' => 'Competencia',
                    'url' => '#/competencia' // OJO con el inglés
                )
            )
        ),*/
        array(
            'name' => 'purchase-orders',
            'text' => 'Pedidos',
            'icon' => 'fa fa-pencil icon',
            'attrs' => 'ng-show="{{[\'Administrador\',\'Operador de Compras\',\'Desarrollador\'].indexOf(Auth.value(\'userRoleName\')) > -1}}"',
            'items' => array(
                array(
                    'name' => 'template',
                    'text' => 'Generar plantilla',
                    'url' => '#/purchase-orders/template'
                ),
                array(
                    'name' => 'add',
                    'text' => 'Nuevo pedido',
                    'url' => '#/purchase-orders/add'
                ),
                array(
                    'name' => 'list',
                    'text' => 'Pedidos',
                    'url' => '#/purchase-orders'
                )
            )
        ),
        array(
            'name' => 'purchases',
            'text' => 'Compras',
            'icon' => 'icon-list',
            'attrs' => 'ng-show="{{[\'Administrador\',\'Operador de Compras\',\'Desarrollador\'].indexOf(Auth.value(\'userRoleName\')) > -1}}"',
            'items' => array(
                array(
                    'name' => 'template',
                    'text' => 'Generar plantilla',
                    'url' => '#/purchases/template'
                ),
                array(
                    'name' => 'add',
                    'text' => 'Nuevo ingreso',
                    'url' => '#/purchases/add'
                ),
                array(
                    'name' => 'list',
                    'text' => 'Compras',
                    'url' => '#/purchases'
                )
            )
        ),
        array(
            'name' => 'sales',
            'text' => 'Punto de venta',
            'icon' => 'fa fa-shopping-cart',
            'attrs' => 'ng-show="{{[\'Operador de Ventas\',\'Desarrollador\'].indexOf(Auth.value(\'userRoleName\')) > -1}}"',
            'items' => array(
                array(
                    'name' => 'point',
                    'text' => 'Caja',
                    'url' => '#/sales/point',
                ),
                array(
                    'name' => 'operations',
                    'text' => 'Registrar documento',
                    'url' => '#/sales/add'
                ),
                array(
                    'name' => 'operations',
                    'text' => 'Consultar documento',
                    'url' => '#/sales/operations'
                ),
                array(
                    'name' => 'settings',
                    'text' => 'Configuración',
                    'url' => '#/sales/settings'
                )
            )
        ),
        array(
            'name' => 'customers',
            'text' => 'Clientes',
            'icon' => 'fa fa-user',
            'items' =>  array(
                array(
                    'name' => 'list',
                    'text' => 'Clientes',
                    'url'  => '#/customers'
                ),
                array(
                    'name' => 'add',
                    'text' => 'Agregar',
                    'url'  => '#/customers/add'
                )
            )
        ),
        array(
            'name' => 'marketing',
            'text' => 'Marketing',
            'icon' => 'fa fa-bullhorn',
            'attrs' => 'ng-show="{{[\'Administrador\',\'Marketing\',\'Desarrollador\'].indexOf(Auth.value(\'userRoleName\')) > -1}}"',
            'items' => array(
               /* array(
                    'name' => 'customers',
                    'text' => 'Consulta de Clientes',
                    'url' => '#/customers/'
                ),
                array(
                    'name' => 'points',
                    'text' => 'Programa de Puntos',
                    'url' => '#/rewards'
                ),*/
                array(
                    'name' => 'add-campaign',
                    'text' => 'Nueva campaña',
                    'url' => '#/campaigns/add'
                ),
                array(
                    'name' => 'campaigns',
                    'text' => 'Campañas',
                    'url' => '#/campaigns'
                )
                /*array(
                    'name' => 'offers',
                    'text' => 'Combos',
                    'url' => '#/offers'
                )*/
            )
        ),
        array(
            'name' => 'logistic',
            'text' => 'Logística',
            'icon' => 'fa fa-list-alt',
            'url' => '#', // '#/logistic/dashboard'
            'attrs' => 'ng-show="{{[\'Administrador\',\'Operador de Logística\',\'Desarrollador\'].indexOf(Auth.value(\'userRoleName\')) > -1}}"',
            'items' => array(
                array(
                    'name' => 'products',
                    'text' => 'Productos',
                    'url' => '#/products'
                ),
               /* array(
                    'name' => 'barcode',
                    'text' => 'Códigos de Barra',
                    'url'  => '#/products/barcodes'
                ),
                array(
                    'name' => 'template',
                    'text' => 'Plantilla Traslados',
                    'url' => '#/purchases/template'
                ),*/
                array(
                    'name' => 'add',
                    'text' => 'Nuevo Traslado',
                    'url' => '#/transfers/add'
                ),
                array(
                    'name' => 'list',
                    'text' => 'Traslados',
                    'url' => '#/transfers'
                )/*,
                array(
                    'name' => 'inventory',
                    'text' => 'Inventario',
                    'url' => '#/logistic/inventory'
                )*/

                /*,
                /*,

                array(
                    'name' => 'inventory',
                    'text' => 'Inventario',
                    'items' => array(
                        array(
                            'name' => 'initial',
                            'text' => 'Inventario Inicial',
                            'url' => '#/logistic/initial_inventory'
                        ),
                        array(
                            'name' => 'depots',
                            'text' => 'Almacenes y Ubicaciones',
                            'url' => '#/depots'
                        ),
                        array(
                            'name' => 'monthly',
                            'text' => 'Inventario Mensual',
                            'url' => '#/inventory'
                        )
                    )
                ),
                array(
                    'name' => 'movements',
                    'text' => 'Movimientos',
                    'items' => array(
                        array(
                            'name' => 'inputs',
                            'text' => 'Ingresos',
                            'url' => '#/logistic/inputs'
                        ),
                        array(
                            'name' => 'outputs',
                            'text' => 'Salidas',
                            'url' => '#/logistic/outputs'
                        )
                    )
                ),
                array(
                    'name' => 'analysis',
                    'text' => 'Análisis de Ventas',
                    'items' => array(
                        array(
                            'name' => 'sales',
                            'text' => 'Dashboard',
                            'url' => '#/logistic/sales'
                        ),
                        array(
                            'name' => 'profitability',
                            'text' => 'Rentabilidad de Productos',
                            'url' => '#/rentability'
                        ),
                        array(
                            'name' => 'graph',
                            'text' => 'Gráfica de Ventas',
                            'url' => '#/salesgraph'
                        )
                    )
                )*/
            )
        ),
        /*array(
            'name' => 'human-resources',
            'text' => 'Recursos Humanos',
            'icon' => 'fa fa-group',
            'items' => array(
                array(
                    'name' => 'employees',
                    'text' => 'Padrón de Empleados',
                    'url' => '#/employees'
                )
            )
        ),*/
        array(
            'name' => 'accountant',
            'text' => 'Financiero Contable',
            'icon' => 'fa fa-usd',
            'attrs' => 'ng-show="{{[\'Administrador\',\'Contador\',\'Desarrollador\'].indexOf(Auth.value(\'userRoleName\')) > -1}}"',
            'items' => array(
                /*array(
                    'name' => 'invoices',
                    'text' => 'Facturas',
                    'url' => '#/invoices'
                ),*/
                array(
                    'name' => 'sales',
                    'text' => 'Registro Ventas',
                    'url' => '#/accountancy/sales'
                ),
                array(
                    'name' => 'customers',
                    'text' => 'Clientes',
                    'url' => '#/accountancy/customers'
                ),
                array(
                    'name' => 'exchange',
                    'text' => 'Tipo de cambio',
                    'url' => '#/accountancy/exchange_rates'
                ),
                array(
                    'name' => 'sunat',
                    'text' => 'Tablas SUNAT',
                    'url' => '#/sunat_tables'
                )
            )
        ),
        array(
            'name' => 'maintenance',
            'text' => 'Mantenimiento',
            'icon' => 'fa fa-wrench icon',
            'attrs' => 'ng-show="{{[\'Administrador\',\'Desarrollador\'].indexOf(Auth.value(\'userRoleName\')) > -1}}"',
            'items' => array(
                array(
                    'name' => 'brands',
                    'text' => 'Marcas',
                    'url' => '#/brands'
                ),
                array(
                    'name' => 'categories',
                    'text' => 'Categorías',
                    'url' => '#/categories'
                ),
                array(
                    'name' => 'subcategories',
                    'text' => 'Subcategorías',
                    'url' => '#/subcategories'
                ),
                array(
                    'name' => 'banks',
                    'text' => 'Bancos',
                    'url' => '#/banks'
                ),
                array(
                    'name' => 'points',
                    'text' => 'Puntos de Venta',
                    'url' => '#/sale_points'
                ),
                array(
                    'name' => 'series',
                    'text' => 'Números de serie',
                    'url' => '#/series'
                ),
                array(
                    'name' => 'migration',
                    'text' => 'Migración',
                    'url' => '#/migration'
                ),
                array(
                    'name' => 'purchase',
                    'text' => 'Migración de compra',
                    'url' => '#/migration/purchase'
                )
            )
        ),
        array(
            'name' => 'settings',
            'text' => 'Configuración',
            'icon' => 'fa fa-cog icon',
            'attrs' => 'ng-show="{{[\'Administrador\',\'Desarrollador\'].indexOf(Auth.value(\'userRoleName\')) > -1}}"',
            'items' => array(
                array(
                    'name' => 'users',
                    'text' => 'Usuarios',
                    'url' => '#/users'
                ),
                array(
                    'name' => 'sales',
                    'text' => 'Ventas',
                    'url' => '#/settings/sales'
                )/*,
                array(
                    'name' => 'testing',
                    'text' => 'Pruebas',
                    'url' => '#/testing'
                )*/
            )
        )
    );

    function __construct()
    {
        parent::__construct();

        $this->state_type = array('DRAFT', 'DONE', 'SOLD', 'REFUNDED', 'CANCELED');
        $this->voucher_type = array('BOLETA', 'FACTURA', 'NOTA DE CREDITO', 'TICKET');

        $uri = $this->uri->ruri_string();
        $user = $this->session->userdata('user_id');

        if (!in_array($uri, $this->allowed_uris)) {
            if (!$user) {
                // Not Authorized
                $this->output->set_status_header('401')->set_output('');
                exit;
            }
        }

        // Validate permissions
    }

    function error_output($header = '404', $output = '')
    {
        $this->output->set_status_header($header, utf8_decode($output));
        exit;
    }

    function json_output($data)
    {
        $this->output
            ->set_content_type('application/json')
            ->set_output(json_encode($data));
    }

    function is_state_type($needle)
    {
        return in_array($needle, $this->state_type);
    }

    function is_voucher_type($needle)
    {
        return in_array($needle, $this->voucher_type);
    }

    // function set_excel_header($filename = NULL)
    // {
    //     header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    //
    //     if (!is_null($filename)) {
    //         header('Content-Disposition: attachment; filename="' . $filename . '"');        }
    //
    // }

}
