<?php
//ESTO ESTA SUJETO A CAMBIOS DE SEGURIDAD A FUTURO
//   
$vista = isset($_GET['vista']) ? $_GET['vista'] : '';

if ($vista == "listarContratoSimple") {
  $table = 'vw_contratos_listar';
  $primaryKey = 'id_contrato';
  $columns = [
    ['db' => 'id_contrato',      'dt' => 0],
    ['db' => 'nombre_cliente',   'dt' => 1],
    ['db' => 'num_identificacion', 'dt' => 2],
    ['db' => 'direccion_servicio', 'dt' => 3],
    ['db' => 'paquete',          'dt' => 4],
    ['db' => 'precio',           'dt' => 5],
    ['db' => 'tipos_servicio',   'dt' => 6],
  ];

  $action = 'ORDER BY id_contrato DESC';
} elseif ($vista == "listarContratoPendiente") {
  $table = 'vw_contratos_listar_ficha_null';
  $primaryKey = 'id_contrato';
  $columns = [
    ['db' => 'id_contrato',      'dt' => 0],
    ['db' => 'tipos_servicio',   'dt' => 1],
    ['db' => 'nombre_cliente',   'dt' => 2],
    ['db' => 'tipos_servicio',   'dt' => 3],
    ['db' => 'nombre_paquete',   'dt' => 4],
    ['db' => 'telefono',         'dt' => 5],
    ['db' => 'direccion_servicio', 'dt' => 6],
    ['db' => 'referencia',       'dt' => 7],
    ['db' => 'nota',             'dt' => 8],
  ];
  $action = 'ORDER BY id_contrato ASC';
} else {
  // Si no hay vista válida, termina la ejecución
  exit(json_encode(['error' => 'Vista no válida']));
}

$sql_details = [
  'user'    => 'root',
  'pass'    => '',
  'db'      => 'Delatel',
  'host'    => 'localhost',
  'charset' => 'utf8'
];

require('../models/ssp.class.php');

echo json_encode(
  SSP::simple($_GET, $sql_details, $table, $primaryKey, $columns, null, null,)
);
