<?php


use App\Controllers\Herramientas;

require_once '../models/Marca.php';
require_once "./Herramientas.php";


$marca = new Marca();
$input = json_decode(file_get_contents('php://input'), true);

if (isset($_GET['operacion'])) {
  $operacion = $_GET['operacion'];
  switch ($operacion) {
    case 'listarmarca':
      $respuesta = $marca->listarMarcas();
      echo json_encode($respuesta);
      break;
  }
}

if($_SERVER['REQUEST_METHOD'] === 'POST'){
  if(isset($input['operacion'])){
    switch ($input['operacion']) {
      case 'registrarMarca':
        $datos = [
          "marca" => Herramientas::sanitizarEntrada($input['marca']),
          "idUsuario" => Herramientas::sanitizarEntrada($input["idUsuario"])
        ];
        $estado = $marca->registrarMarca($datos);
        echo json_encode(["Guardado" => $estado]);
        break;
    }
  }
}
