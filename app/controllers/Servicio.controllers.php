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

if($_SERVER['REQUEST_METHOD'] === 'POST') {
  $json = file_get_contents('php://input');
  $datos = json_decode($json, true);
  $operacion = Herramientas::sanitizarEntrada($datos['operacion']);
  switch ($operacion) {
    case 'registrarServicio':
      $datosEnviar = [
        "tipo_servicio" => Herramientas::sanitizarEntrada($datos['parametros']["tipo_servicio"]),
        "servicio"      => Herramientas::sanitizarEntrada($datos['parametros']["servicio"]),
        "idUsuario"     => Herramientas::sanitizarEntrada($datos['parametros']["idUsuario"])
      ];
      $resultado = $servicio->registrarServicio($datosEnviar);
      echo json_encode(["guardado" => $resultado]);
      break;
  }
}

if($_SERVER['REQUEST_METHOD'] === 'PUT'){
  $json = file_get_contents('php://input');
  $datos = json_decode($json, true);
  $operacion = Herramientas::sanitizarEntrada($datos['operacion']);
  switch($operacion){
    case "actualizarServicio":
      $datosActualizar = [
        "idServicio"    => Herramientas::sanitizarEntrada($datos['parametros']['idServicio']),
        "tipo_servicio" => Herramientas::sanitizarEntrada($datos['parametros']['tipo_servicio']),
        "servicio"      => Herramientas::sanitizarEntrada($datos['parametros']['servicio']),
        "idUsuario"     => Herramientas::sanitizarEntrada($datos['parametros']["idUsuario"])
      ];
      $resultado = $servicio->actualizarServicio($datosActualizar);
      echo json_encode(["actualizado" => $resultado]);
      break;
    case "eliminarServicio":
      $resultado = $servicio->eliminarServicio($datos['parametros']);
      echo json_encode(["eliminado" => $resultado]);
      break;
    case "reactivarServicio":
      $resultado = $servicio->reactivarServicio($datos['parametros']);
      echo json_encode(["activado" => $resultado]);
      break;
  }
}