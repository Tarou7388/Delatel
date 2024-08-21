<?php
require_once "../models/Rol.php";

$rol = new Roles();
// operaciones con get
if(isset($_GET["operacion"])){
  switch($_GET["operacion"]){
    case 'getAllRol':
      $resultado  = $rol->getAllRol();
      echo json_encode($resultado);
      break;
  }
}

//operaciones con post
if(isset($_POST['operacion'])){
  switch($_POST['operacion']){
    case 'add':
      $datos = [
        "rol" => $_POST['rol']
      ];
      $resultado = $rol->addRol($datos);
      echo json_encode($resultado);
      break;
  }
}