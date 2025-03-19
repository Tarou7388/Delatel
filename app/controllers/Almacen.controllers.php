<?php
session_start();
use App\Controllers\Herramientas;
require_once './Herramientas.php';

require_once '../models/Almacen.php';

$Almacen = new Almacen();

if (isset($_GET['operacion'])) {
  $operacion = $_GET['operacion'];
  switch ($operacion) {
    case 'listarAlmacen':
      $respuesta = $Almacen->listarAlmacen();
      echo json_encode($respuesta);
      break;
    case 'listarAlmacenPorId':
      $id = $_GET['id'];
      $respuesta = $Almacen->listarAlmacenPorId($id);
      echo json_encode($respuesta);
      break;
  }
}

if(isset($_POST['operacion'])){
  $operacion = $_POST['operacion'];
  switch ($operacion) {
    case 'registrarAlmacen':
      $nombre = $_POST['nombre'];
      $ubicacion = $_POST['ubicacion'];
      $coordenada = $_POST['coordenada'];
      $idUsuario = $_SESSION['login']['idUsuario'];
      $params = [
        'nombre' => $nombre,
        'ubicacion' => $ubicacion,
        'coordenada' => $coordenada,
        'idUsuario' => $idUsuario
      ];
      $respuesta = $Almacen->registrarAlmacen($params);
      echo json_encode($respuesta);
      break;
    case 'actualizarAlmacen':
      $id = $_POST['id'];
      $nombre = $_POST['nombre'];
      $ubicacion = $_POST['ubicacion'];
      $coordenada = $_POST['coordenada'];
      $params = [
        'id' => $id,
        'nombre' => $nombre,
        'ubicacion' => $ubicacion,
        'coordenada' => $coordenada,
        'idUsuario' => $_SESSION['login']['idUsuario']
      ];
      $respuesta = $Almacen->actualizarAlmacen($params);
      echo json_encode($respuesta);
      break;
  }
}

if(isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] == 'PUT'){
  parse_str(file_get_contents("php://input"), $_PUT);
  $datos = json_decode(file_get_contents("php://input"), true);
  $operacion = $datos['operacion'];
  switch ($operacion) {
    case 'eliminarAlmacen':
      $id = $datos['id'];
      $respuesta = $Almacen->eliminarAlmacen($id);
      echo json_encode($respuesta);
      break;
}
  
}