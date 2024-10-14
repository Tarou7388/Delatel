
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
        "FechaInicio"                 => Herramientas::sanitizarEntrada($_POST['FechaInicio']),
        "idUsuarioCreador"            => Herramientas::sanitizarEntrada($_POST['idUsuarioCreador']),
      ];
      $estado = $responsable->RegistrarResponsable($datos);
      echo json_encode(["Guardado" => $estado]);
      break;
  }
}
