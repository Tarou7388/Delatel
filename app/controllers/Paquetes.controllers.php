<?php

use App\Controllers\Herramientas;

session_start();

require_once "../models/Paquete.php";
require_once "./Herramientas.php";

$paquete = new Paquete();

if (isset($_POST["operacion"])) {
  switch ($_POST["operacion"]) {
    case "registrarPaquete":
      $datos = [
        "idServicio"        => Herramientas::sanitizarEntrada($_POST["idServicio"]),
        "precio"            => Herramientas::sanitizarEntrada($_POST["precio"]),
        "tipoPaquete"       => Herramientas::sanitizarEntrada($_POST["tipoPaquete"]),
        "fechaInicio"       => Herramientas::sanitizarEntrada($_POST["fechaInicio"]),
        "fechaFin"          => Herramientas::sanitizarEntrada($_POST["fechaFin"]),
        "idUsuario"         => Herramientas::sanitizarEntrada($_POST["idUsuario"])
      ];
      $resultado = $paquete->registrarPaquete($datos);
      echo json_encode(["guardado" => $resultado]);
      break;
  }
}

if (isset($_GET["operacion"])) {
  switch ($_GET["operacion"]) {
    case "listarPaquetes":
      $resultado = $paquete->listarPaquetes();
      echo json_encode($resultado);
      break;
  }
}
