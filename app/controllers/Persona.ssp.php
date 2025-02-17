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

$table = 'vw_personas_listar';

$primaryKey = 'id_persona';

$columns = array(
    array('db' => 'id_persona', 'dt' => 0),
    array('db' => 'tipo_doc', 'dt' => 1),
    array('db' => 'nro_doc', 'dt' => 2),
    array('db' => 'Nombre_Completo', 'dt' => 3),
    array('db' => 'telefono', 'dt' => 4),
    array('db' => 'nacionalidad', 'dt' => 5),
    array('db' => 'email', 'dt' => 6),
    array('db' => 'direccion_contacto', 'dt' => 7)
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
