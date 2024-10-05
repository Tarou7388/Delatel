<?php

session_start();

require_once "../models/Paquete.php";

$paquete = new Paquete();

if (isset($_POST["operacion"])) {
  switch ($_POST["operacion"]) {
    case "registrarPaquete":
      $datos = [
        "idServicio"        => $_POST["idServicio"],
        "precio"            => $_POST["precio"],
        "tipoPaquete"       => $_POST["tipo_paquete"],
        "fechaInicio"       => $_POST["fechaInicio"],
        "fechaFin"          => $_POST["fechaFin"],
        "idUsuario"         => $_POST["idUsuario"]
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
