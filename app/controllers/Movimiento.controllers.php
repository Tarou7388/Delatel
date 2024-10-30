<?php

require_once '../models/Movimiento.php';

$movimiento = new Movimiento();

if (isset($_GET['operacion'])) {
  $operacion = $_GET['operacion'];
  switch ($operacion) {
    case 'FiltrarSoportePrioridad':
      echo json_encode($movimiento->filtroOperaciones(["movimiento" => $_GET['movimiento']]));
      break;
  }
}
