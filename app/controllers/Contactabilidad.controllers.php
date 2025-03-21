<?php

use App\Controllers\Herramientas;

require_once '../models/Contactabilidad.php';
require_once './Herramientas.php';

$contactabilidad = new Contactabilidad();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  if ($_GET['operacion'] === 'obtenerContactos') {
    $contactos = $contactabilidad->obtenerContactos();
    echo json_encode($contactos);
  }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $json = file_get_contents('php://input');
  $datos = json_decode($json, true);
  $operacion = Herramientas::sanitizarEntrada($datos['operacion']);
  switch ($operacion) {
    case 'registrarContacto':
      $idPersona = null;
      $idEmpresa = null;
      if (isset($datos['idEmpresa']) && $datos['idEmpresa'] !== '') {
        $idEmpresa = $datos['idEmpresa'];
        $idPersona = null;
      }
      if (isset($datos['idPersona']) && $datos['idPersona'] !== '') {
        $idPersona = $datos['idPersona'];
        $idEmpresa = null;
      }
      $respuesta = $contactabilidad->registrarContacto([
        'idPersona' => $idPersona,
        'idEmpresa' => $idEmpresa,
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
