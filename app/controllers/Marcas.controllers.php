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
    case 'listarMarcaPorId':
      $respuesta = $marca->listarMarcaPorId(['idMarca' => $_GET['idMarca']]);
      echo json_encode($respuesta);
      break;
  }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $json = file_get_contents('php://input');
  $datos = json_decode($json, true);
  $operacion = Herramientas::sanitizarEntrada($datos['operacion']);
  switch ($operacion) {
    case 'registrarMarca':
      $datosEnviar = [
        "marca" => Herramientas::sanitizarEntrada($datos['marca']),
        "idUsuario" => Herramientas::sanitizarEntrada($datos['idUsuario'])
      ];
      $resultado = $marca->registrarMarca($datosEnviar);
      echo json_encode(["guardado" => $resultado]);
      break;
  }
}


if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  $input = json_decode(file_get_contents('php://input'), true);
  if ($input['operacion'] === 'actualizarMarca') {
    $datos = [
      "idmarca"      => Herramientas::sanitizarEntrada($input['idmarca']),
      "marca"        => Herramientas::sanitizarEntrada($input['marca']),
      "iduserUpdate" => Herramientas::sanitizarEntrada($input['iduserUpdate'])
    ];

    $estado = $marca->actualizarMarca($datos);
    echo json_encode(["Actualizado" => $estado]);
  }
}
