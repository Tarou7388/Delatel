<?php

use App\Controllers\Herramientas;

require_once '../models/Contactabilidad.php';
require_once './Herramientas.php';

$contactabilidad = new Contactabilidad();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  switch ($_GET['operacion']) {
    case 'obtenerContactos':
      echo json_encode($contactabilidad->obtenerContactos());
      break;
  }
}
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $json = file_get_contents('php://input');
  $datos = json_decode($json, true);
  $operacion = Herramientas::sanitizarEntrada($datos['operacion']);
  switch ($operacion) {
    case 'registrarContacto':
      $respuesta = $contactabilidad->registrarContacto([
        'idPersona' => Herramientas::sanitizarEntrada($datos['idPersona']),
        'idPaquete' => Herramientas::sanitizarEntrada($datos['idPaquete']),
        'direccion' => Herramientas::sanitizarEntrada($datos['direccion']),
        'nota' => Herramientas::sanitizarEntrada($datos['nota']),
        'idUsuario' => Herramientas::sanitizarEntrada($datos['idUsuario']),
        'fechaLimite' => Herramientas::sanitizarEntrada($datos['fechaLimite'])
      ]);
      echo json_encode(["guardado" => $respuesta]);
      break;
  }
}
