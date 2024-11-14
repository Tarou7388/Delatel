<?php

use App\Controllers\Herramientas;

require_once '../models/Averias.php';
require_once './Herramientas.php';

$averias = new Averia();

if (isset($_GET['operacion'])) {
  switch ($_GET['operacion']) {
    case 'buscarAveriaPorContrato':
      $valor = Herramientas::sanitizarEntrada($_GET['valor']);
      if (!empty($valor)) {
        $resultados = $averias->buscarAveriaPorContrato(['idContrato' => $valor]);
        echo json_encode($resultados);
      } else {
        echo json_encode([
          "estado" => "error",
          "mensaje" => "El ID del contrato es inválido."
        ]);
      }
      break;
  }
}
