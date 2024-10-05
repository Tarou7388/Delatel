<?php

session_start();

require_once "../models/Servicio.php";

$servicio = new Servicio();

if($_POST["operacion"]){
  switch ($_POST["operacion"]) {
    case "registrarServicio":
      $datos = [
        "servicio"    =>$_POST["servicio"],
        "idUsuario"   =>$_POST["idUsuario"]
      ];

      $resultado = $servicio->registrarServicio($datos);
      echo json_encode(["guardado" => $resultado]);
      break;
  }
}