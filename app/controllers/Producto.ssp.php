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


$table = 'vw_productos_detalle';


$primaryKey = 'id_producto';

$columns = array(
    array('db' => 'id_producto', 'dt' => 0),
    array('db' => 'marca', 'dt' => 1),
    array('db' => 'tipo_nombre', 'dt' => 2),
    array('db' => 'modelo', 'dt' => 3),
    array('db' => 'unidad_nombre', 'dt' => 4),
    array('db' => 'precio_actual', 'dt' => 5),
    array('db' => 'codigo_barra', 'dt' => 6),
    array('db' => 'categoria', 'dt' => 7),
    array(
      'db'        => 'id_producto',
      'dt'        => 8,
      'formatter' => function( $d, $row ) {
        return '<button class="btn btn-warning btn-actualizar" data-id="'.$d.'">Actualizar</button>
                <button class="btn btn-danger btn-eliminar" data-id="'.$d.'">Eliminar</button>';
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