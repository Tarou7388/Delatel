<?php
require_once '../models/Contactabilidad.php';

$contactabilidad = new Contactabilidad();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  switch ($_GET['operacion']) {
    case 'getPersonas':
      echo json_encode($contactabilidad->getPersonas());
      break;
  }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $json = file_get_contents('php://input');
  $datos = json_decode($json, true);
  $operacion = $datos['operacion'];
  switch ($operacion) {
    case 'add':
      $respuesta = $contactabilidad->add([
        'idPersona' => $datos['idPersona'],
        'idPaquete' => $datos['idPaquete'],
        'direccion' => $datos['direccion'],
        'nota' => $datos['nota'],
        'idUsuario' => $datos['idUsuario'],
        'fechaLimite' => $datos['fechaLimite']
      ]);
      echo json_encode(["guardado" => $respuesta]);
      break;
  }
}
