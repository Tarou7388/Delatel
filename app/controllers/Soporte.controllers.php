<?php

use App\Controllers\Herramientas;

session_start();

require_once '../Models/Soporte.php';
require_once './Herramientas.php';

$soporte = new Soporte();

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
        'fechahoraSolictud' => Herramientas::sanitizarEntrada($datos['fechahoraSolictud']),
        'fechahoraAsistencia' => Herramientas::sanitizarEntrada($datos['fechahoraAsistencia']),
        'descripcionProblema' => Herramientas::sanitizarEntrada($datos['descripcionProblema']),
        'descripcionSolucion' => Herramientas::sanitizarEntrada($datos['descripcionSolucion']),
        'prioridad' => Herramientas::sanitizarEntrada($datos['prioridad']),
        'soporte' => Herramientas::sanitizarEntrada($datos['soporte']),
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