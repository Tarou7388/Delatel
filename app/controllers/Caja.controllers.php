<?php

require_once '../models/Caja.php';

$caja = new Caja();
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (isset($_GET['operacion'])) {
  $operacion = $_GET['operacion'];
  switch ($operacion) {
    case 'listarCajas':
      $respuesta = $caja->listarCajas();
      echo json_encode($respuesta);
      break;
  }
}

if (isset($_POST['operacion'])) {
  $operacion = $_POST['operacion'];
  switch ($operacion) {
    case 'registrarCaja':
      $params = [
        'nombre' => $_POST['nombre'],
        'descripcion' => $_POST['descripcion'],
        'numeroEntradas' => $_POST['numeroEntradas'],
        'idSector' => $_POST['idSector'],
        'coordenadas' => $_POST['coordenadas'],
        'idUsuario' => $_POST['idUsuario']
      ];
      $respuesta = $caja->registrarCaja($params);
      echo json_encode($respuesta);
      break;
    case 'registrarLinea':
      $coordenadas = json_decode($_POST['coordenadas']);
      $coordenadas = json_encode($coordenadas);
      $params = [
        'idMufa' => $_POST['idMufa'],
        'idCaja' => $_POST['idCaja'],
        'coordenadas' => $coordenadas,
        'idUser' => $_POST['idUsuario']
      ];
      $respuesta = $caja->registrarLinea($params);
      echo json_encode($respuesta);
      break;
  }
}
if (isset($data['operacion'])) {
  $operacion = $data['operacion'];
  switch ($operacion) {
    case 'descontarCaja':
      if (isset($data['idCaja'])) {
        $idCaja = $data['idCaja'];
        $respuesta = $caja->descontarEspacioCaja(['idCaja' => $idCaja]);
        echo json_encode($respuesta);
      } else {
        echo json_encode(['error' => 'Falta el parámetro idCaja']);
      }
      break;
    default:
      echo json_encode(['error' => 'Operación no válida']);
  }
}