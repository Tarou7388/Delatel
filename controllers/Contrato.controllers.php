<?php

require_once '../models/Contrato.php';

$contrato = new Contrato();

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