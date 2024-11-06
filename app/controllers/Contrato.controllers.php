<?php

use App\Controllers\Herramientas;

require_once '../models/Contrato.php';
require_once './Herramientas.php';

$contrato = new Contrato();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  switch (Herramientas::sanitizarEntrada($_GET['operacion'])) {
    case 'listarContratos':
      $start = isset($_GET['start']) ? (int)$_GET['start'] : 0;
      $length = isset($_GET['length']) ? (int)$_GET['length'] : 10;
      $search = isset($_GET['search']['value']) ? $_GET['search']['value'] : "";  
      $resultados = $contrato->listarContratos($start, $length, $search);
      $response = [
          "draw" => isset($_GET['draw']) ? (int)$_GET['draw'] : 1,
          "recordsTotal" => $resultados['totalRegistros'],
          "recordsFiltered" => $resultados['totalRegistros'],
          "data" => $resultados['contratos']
      ];
      echo json_encode($response);
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
        "direccion"           => Herramientas::sanitizarEntrada($datos['parametros']['direccion']),
        "referencia"          => Herramientas::sanitizarEntrada($datos['parametros']['referencia']),
        "coordenada"          => Herramientas::sanitizarEntrada($datos['parametros']['coordenada']),
        "fechaInicio"         => Herramientas::sanitizarEntrada($datos['parametros']['fechaInicio']),
        "fechaFin"            => json_encode($datos['parametros']['fechaFin']),
        "fechaRegistro"       => Herramientas::sanitizarEntrada($datos['parametros']['fechaRegistro']),
        "nota"                => Herramientas::sanitizarEntrada($datos['parametros']['nota']),
        "idUsuario"           => Herramientas::sanitizarEntrada($datos['parametros']['idUsuario'])
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
        "coordenada"         => Herramientas::sanitizarEntrada($datos['parametros']['coordenada']),
        "nota"               => Herramientas::sanitizarEntrada($datos['parametros']['nota']),
        "idUsuarioUpdate"    => Herramientas::sanitizarEntrada($datos['parametros']['idUsuarioUpdate'])
      ];
      $resultado = $contrato->actualizarContrato($datosActualizar);
      echo json_encode(["actualizado" => $resultado]);
      break;
  }
}
