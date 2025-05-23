<?php

use App\Controllers\Herramientas;

require_once '../models/Distrito.php';
require_once './Herramientas.php';

$distritos = new Distritos();

if (isset($_GET['operacion'])) {
  switch ($_GET['operacion']) {
    case 'buscarDistrito':
      $valor = Herramientas::sanitizarEntrada($_GET['valor']);
      if (!empty($valor)) {
        $resultados = $distritos->buscarDistrito(['idProvincia' => $valor]);
        echo json_encode($resultados);
      } else {
        echo json_encode([
          "estado" => "error",
          "mensaje" => "El ID de la pronvincia es inválido."
        ]);
      }
      break;
    case 'listarLimites':
      $valor = Herramientas::sanitizarEntrada($_GET['valor']);
      if (!empty($valor)) {
        $resultados = $distritos->listarLimites(['idDistrito' => $valor]);
        foreach ($resultados as $key => $value) {
          $resultados[$key]['limites'] = json_decode($value['limites']);
        }
        echo json_encode($resultados);
      } else {
        echo json_encode([
          "estado" => "error",
          "mensaje" => "El ID del distrito es inválido."
        ]);
      }
      break;
  }
}
