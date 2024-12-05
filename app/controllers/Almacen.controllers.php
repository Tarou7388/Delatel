<?php

use App\Controllers\Herramientas;
require_once './Herramientas.php';

require_once '../models/Almacen.php';

$Almacen = new Almacen();

if (isset($_GET['operacion'])) {
  $operacion = $_GET['operacion'];
  switch ($operacion) {
    case 'listarAlmacen':
      $respuesta = $Almacen->listarAlmacen();
      echo json_encode($respuesta);
      break;
  }
}
