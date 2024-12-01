<?php 

use App\Controllers\Herramientas;

session_start();

require_once "../models/Base.php";
require_once "./Herramientas.php";

$base = new Base();

if (isset($_GET["operacion"])) {
  switch ($_GET["operacion"]) {
    case "listarBase":
      $resultado = $base->listarBase();
      echo json_encode($resultado);
      break;
    case "buscarBaseId":
      $resultado = $base->listarBasePorId(["id" => Herramientas::sanitizarEntrada($_GET['id'])]);
      echo json_encode($resultado);
      break;
  }
}