<?php

/*
 * DataTables example server-side processing script.
 *
 * Please note that this script is intentionally extremely simple to show how
 * server-side processing can be implemented, and probably shouldn't be used as
 * the basis for a large complex system. It is suitable for simple use cases as
 * for learning.
 *
 * See https://datatables.net/usage/server-side for full details on the server-
 * side processing requirements of DataTables.
 *
 * @license MIT - https://datatables.net/license_mit
 */

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Easy set variables
 */

$table = 'vw_contratos_listar';

$primaryKey = 'id_contrato';

$columns = array(
    array('db' => 'id_contrato', 'dt' => 0),
    array('db' => 'nombre_cliente', 'dt' => 1),
    array('db' => 'num_identificacion', 'dt' => 2),
    array('db' => 'direccion_servicio', 'dt' => 3),
    array('db' => 'paquete', 'dt' => 4),
    array('db' => 'precio', 'dt' => 5),
    array('db' => 'tipos_servicio', 'dt' => 6),
    array( 
        'db'        => 'id_contrato',
        'dt'        => 7,
        'formatter' => function( $d, $row ) {
            return '<button class="btn btn-warning btn-actualizar" data-id="'.$d.'">Actualizar</button>
                    <button class="btn btn-danger btn-eliminar" data-id="'.$d.'">Eliminar</button>
                    <button class="btn btn-info btn-ver" data-id="'.$d.'">PDF</button>
                    <button class="btn btn-success btn-pagar" data-id="'.$d.'">Ficha</button>';
        }
    )
);

$sql_details = array(
    'user' => 'root',
    'pass' => '',
    'db'   => 'Delatel',
    'host' => 'localhost',
    'charset' => 'utf8'
);

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * If you just want to use the basic configuration for DataTables with PHP
 * server-side, there is no need to edit below this line.
 */

require('../models/ssp.class.php');

echo json_encode(
    SSP::simple($_GET, $sql_details, $table, $primaryKey, $columns)
);