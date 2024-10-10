<?php

use App\Controllers\Herramientas;

session_start();

require_once '../Models/Soporte.php';
require_once './Herramientas.php';

$soporte = new Soporte();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  switch (Herramientas::sanitizarEntrada($_GET['operacion'])) {
    case 'listarTipoSoporte':
      echo json_encode($soporte->listarTipoSoporte());
      break;
    case 'listarSoportesIncompletos':
      echo json_encode($soporte->listarSoportesIncompletos());
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
        'idContrato' => Herramientas::sanitizarEntrada($datos['idContrato']),
        'idTipoSoporte' => Herramientas::sanitizarEntrada($datos['idTipoSoporte']),
        'idTecnico' => Herramientas::sanitizarEntrada($datos['idTecnico']),
        'fechaHoraSolicitud' => $datos['fechaHoraSolicitud'],
        'fechaHoraAsistencia' => $datos['fechaHoraAsistencia'],
        'prioridad' => Herramientas::sanitizarEntrada($datos['prioridad']),
        'soporte' => $datos['soporte'],
        'idUsuario' => Herramientas::sanitizarEntrada($datos['idUsuario'])
      ];
      $status = $soporte->registrarSoporte($values);
      echo json_encode([
        'status' => $status ? 'success' : 'error',
        'message' => $status ? 'Soporte registrado correctamente' : 'Error al registrar soporte'
      ]);
      break;
  }
}
