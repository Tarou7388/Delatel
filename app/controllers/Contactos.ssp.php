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

// DB table to use
$table = 'vw_contactabilidad_listar';

// Table's primary key
$primaryKey = 'id_contactabilidad';

// Array of database columns which should be read and sent back to DataTables.
$columns = array(
  array('db' => 'id_contactabilidad', 'dt' => 0),
  array('db' => 'nombre_contacto', 'dt' => 1),
  array('db' => 'telefono', 'dt' => 2),
  array('db' => 'email', 'dt' => 3),
  array('db' => 'nota', 'dt' => 4),
  array(
    'db'        => 'id_contactabilidad',
    'dt'        => 5,
    'formatter' => function( $d, $row ) {
      return '<button class="btn btn-primary btn-detalle" data-id="'.$d.'">Detalle</button>
              <button class="btn btn-success btn-whatsapp" data-telefono="'.$row['telefono'].'" data-nombre="'.$row['nombre_contacto'].'">WhatsApp</button>';
    }
  ),
  array('db' => 'precio', 'dt' => 6),
  array('db' => 'fecha_hora_contacto', 'dt' => 7),
  array('db' => 'direccion_servicio', 'dt' => 8),
  array('db' => 'paquete', 'dt' => 9),
  array('db' => 'fecha_limite', 'dt' => 10),
  array('db' => 'usuario_creador', 'dt' => 11),
  array('db' => 'usuario_modificador', 'dt' => 12),
  array('db' => 'usuario_inactivador', 'dt' => 13)
);

// SQL server connection information
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