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
    case 'listarCajasSectorIdCaja':
      $idCaja = $_GET['idCaja'];
      $respuesta = $caja->listarCajasSectorIdCaja(['idCaja' => $idCaja]);
      echo json_encode($respuesta);
      break;
    case 'cajaUso':
      $idCaja = $_GET['idCaja'];
      $respuesta = $caja->cajaUso(['idCaja' => $idCaja]);
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
      if($_POST['idCaja'] == '') {
        $_POST['idCaja'] = null;
      }
      $params = [
        'idMufa' => $_POST['idMufa'],
        'idCaja' => $_POST['idCaja'],
        'coordenadas' => $coordenadas,
        'tipoLinea' => $_POST['tipoLinea'],
        'idUser' => $_POST['idUsuario']
      ];
      $respuesta = $caja->registrarLinea($params);
      echo json_encode(["registrado" => $respuesta]);
      break;
  }
}


if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  $json = file_get_contents('php://input');
  $datos = json_decode($json, true);

  if (isset($datos['operacion'])) {
    $operacion = $datos['operacion'];
    switch ($operacion) {
      case 'descontarCaja':
        $idCaja = $datos['idCaja'];
        $respuesta = $caja->descontarEspacioCaja(['idCaja' => $idCaja]);
        echo json_encode($respuesta);
        break;
      case 'recontarCaja':
        $idContrato = $datos['idContrato'];
        $respuesta = $caja->recontarEspacioCaja(['idContrato' => $idContrato]);
        echo json_encode($respuesta);
        break;
      case 'eliminarCaja':
        $idCaja = $datos['idCaja'];
        $datos = [
          'idCaja' => $idCaja,
          'idUsuario' => $datos['idUsuario']
        ];
        $respuesta = $caja->eliminarCaja($datos);
        echo json_encode($respuesta);
        break;
    }
  }
}
