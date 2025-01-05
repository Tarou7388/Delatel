<?php

use App\Controllers\Herramientas;

require_once "../models/sticket.php";
require_once "./Herramientas.php";

$sticket = new Sticket();

if (isset($_GET["operacion"])) {
  switch ($_GET["operacion"]) {
    case "listarContratosPendientes":
      $resultado = $sticket->listarContratosPendientes();
      echo json_encode($resultado);
      break;
    case "contarClientes":
      $resultado = $sticket->contarClientes();
      echo json_encode($resultado);
      break;
    case "contarContratosPendientes":
      $resultado = $sticket->contarContratosPendientes();
      echo json_encode($resultado);
      break;
    case "listarAveriasPendientes":
      $resultado = $sticket->listarAveriasPendientes();
      echo json_encode($resultado);
      break;
    case "contarAveriasPendientes":
      $resultado = $sticket->contarAveriasPendientes();
      echo json_encode($resultado);
      break;
  }
}