<?php

session_start();

require_once "../models/Rol.php";

$rol = new Rol();
// operaciones con get
if (isset($_GET["operacion"])) {
  switch ($_GET["operacion"]) {
    case 'getAllRol':
      $resultado  = $rol->getAllRol();
      echo json_encode($resultado);
      break;
    case 'getPermisos':
      $datos = [
        "rol" => $_GET['rol']
      ];
      $resultado = $rol->getPermisos($datos);
      $_SESSION['permisos'] = $resultado;
      break;
    case 'getRolPermisos':
      $datos = [
        "idRol" => $_GET["idRol"]
      ];
      echo json_encode($resultado = $rol->getRolPermisos($datos));
      break;
  }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $json = file_get_contents('php://input');
  $datos = json_decode($json, true);
  $operacion = $datos['adicionales']['operacion'];
  switch ($operacion) {
    case 'add':
      $rolDato = $datos['adicionales']['rol'];
      $permisos = $datos['permisos'];
      $iduser_create =$datos['iduser_create'];
      $datosEnviar = [
        "rol" => $rolDato,
        "permisos" => $permisos,
        "iduser_create" => $iduser_create
      ];
      $resultado = $rol->addRol($datosEnviar);
      echo json_encode(["guardado" => $resultado]);
      break;
  }
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  $json = file_get_contents('php://input');
  $datos = json_decode($json, true);
  $operacion = $datos['adicionales']['operacion'];
  switch ($operacion) {
    case 'updatePermisos':
      $rolDato = $datos['adicionales']['idRol'];
      $permisos = $datos['permisos'];
      $iduser_update =$datos['iduser_update'];
      $datosEnviar = [
        "idRol" => $rolDato,
        "permisos" => $permisos,
        "iduser_update" => $iduser_update
      ];
      $resultado = $rol->updatePermisos($datosEnviar);
      echo json_encode(["guardado" => $resultado]);
      break;
  }
}