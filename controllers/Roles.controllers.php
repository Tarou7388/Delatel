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
      $datosEnviar = [
        "rol" => $rolDato,
        "permisos" => $permisos
      ];
      $resultado = $rol->addRol($datosEnviar);
      echo json_encode(["guardado" => $resultado]);
      break;
  }
}