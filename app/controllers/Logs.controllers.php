<?php

use App\Controllers\Herramientas;

require_once '../models/Logs.php';
require_once './Herramientas.php';
$logs = new Logs();


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json = file_get_contents('php://input');
    $datos = json_decode($json, true);
    $operacion = Herramientas::sanitizarEntrada($datos['operacion']);
    switch ($operacion) {
        case 'obtenerRegistrosContrato':
            $data = [
                "idContrato"         => Herramientas::sanitizarEntrada($datos['idContrato']),
                "tbOption"         => Herramientas::sanitizarEntrada($datos['tbOption'])
            ];
            $resultado = $logs->obtenerRegistrosContrato($data);
            echo json_encode([$resultado]);
            break;
        case 'obtenerDetallados':
            $data = [
                "id" => Herramientas::sanitizarEntrada($datos['id'])
            ];
            $resultado = $logs->obtenerDetallados($data);
            echo json_encode([$resultado]);
            break;
    }
}
