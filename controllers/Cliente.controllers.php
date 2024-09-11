<?php
require_once '../models/Cliente.php';

$cliente = new Cliente();

if(isset($_GET["operacion"])){
  switch($_GET['operacion']){
    case 'getByDoc':
      $resultado = $cliente->getByDoc(["doc" => $_GET['doc']]);
      echo json_encode($resultado);
      break;
  }
}