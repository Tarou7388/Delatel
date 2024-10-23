<?php

use App\Controllers\Herramientas;

require_once '../models/Incidencia.php';
require_once './Herramientas.php';

$incidencia = new Incidencia();

if (isset($_GET["operacion"])) {
  if ($_GET["operacion"] == "ListarIncidencia") {
    $resultado = $incidencia->listarIncidencia();
    echo json_encode($resultado);
  }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $json = file_get_contents('php://input');
  $datos = json_decode($json, true);
  $operacion = Herramientas::sanitizarEntrada($datos['operacion']);

  switch ($operacion) {
    case "registrarIncidencia":
      $datos = [
        "idCliente"       => Herramientas::sanitizarEntrada($datos["idCliente"]),
        "fechaIncidencia" => Herramientas::sanitizarEntrada($datos["fechaIncidencia"]),
        "descripcion"     => Herramientas::sanitizarEntrada($datos["descripcion"]),
        "solucion"        => Herramientas::sanitizarEntrada($datos["solucion"]),
        "idtecnico"       => Herramientas::sanitizarEntrada($datos["idtecnico"]),
        "idUsuario"       => Herramientas::sanitizarEntrada($datos["idUsuario"])
      ];

      $resultado = $incidencia->registrarIncidencia($datos);
      echo json_encode(["guardado" => $resultado]);
      break;
  }
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  $json = file_get_contents('php://input');
  $datos = json_decode($json, true);
  $operacion = Herramientas::sanitizarEntrada($datos['operacion']);

  if ($operacion == "eliminarIncidencia") {
    $idIncidencia = Herramientas::sanitizarEntrada($datos["idIncidencia"]);
    $idUsuario = Herramientas::sanitizarEntrada($datos["idUsuario"]);

    $parametros = [
      "idIncidencia" => $idIncidencia,
      "idUsuario"    => $idUsuario
    ];

    $resultado = $incidencia->eliminarIncidencia($parametros);
    echo json_encode($resultado);
  }
}
