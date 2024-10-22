<?php

require_once '../models/Caja.php';

$caja = new Caja();

if(isset($_GET['operacion'])){
  $operacion = $_GET['operacion'];
  switch ($operacion) {
    case 'listarCajas':
      $respuesta = $caja->listarCajas();
      echo json_encode($respuesta);
      break;
  }
}