<?php

use App\Controllers\Herramientas;

require_once '../models/Empresa.php';
require_once './Herramientas.php';

$empresa = new Empresa();

if (isset($_GET["operacion"])) {
  $operacion = Herramientas::sanitizarEntrada($_GET['operacion']);
  switch ($operacion) {
    case 'buscarClienteIdEmpresa':
      $resultado = $empresa->buscarEmpresaClienteId([
        'id' => Herramientas::sanitizarEntrada($_GET['id'])
      ]);
      echo json_encode($resultado);
      break;
    default:
      echo json_encode(['error' => 'Operación no válida']);
      break;
  }
}

if (isset($_POST["operacion"])) {
  if ($_POST["operacion"] == "registrarEmpresa") {
    $datos = [
      "ruc"                   => Herramientas::sanitizarEntrada($_POST["ruc"]),
      "representanteLegal"   => Herramientas::sanitizarEntrada($_POST["representanteLegal"]),
      "razonSocial"          => Herramientas::sanitizarEntrada($_POST["razonSocial"]),
      "nombreComercial"      => Herramientas::sanitizarEntrada($_POST["nombreComercial"]),
      "telefono"              => Herramientas::sanitizarEntrada($_POST["telefono"]),
      "email"                 => Herramientas::sanitizarEntrada($_POST["email"]),
      "idUsuario"         => Herramientas::sanitizarEntrada($_POST["idUsuario"])
    ];

    $resultado = $empresa->registrarEmpresa($datos);
    echo json_encode($resultado);
  }
}
