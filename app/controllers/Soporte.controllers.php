<?php

use App\Controllers\Herramientas;

session_start();

require_once '../models/Soporte.php';
require_once '../controllers/Herramientas.php';

$soporte = new Soporte();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  switch (Herramientas::sanitizarEntrada($_GET['operacion'])) {
    case 'listarTipoSoporte':
      echo json_encode($soporte->listarTipoSoporte());
      break;
    case 'FiltrarSoportePrioridad':
      echo json_encode($soporte->FiltrarSoportePrioridad(["prioridad" => $_GET['prioridad']]));
      break;
    case 'listarSoporte':
      echo json_encode($soporte->listarSoporte());
      break;
    case 'ObtenerDatosSoporteByID':
      echo json_encode($soporte->ObtenerDatosSoporteByID(["idSoporte" => $_GET['idSoporte']]));
      break;
    case 'obtenerServiciosId':
      echo json_encode($soporte->obtenerServiciosId(["idservicio" => $_GET['idservicio']]));
      break;
    case 'obtenerfichaSoporteporDoc':
      echo json_encode($soporte->obtenerfichaSoporteporDoc(["nroDoc" => $_GET['nroDoc']]));
      break;
  }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $Json = file_get_contents('php://input');
  $datos = json_decode($Json, true);
  $operacion = Herramientas::sanitizarEntrada($datos['operacion']);
  switch ($operacion) {
    case 'registrarSoporte':
      $values = [
        'idContrato'          => Herramientas::sanitizarEntrada($datos['idContrato']),
        'fechaHoraSolicitud'  => date("Y-m-d H:i:s"),
        'descripcionProblema' => Herramientas::sanitizarEntrada($datos['descripcionProblema']),
        'descripcionSolucion' => Herramientas::sanitizarEntrada($datos['descripcionSolucion']),
        'prioridad'           => Herramientas::sanitizarEntrada($datos['prioridad']),
        'idUsuario'           => Herramientas::sanitizarEntrada($datos['idUsuario'])
      ];
      $status = $soporte->registrarSoporte($values);
      echo json_encode([
        'status' => $status ? 'success' : 'error',
        'message' => $status ? 'Soporte registrado correctamente' : 'Error al registrar soporte'
      ]);
      break;
  }
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  $Json = file_get_contents('php://input');
  $datos = json_decode($Json, true);
  $operacion = ($datos['operacion']);

  if ($operacion == 'actualizarSoporte') {
    $values = [
      'idSoporte'            => Herramientas::sanitizarEntrada($datos['data']['idSoporte']),
      'idTecnico'            => Herramientas::sanitizarEntrada($datos['data']['idTecnico']),
      'idTipoSoporte'        => Herramientas::sanitizarEntrada($datos['data']['idTipoSoporte']),
      'fechaHoraAsistencia'  => date("Y-m-d H:i:s"),
      'soporte'              => $datos['data']['soporte'],
      'idUserUpdate'         => Herramientas::sanitizarEntrada($datos['data']['idUserUpdate']),
      'descripcion_solucion'         => Herramientas::sanitizarEntrada($datos['data']['descripcion_solucion'])
    ];

    $status = $soporte->actualizarSoporte($values);
    echo json_encode([
      'status' => $status ? 'success' : 'error',
      'message' => $status ? 'Soporte actualizado correctamente' : 'Error al actualizar soporte'
    ]);
  }
}
