<?php
session_start();

require_once '../Models/Soporte.php';

$soporte = new Soporte();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $Json = file_get_contents('php://input');
  $datos = json_decode($Json, true);
  $operacion = $datos['operacion'];
  switch ($operacion) {
    case 'registrarSoporte':
      $values = [
        'idContrato' => $datos['idContrato'],
        'idTipoSoporte' => $datos['idTipoSoporte'],
        'idTecnico' => $datos['idTecnico'],
        'fechahoraSolictud' => $datos['fechahoraSolictud'],
        'fechahoraAsistencia' => $datos['fechahoraAsistencia'],
        'descripcionProblema' => $datos['descripcionProblema'],
        'descripcionSolucion' => $datos['descripcionSolucion'],
        'prioridad' => $datos['prioridad'],
        'soporte' => $datos['soporte'],
        'idUsuario' => $datos['idUsuario']
      ];
      $status = $soporte->registrarSoporte($params);
      echo json_encode([
        'status' => $status ? 'success' : 'error',
        'message' => $status ? 'Soporte registrado correctamente' : 'Error al registrar soporte'
      ]);
      break;
  }
}