<?php

require_once '../models/Persona.php';

$persona = new Persona();
$token = 'apis-token-10446.A9VxJVP7d-7yqW4oWAqbRdhIus9mMsfb';

if (isset($_GET["operacion"])) {
    switch ($_GET['operacion']) {
        case 'obtenerDni':
            if (!empty($_GET['dni'])) {
                $dni = urlencode($_GET['dni']);
                $url = "https://api.apis.net.pe/v2/reniec/dni?numero=$dni";
                $context = stream_context_create(['http' => ['header' => "Authorization: Bearer $token"]]);
                echo file_get_contents($url, false, $context);
            } else {
                echo json_encode(['error' => 'Número de DNI no proporcionado']);
            }
            break;
        case 'obtenerRuc':
            if (!empty($_GET['ruc'])) {
                $ruc = urlencode($_GET['ruc']);
                $url = "https://api.apis.net.pe/v2/sunat/ruc/full?numero=$ruc";
                $context = stream_context_create(['http' => ['header' => "Authorization: Bearer $token"]]);
                echo file_get_contents($url, false, $context);
            } else {
                echo json_encode(['error' => 'RUC incorrecto']);
            }
            break;
        case 'buscarPersonaDni':
            if (!empty($_GET['dni'])) {
                $resultado = $persona->buscarPersonaDni(['dni' => $_GET['dni']]);
                echo json_encode($resultado);
            }
            break;
        default:
            echo json_encode(['error' => 'Operación no válida']);
            break;
    }
}

if (isset($_POST["operacion"])) {
    if ($_POST["operacion"] == "registrarPersona") {
        $datos = [
            "tipoDoc"               => $_POST["tipoDoc"],
            "nroDoc"                => $_POST["nroDoc"],
            "apellidos"             => $_POST["apellidos"],
            "nombres"               => $_POST["nombres"],
            "telefono"              => $_POST["telefono"],
            "nacionalidad"          => $_POST["nacionalidad"],
            "email"                 => $_POST["email"],
            "idUsuario"         => $_POST["idUsuario"]
        ];
        $resultado = $persona->registrarPersona($datos);
        echo json_encode($resultado);
    }
}