<?php


use App\Controllers\Herramientas;

require_once '../models/Marca.php';
require_once "./Herramientas.php";


$marca = new Marca();

if (isset($_GET['operacion'])) {
  $operacion = $_GET['operacion'];
  switch ($operacion) {
    case 'listarmarca':
      $respuesta = $marca->listarMarcas();
      echo json_encode($respuesta);
      break;
  }
}
