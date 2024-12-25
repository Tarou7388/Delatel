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

if(isset($_POST['operacion'])){
  $action = $_POST['operacion'];
  switch($action){
    case 'actualizarLineas':
      $array = [
        'id' => $_POST['id'],
        'coordenadas' => $_POST['coordenadas'],
        'idUsuario' => $_POST['idUsuario']
      ];
      $response = $lineas->actualizarLineas($array);
      echo json_encode($response);
      break;
    default:
      echo json_encode(['error' => 'Invalid action']);
  }
}