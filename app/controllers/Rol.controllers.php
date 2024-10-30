<?php

use App\Controllers\Herramientas;

session_start();

require_once "../models/Rol.php";
require_once "./Herramientas.php";

$rol = new Rol();

// operaciones con get
if (isset($_GET["operacion"])) {
  $operacion = Herramientas::sanitizarEntrada($_GET["operacion"]);
  switch ($operacion) {
    case 'listarRoles':
      $resultado  = $rol->listarRoles();
      echo json_encode($resultado);
      break;
      case 'listarPermisosIdRol':
        $datos = [
          "idRol" => Herramientas::sanitizarEntrada($_GET['idRol'])
        ];
        $resultado = $rol->listarPermisosIdRol($datos);
        
        if ($resultado) {
            echo json_encode(["permisos" => $resultado]);
        } else {
            echo json_encode(["error" => "No se encontraron permisos"]);
        }
        break;     
  }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $json = file_get_contents('php://input');
  $datos = json_decode($json, true);
  $operacion = Herramientas::sanitizarEntrada($datos['operacion']);
  switch ($operacion) {
    case 'registrarRoles':
      $datosEnviar = [
          "rol" => Herramientas::sanitizarEntrada($datos['rol']),
          "permisos" => Herramientas::sanitizarEntrada($datos['permisos']), // Permisos puede ser un array
          "idUsuario" => Herramientas::sanitizarEntrada($datos['idUsuario'])
      ];
      $resultado = $rol->registrarRoles($datosEnviar);
      echo json_encode(["guardado" => $resultado]);
      break;   
  }
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  $json = file_get_contents('php://input');
  $datos = json_decode($json, true);
  $operacion = Herramientas::sanitizarEntrada($datos['operacion']);
  switch ($operacion) {
    case 'actualizarPermisos':
      $datosEnviar = [
        "idRol" => Herramientas::sanitizarEntrada($datos['idRol']),
        "permisos" => Herramientas::sanitizarEntrada($datos['permisos']),
        "idUsuario" => Herramientas::sanitizarEntrada($datos['idUsuario'])
      ];
      $resultado = $rol->actualizarPermisos($datosEnviar);
      echo json_encode(["guardado" => $resultado]);
      break;
    case 'actualizarRol':
      if (isset($datos['idRol'])) {
        $updateData = [
            "idRol" => Herramientas::sanitizarEntrada($datos['idRol']),
            "rol" => Herramientas::sanitizarEntrada($datos['rol']),
            "idUsuario" => Herramientas::sanitizarEntrada($datos['idUsuario'])
        ];
        $estado = $rol->actualizarRol($updateData);
        echo json_encode(["Actualizado" => $estado]);
      } else {
        echo json_encode(["Actualizado" => false, "error" => "ID de rol no encontrado"]);
      }
      break;
    case 'eliminarRol':
      if (isset($datos['idRol']) && isset($datos['idUsuario'])) {
        $inhabilitarData = [
            "idRol" => Herramientas::sanitizarEntrada($datos['idRol']),
            "idUsuario" => Herramientas::sanitizarEntrada($datos['idUsuario'])
        ];
        $estado = $rol->eliminarRol($inhabilitarData);
        echo json_encode(["Inhabilitado" => $estado]);
      } else {
        echo json_encode(["Inhabilitado" => false, "error" => "ID de rol o usuario no encontrado"]);
      }
      break;
    case 'activarRol':
      if (isset($datos['idRol']) && isset($datos['idUsuario'])) {
      $activarData = [
        "idRol" => Herramientas::sanitizarEntrada($datos['idRol']),
        "idUsuario" => Herramientas::sanitizarEntrada($datos['idUsuario'])
      ];
      $estado = $rol->activarRol($activarData);
      echo json_encode(["Activado" => $estado]);
      } else {
      echo json_encode(["Activado" => false, "error" => "ID de rol o usuario no encontrado"]);
      }
      break;
  }
}