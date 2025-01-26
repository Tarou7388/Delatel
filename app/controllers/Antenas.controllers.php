<?php

require_once '../models/Antena.php';

$antena = new Antena();

if (isset($_GET['operacion'])) {
  $operacion = $_GET['operacion'];
  switch ($operacion) {
    case 'listarAntenas':
      $respuesta = $antena->listarAntenas();
      echo json_encode($respuesta);
      break;
  }
}

if (isset($_POST['operacion'])) {
  $operacion = $_POST['operacion'];
  switch ($operacion) {
    case 'registrarAntena':
      $params = [
        'idDistrito' => $_POST['idDistrito'],
        'nombre' => $_POST['nombre'],
        'descripcion' => $_POST['descripcion'],
        'coordenadas' => $_POST['coordenadas'],
        'direccion' => $_POST['direccion'],
        'idUsuario' => $_POST['idUsuario']
      ];
      $respuesta = $antena->registrarAntena($params);
      echo json_encode($respuesta);
      break;
  }
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  $json = file_get_contents('php://input');
  $datos = json_decode($json, true);

  if (isset($datos['operacion'])) {
    $operacion = $datos['operacion'];
    switch ($operacion) {
      case 'inhabilitarAntena':
        $idAntena = $datos['idAntena'];
        $idUsuario = $datos['idUsuario'];
        $respuesta = $antena->inhabilitarAntenas([
          'idAntena' => $idAntena,
          'idUsuario' => $idUsuario
      ]);
        echo json_encode($respuesta);
        break;
    }
  }
}
