<?php

use App\Controllers\Herramientas;

require_once '../models/Contrato.php';
require_once './Herramientas.php';

$contrato = new Contrato();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  switch (Herramientas::sanitizarEntrada($_GET['operacion'])) {
    case 'listarContratos':
      $resultado = $contrato->listarContratos();
      echo json_encode($resultado);
      break;
    case 'buscarContratoId':
      $resultado = $contrato->buscarContratoId(["id" => Herramientas::sanitizarEntrada($_GET['id'])]);
      echo json_encode($resultado);
      break;
    case 'obtenerFichaInstalacion':
      $resultado = $contrato->buscarFichaInstalacionId(["id" => Herramientas::sanitizarEntrada($_GET['id'])]);
      echo json_encode($resultado);
      break;
    case 'obtenerContratoPorCliente':
      $resultado = $contrato->buscarContratoporClienteId(["id" => Herramientas::sanitizarEntrada($_GET['id'])]);
      echo json_encode($resultado);
      break;
    case 'fichaIntalacionFiltro':
      $resultado = $contrato->listarFichaInstalacionFiltro();
      echo json_encode($resultado);
      break;
    case 'obtenerPDF':
      $resultado = $contrato->obtenerPDF(['id' => Herramientas::sanitizarEntrada($_GET['id'])]);
      echo json_encode($resultado);
      break;
    case "obtenerJsonFichabyId":
      $resultado = $contrato->obtenerJsonFichabyId(['id' => Herramientas::sanitizarEntrada($_GET['id'])]);
      echo json_encode($resultado);
      break;
    case 'obtenerCoordenadasbyId':
      $resultado = $contrato->obtenerCoordenadasbyId(['id' => Herramientas::sanitizarEntrada($_GET['id'])]);
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
        "idPaquete"           => Herramientas::sanitizarEntrada($datos['parametros']['idPaquete']),
        "idSector"            => Herramientas::sanitizarEntrada($datos['parametros']['idSector']),
        "direccion"           => Herramientas::sanitizarEntrada($datos['parametros']['direccion']),
        "referencia"          => Herramientas::sanitizarEntrada($datos['parametros']['referencia']),
        "coordenada"          => $datos['parametros']['coordenada'],
        "fechaInicio"         => Herramientas::sanitizarEntrada($datos['parametros']['fechaInicio']),
        "fechaRegistro"       => Herramientas::sanitizarEntrada($datos['parametros']['fechaRegistro']),
        "nota"                => Herramientas::sanitizarEntrada($datos['parametros']['nota']),
        "fichainstalacion"    => $datos['parametros']['fichainstalacion'],
        "idUsuario"           => Herramientas::sanitizarEntrada($datos['parametros']['idUsuario'])
      ];
      $resultado = $contrato->registrarContrato($datosEnviar);
      echo json_encode($resultado);
      break;
  }
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  $json = file_get_contents('php://input');
  $datos = json_decode($json, true);
  $operacion = Herramientas::sanitizarEntrada($datos['operacion']);
  switch ($operacion) {
    case 'eliminarContrato':
      $resultado = $contrato->eliminarContrato($datos['parametros']);
      echo json_encode(["eliminado" => $resultado]);
      break;
    case 'guardarFichaInstalacion':
      $data = [
        "id" => Herramientas::sanitizarEntrada($datos['id']),
        "fichaInstalacion" => json_encode($datos['fichaInstalacion']),
        "idUsuario" => Herramientas::sanitizarEntrada($datos['idUsuario'])
      ];
      $resultado = $contrato->guardarFichaInstalacion($data);
      echo json_encode(["guardado" => $resultado]);
      break;
    case 'actualizarContrato':
      $datosActualizar = [
        "idContrato"         => Herramientas::sanitizarEntrada($datos['parametros']['idContrato']),
        "idPaquete"          => Herramientas::sanitizarEntrada($datos['parametros']['idPaquete']),
        "direccionServicio"  => Herramientas::sanitizarEntrada($datos['parametros']['direccionServicio']),
        "referencia"         => Herramientas::sanitizarEntrada($datos['parametros']['referencia']),
        "nota"               => Herramientas::sanitizarEntrada($datos['parametros']['nota']),
        "fechaInicio"        => Herramientas::sanitizarEntrada($datos['parametros']['fechaInicio']),
        "idsector"           => Herramientas::sanitizarEntrada($datos['parametros']['idsector']),
        "fichaInstalacion"   => $datos['parametros']['fichaInstalacion'],
        "coordenada"         => $datos['parametros']['coordenada'],
        "idUsuarioUpdate"    => Herramientas::sanitizarEntrada($datos['parametros']['idUsuarioUpdate'])
      ];
      $resultado = $contrato->actualizarContrato($datosActualizar);
      echo json_encode(["actualizado" => $resultado]);
      break;
  }
}
