<?php

use App\Controllers\Herramientas;

session_start();

require_once "../models/Servicio.php";
require_once "./Herramientas.php";

$servicio = new Servicio();

if (isset($_GET["operacion"])){
  $operacion = Herramientas::sanitizarEntrada($_GET["operacion"]);
  switch ($operacion){
    case 'listarServicio':
      $resultado = $servicio->listarServicio();
      echo json_encode($resultado);
      break;
  }
}

/* if($_POST["operacion"]){
  switch ($_POST["operacion"]) {
    case "registrarServicio":
      $datos = [
        "servicio"    => Herramientas::sanitizarEntrada($_POST["servicio"]),
        "idUsuario"   => Herramientas::sanitizarEntrada($_POST["idUsuario"])
      ];

      $resultado = $servicio->registrarServicio($datos);
      echo json_encode(["guardado" => $resultado]);
      break;
  }
} */