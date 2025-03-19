
<?php

use App\Controllers\Herramientas;

session_start();

require_once '../models/Responsable.php';
require_once './Herramientas.php';

$responsable = new Responsable();

if (isset($_POST['operacion'])) {
  switch ($_POST['operacion']) {
    case 'registrarResponsable':
      $datos = [
        "idUsuario"                   => Herramientas::sanitizarEntrada($_POST['idUsuario']),
        "idRol"                       => Herramientas::sanitizarEntrada($_POST['idRol']),
        "FechaInicio"                 => $_POST['FechaInicio'],
        "idUsuarioCreador"            => Herramientas::sanitizarEntrada($_POST['idUsuarioCreador']),
      ];
      $estado = $responsable->RegistrarResponsable($datos);
      echo json_encode(["Guardado" => $estado]);
      break;
  }
}


if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  $json = file_get_contents('php://input');
  $datos = json_decode($json, true);
  $operacion = $datos['operacion'];

  switch ($operacion) {
    case 'actualizarResponsable':
      $datos = [
        "idUsuario"   => $datos['datos']['idUsuario'],  
        "idRol"                   => $datos['datos']['idRol'],                  
        "idUsuarioCreador"           => $datos['datos']['idUsuarioCreador'],         
        "idResponsable"           => $datos['datos']['idResponsable']           
      ];

      $estado = $responsable->actualizarResponsable($datos);
      echo json_encode(["Actualizado" => $estado]);
      break;
  }
}
