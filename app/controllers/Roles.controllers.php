<?php

session_start();

require_once "../models/Rol.php";

$rol = new Rol();
// operaciones con get
if (isset($_GET["operacion"])) {
  switch ($_GET["operacion"]) {
    case 'getAllRol':
      $resultado  = $rol->listarRoles();
      echo json_encode($resultado);
      break;
    case 'listarPermisosIdRol':
      $datos = [
        "idRol" => $_GET['idRol']
      ];
      $resultado = $rol->listarPermisosIdRol($datos);
      if(!isset($_SESSION['permisos'])){
        $_SESSION['permisos'] = $resultado;
      }
      break;
  }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $json = file_get_contents('php://input');
  $datos = json_decode($json, true);
  $operacion = $datos['operacion'];
  switch ($operacion) {
    case 'registrarRoles':
      $datosEnviar = [
        "rol" => $datos['rol'],
        "permisos" => $datos['permisos'],
        "idUsuario" => $datos['idUsuario']
      ];
      $resultado = $rol->registrarRoles($datosEnviar);
      echo json_encode(["guardado" => $resultado]);
      break;
  }
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  $json = file_get_contents('php://input');
  $datos = json_decode($json, true);
  $operacion = $datos['operacion'];
  switch ($operacion) {
    case 'actualizarPermisos':
      $datosEnviar = [
        "idRol" => $datos['idRol'],
        "permisos" => $datos['permisos'],
        "idUsuario" => $datos['idUsuario']
      ];
      $resultado = $rol->actualizarPermisos($datosEnviar);
      echo json_encode(["guardado" => $resultado]);
      break;
    case 'actualizarRol':
      if (isset($datos['id_rol'])) {
        $updateData = [
            "rol" => $datos['rol'],
            "iduser_update" => $datos['iduser_update'],
            "id_rol" => $datos['id_rol']
        ];
        $estado = $rol->actualizarRol($updateData);
        echo json_encode(["Actualizado" => $estado]);
      } else {
        echo json_encode(["Actualizado" => false, "error" => "ID de rol no encontrado"]);
      }
      break;
      case 'eliminarRol':
        if (isset($datos['id_rol']) && isset($datos['iduser_inactive'])) {
            $inhabilitarData = [
                "id_rol" => $datos['id_rol'],
                "iduser_inactive" => $datos['iduser_inactive']
            ];
            $estado = $rol->eliminarRol($inhabilitarData);
            echo json_encode(["Inhabilitado" => $estado]);
        } else {
            echo json_encode(["Inhabilitado" => false, "error" => "ID de rol o usuario no encontrado"]);
        }
        break;
  }
}