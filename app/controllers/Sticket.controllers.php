<?php

use App\Controllers\Herramientas;

session_start();

require_once "../models/Sticket.php";
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
  }
}