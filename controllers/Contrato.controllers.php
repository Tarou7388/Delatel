<?php

require_once '../models/Contrato.php';

$contrato = new Contrato();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  switch ($_GET['operacion']) {
    case 'getAll':
      echo json_encode($contrato->getAll());
      break;
    case 'getById':
      $resultado = $contrato->buscarId(["id" => $_GET['id']]);
      echo json_encode($resultado);
      break;
    case 'obtenerFichaInstalacion':
      $resultado = $contrato->obtenerFichaInstalacion(["id" => $_GET['id']]);
      echo json_encode($resultado);
      break;
  }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $json = file_get_contents('php://input');
  $datos = json_decode($json, true);
  $operacion = $datos['operacion'];
  switch ($operacion) {
    case 'add':
      $datosEnviar = [
        "idCliente"           => $datos['parametros']['idCliente'],
        "idTarifario"         => $datos['parametros']['idTarifario'],
        "idSector"            => $datos['parametros']['idSector'],
        "idUsuarioRegistro"   => $datos['parametros']['idUsuarioRegistro'],
        "direccion"           => $datos['parametros']['direccion'],
        "referencia"          => $datos['parametros']['referencia'],
        "coordenada"          => $datos['parametros']['coordenada'],
        "fechaInicio"         => $datos['parametros']['fechaInicio'],
        "fechaFin"            => $datos['parametros']['fechaFin'],
        "fechaRegistro"       => $datos['parametros']['fechaRegistro'],
        "fichaInstalacion"    => json_encode($datos['parametros']['fichaInstalacion']),
        "nota"                => $datos['parametros']['nota']
      ];
      $resultado = $contrato->add($datosEnviar);
      echo json_encode(["guardado" => $resultado]);
      break;
  }
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  $json = file_get_contents('php://input');
  $datos = json_decode($json, true);
  $operacion = $datos['operacion'];
  switch ($operacion) {
    case 'delete':
      $resultado = $contrato->delete($datos['parametros']);
      echo json_encode(["eliminado" => $resultado]);
      break;
    case 'guardarFichaInstalacion':
      $data = [
        "id" => $datos['id'],
        "fichaInstalacion" => json_encode($datos['fichaInstalacion'])
      ];
      $resultado = $contrato->guardarFichaInstalacion($data);
      echo json_encode(["guardado" => $resultado]);
      break;
  }
}
