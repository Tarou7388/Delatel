<?php

require_once '../models/Caja.php';

$caja = new Caja();

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
        'idMufa' => $_POST['idMufa'],
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
        'idSector' => $_POST['idSector'],
        'coordenadas' => $coordenadas,
        'idUser' => $_POST['idUsuario']
      ];
      $respuesta = $caja->registrarLinea($params);
      echo json_encode($respuesta);
      break;
    case "descontarEspacioCaja":
      $idContrato = $_POST['parametros']['idContrato'];
      $caja = new Caja();
      $resultado = $caja->descontarEspacioCaja($idContrato);
      echo json_encode($resultado); // <-- Verifica qué devuelve exactamente esta línea
      break;
  }
}
