<?php

use App\Controllers\Herramientas;

session_start();

require_once "../models/Paquete.php";
require_once "./Herramientas.php";

$paquete = new Paquete();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $json = file_get_contents('php://input');
  $datos = json_decode($json, true);
  $operacion = Herramientas::sanitizarEntrada($datos['operacion']);
  switch ($operacion) {
    case 'registrarPaquete':
      $datosEnviar = [
          "idServicio"    => Herramientas::sanitizarEntrada($datos['parametros']["idServicio"]),
          "idServicio2"   => isset($datos['parametros']["idServicio2"]) ? Herramientas::sanitizarEntrada($datos['parametros']["idServicio2"]) : null,
          "idServicio3"   => isset($datos['parametros']["idServicio3"]) ? Herramientas::sanitizarEntrada($datos['parametros']["idServicio3"]) : null,
          "idServicio4"   => isset($datos['parametros']["idServicio4"]) ? Herramientas::sanitizarEntrada($datos['parametros']["idServicio4"]) : null,
          "paquete"       => Herramientas::sanitizarEntrada($datos['parametros']["paquete"]),
          "precio"        => Herramientas::sanitizarEntrada($datos['parametros']["precio"]),
          "duracion"      => json_encode($datos['parametros']["duracion"]),
          "idUsuario"     => Herramientas::sanitizarEntrada($datos['parametros']["idUsuario"])
      ];
      $resultado = $paquete->registrarPaquete($datosEnviar);
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
    case "buscarPaqueteId":
      $resultado = $paquete->buscarPaqueteId(["idPaquete" => Herramientas::sanitizarEntrada($_GET['idPaquete'])]);
      echo json_encode($resultado);
      break;
    case "buscarPaquetePorIdServicio":
      $resultado = $paquete->buscarPaquetePorIdServicio(["idServicio" => Herramientas::sanitizarEntrada($_GET['idServicio'])]);
      echo json_encode($resultado);
      break;
  }
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  $json = file_get_contents('php://input');
  $datos = json_decode($json, true);
  $operacion = Herramientas::sanitizarEntrada($datos['operacion']);
  switch ($operacion) {
    case "actualizarPaquete":
      $datosActualizar = [
        "idPaquete"         => Herramientas::sanitizarEntrada($datos['parametros']["idPaquete"]),
        "idServicio"        => Herramientas::sanitizarEntrada($datos['parametros']["idServicio"]),
        "idServicio2"   => isset($datos['parametros']["idServicio2"]) ? Herramientas::sanitizarEntrada($datos['parametros']["idServicio2"]) : null,
        "idServicio3"   => isset($datos['parametros']["idServicio3"]) ? Herramientas::sanitizarEntrada($datos['parametros']["idServicio3"]) : null,
        "idServicio4"   => isset($datos['parametros']["idServicio4"]) ? Herramientas::sanitizarEntrada($datos['parametros']["idServicio4"]) : null,
        "paquete"           => Herramientas::sanitizarEntrada($datos['parametros']["paquete"]),
        "precio"            => Herramientas::sanitizarEntrada($datos['parametros']["precio"]),
        "duracion"          => json_encode($datos['parametros']["duracion"]),
        "idUsuario"   => Herramientas::sanitizarEntrada($datos['parametros']["idUsuario"])
      ];
      $resultado = $paquete->actualizarPaquete($datosActualizar);
      echo json_encode(["actualizado" => $resultado]);
      break;
    case "eliminarPaquete":
      $resultado = $paquete->eliminarPaquete($datos['parametros']);
      echo json_encode(["eliminado" => $resultado]);
      break;
  }
}
