<?php
session_start();

require_once '../Models/Soporte.php';

$soporte = new Soporte();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $Json = file_get_contents('php://input');
  $datos = json_decode($Json, true);
  $operacion = $datos['add']['operacion'];

  switch ($operacion) {
    case 'add':
      $params = $datos['params'];
      $status = $soporte->addSoporte($params);
      if ($status === true) {
        echo json_encode([
          'status' => 'success',
          'message' => 'Soporte agregado correctamente'
        ]);
      } else {
        echo json_encode([
          'status' => 'error',
          'message' => 'Error al agregar soporte: ' . $status
        ]);
      }
      break;
    default:
      echo json_encode([
        'status' => 'error',
        'message' => 'Operación no válida'
      ]);
      break;
  }
} else {
  echo json_encode([
    'status' => 'error',
    'message' => 'Método no permitido'
  ]);
}
