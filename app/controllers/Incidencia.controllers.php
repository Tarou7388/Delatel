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

if (isset($_POST["operacion"])) {
  if ($_POST["operacion"] == "registrarIncidencia") {
    $datos = [
      "idCliente"       => Herramientas::sanitizarEntrada($_POST["idCliente"]),
      "fechaIncidencia" => Herramientas::sanitizarEntrada($_POST["fechaIncidencia"]),
      "descripcion"     => Herramientas::sanitizarEntrada($_POST["descripcion"]),
      "solucion"        => Herramientas::sanitizarEntrada($_POST["solucion"]),
      "idtecnico"       => Herramientas::sanitizarEntrada($_POST["idtecnico"]),
      "idUsuario"       => Herramientas::sanitizarEntrada($_POST["idUsuario"])
    ];

    $resultado = $incidencia->registrarIncidencia($datos);
    echo json_encode($resultado);
  }
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  $json = file_get_contents('php://input');
  $datos = json_decode($json, true);
  $operacion = Herramientas::sanitizarEntrada($datos['operacion']);

  if ($operacion === "eliminarIncidencia") {
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
