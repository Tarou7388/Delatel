<?php

require_once '../models/Medidas.php';

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