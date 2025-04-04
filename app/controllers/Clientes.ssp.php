<?php
$table = 'vw_clientes_obtener';
$primaryKey = 'id_cliente';

require __DIR__ . '../../../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

$host = $_ENV['HOST'];

$columns = array(
  array('db' => 'id_cliente', 'dt' => 0), // ID Cliente
  array('db' => 'nombre_cliente', 'dt' => 1), // Nombre Cliente
  array('db' => 'codigo_cliente', 'dt' => 2), // Código Cliente
  array( // Botón Contrato
    'db' => 'id_cliente',
    'dt' => 3,
    'formatter' => function ($d, $row) use ($host) { // Agregar $host como variable externa
      $nombreCliente = urlencode($row['nombre_cliente']);
      $contratoUrl = "$host/views/Reportes/tablaContrato?id=$d&nombre=$nombreCliente";
      return '
        <button class="btn btn-primary btn-contrato" onclick="window.location.href=\'' . $contratoUrl . '\'">Ver Contrato</button>
      ';
    }
  ),
  array( // Botón Detalles
    'db' => 'id_cliente',
    'dt' => 4,
    'formatter' => function ($d, $row) use ($host) { // Agregar $host como variable externa
      $detallesUrl = "$host/views/reports/Cliente/soporte.php?id=$d";
      return '
        <button class="btn btn-secondary btn-detalles" onclick="window.open(\'' . $detallesUrl . '\', \'_blank\')">Ver Detalles</button>
      ';
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

require('../models/ssp.class.php');

echo json_encode(
  SSP::simple($_GET, $sql_details, $table, $primaryKey, $columns, null, null, 'ORDER BY id_cliente DESC')
);
