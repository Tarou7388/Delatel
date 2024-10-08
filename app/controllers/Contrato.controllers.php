<?php

use App\Controllers\Herramientas;

require_once '../models/Contrato.php';
require_once './Herramientas.php';

$contrato = new Contrato();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  switch (Herramientas::sanitizarEntrada($_GET['operacion'])) {
    case 'listarContratos':
      echo json_encode($contrato->listarContratos());
      break;
    case 'buscarContratoId':
      $resultado = $contrato->buscarContratoId(["id" => Herramientas::sanitizarEntrada($_GET['id'])]);
      echo json_encode($resultado);
      break;
    case 'obtenerFichaInstalacion':
      $resultado = $contrato->buscarFichaInstalacionId(["id" => Herramientas::sanitizarEntrada($_GET['id'])]);
      echo json_encode($resultado);
      break;
  }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $json = file_get_contents('php://input');
  $datos = json_decode($json, true);
  $operacion = Herramientas::sanitizarEntrada($datos['operacion']);
  switch ($operacion) {
    case 'registrarContrato':
      $datosEnviar = [
        "idCliente"           => Herramientas::sanitizarEntrada($datos['parametros']['idCliente']),
        "idTarifario"         => Herramientas::sanitizarEntrada($datos['parametros']['idTarifario']),
        "idSector"            => Herramientas::sanitizarEntrada($datos['parametros']['idSector']),
        "idUsuarioRegistro"   => Herramientas::sanitizarEntrada($datos['parametros']['idUsuarioRegistro']),
        "direccion"           => Herramientas::sanitizarEntrada($datos['parametros']['direccion']),
        "referencia"          => Herramientas::sanitizarEntrada($datos['parametros']['referencia']),
        "coordenada"          => Herramientas::sanitizarEntrada($datos['parametros']['coordenada']),
        "fechaInicio"         => Herramientas::sanitizarEntrada($datos['parametros']['fechaInicio']),
        "fechaFin"            => Herramientas::sanitizarEntrada($datos['parametros']['fechaFin']),
        "fechaRegistro"       => Herramientas::sanitizarEntrada($datos['parametros']['fechaRegistro']),
        "fichaInstalacion"    => json_encode($datos['parametros']['fichaInstalacion']),
        "nota"                => Herramientas::sanitizarEntrada($datos['parametros']['nota'])
      ];
      $resultado = $contrato->registrarContrato($datosEnviar);
      echo json_encode(["guardado" => $resultado]);
      break;
  }
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  $json = file_get_contents('php://input');
  $datos = json_decode($json, true);
  $operacion = Herramientas::sanitizarEntrada($datos['operacion']);
  switch ($operacion) {
    case 'eliminarContrato':
      $resultado = $contrato->eliminarContrato(Herramientas::sanitizarEntrada($datos['parametros']));
      echo json_encode(["eliminado" => $resultado]);
      break;
    case 'guardarFichaInstalacion':
      $data = [
        "id" => Herramientas::sanitizarEntrada($datos['id']),
        "fichaInstalacion" => json_encode($datos['fichaInstalacion'])
      ];
      $resultado = $contrato->guardarFichaInstalacion($data);
      echo json_encode(["guardado" => $resultado]);
      break;
  }
}
