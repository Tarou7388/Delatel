<?php

require_once '../models/Lineas.php';
$lineas = new Lineas();

if(isset($_GET['operacion'])){
  $action = $_GET['operacion'];
  switch($action){
    case 'getLineas':
      $data = $lineas->getLineas();
      echo json_encode($data);
      break;
    default:
      echo json_encode(['error' => 'Invalid action']);
  }
}