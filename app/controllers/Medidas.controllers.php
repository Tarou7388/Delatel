<?php

use App\Controllers\Herramientas;
require_once '../models/Medidas.php';
require_once "./Herramientas.php";

$medida = new Medida();

if(isset($_GET['operacion'])){
  $operacion = $_GET['operacion'];
  switch ($operacion) {
    case 'listarmedidas':
      $respuesta = $medida->listarMedidas();
      echo json_encode($respuesta);
      break;
  }
}