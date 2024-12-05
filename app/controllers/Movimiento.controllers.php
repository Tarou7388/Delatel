<?php

use App\Controllers\Herramientas;
require_once '../models/Movimiento.php';
require_once "./Herramientas.php";

$movimiento = new Movimiento();

if (isset($_GET['operacion'])) {
  $operacion = $_GET['operacion'];
  switch ($operacion) {
    case 'FiltrarSoportePrioridad':
      echo json_encode($movimiento->filtroOperaciones(["movimiento" => $_GET['movimiento']]));
      break;
  }
}
