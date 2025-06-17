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

$table = 'vw_kardex_listar';

$primaryKey = 'id_kardex';

$columns = array(
    array('db' => 'id_kardex', 'dt' => 0),
    array('db' => 'id_producto', 'dt' => 1),
    array('db' => 'modelo', 'dt' => 2),
    array('db' => 'tipo_producto', 'dt' => 3),
    array('db' => 'nombre_marca', 'dt' => 4),
    array('db' => 'precio_actual', 'dt' => 5),
    array('db' => 'fecha', 'dt' => 6),
    array('db' => 'tipo_operacion', 'dt' => 7),
    array('db' => 'cantidad', 'dt' => 8),
    array('db' => 'saldo_total', 'dt' => 9),
    array('db' => 'valor_unico_historico', 'dt' => 10),
    array('db' => 'nombre_almacen', 'dt' => 11),
    array('db' => 'creado_por', 'dt' => 12),
    array('db' => 'tipo_movimiento', 'dt' => 13),
    array('db' => 'producto', 'dt' => 14),
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