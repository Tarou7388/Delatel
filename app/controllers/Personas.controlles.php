<?php

use App\Controllers\Herramientas;

require_once '../models/Persona.php';
require_once './Herramientas.php'; // Asegúrate de incluir la clase Herramientas


$persona = new Persona();
$token = 'apis-token-10446.A9VxJVP7d-7yqW4oWAqbRdhIus9mMsfb';

if (isset($_GET["operacion"])) {
    $operacion = Herramientas::sanitizarEntrada($_GET['operacion']);
    switch ($operacion) {
        case 'obtenerDni':
            if (!empty($_GET['dni'])) {
                $dni = urlencode(Herramientas::sanitizarEntrada($_GET['dni']));
                $url = "https://api.apis.net.pe/v2/reniec/dni?numero=$dni";
                $context = stream_context_create(['http' => ['header' => "Authorization: Bearer $token"]]);
                echo file_get_contents($url, false, $context);
            } else {
                echo json_encode(['error' => 'Número de DNI no proporcionado']);
            }
            break;
        case 'obtenerRuc':
            if (!empty($_GET['ruc'])) {
                $ruc = urlencode(Herramientas::sanitizarEntrada($_GET['ruc']));
                $url = "https://api.apis.net.pe/v2/sunat/ruc/full?numero=$ruc";
                $context = stream_context_create(['http' => ['header' => "Authorization: Bearer $token"]]);
                echo file_get_contents($url, false, $context);
            } else {
                echo json_encode(['error' => 'RUC incorrecto']);
            }
            break;
        case 'buscarPersonaDni':
            if (!empty($_GET['dni'])) {
                $dni = Herramientas::sanitizarEntrada($_GET['dni']);
                $resultado = $persona->buscarPersonaDni(['dni' => $dni]);
                echo json_encode($resultado);
            }
            break;
        default:
            echo json_encode(['error' => 'Operación no válida']);
            break;
    }
}

if (isset($_POST["operacion"])) {
    $operacion = Herramientas::sanitizarEntrada($_POST['operacion']);
    if ($operacion == "registrarPersona") {
        $datos = [
            "tipoDoc"       => Herramientas::sanitizarEntrada($_POST["tipoDoc"]),
            "nroDoc"        => Herramientas::sanitizarEntrada($_POST["nroDoc"]),
            "apellidos"     => Herramientas::sanitizarEntrada($_POST["apellidos"]),
            "nombres"       => Herramientas::sanitizarEntrada($_POST["nombres"]),
            "telefono"      => Herramientas::sanitizarEntrada($_POST["telefono"]),
            "nacionalidad"  => Herramientas::sanitizarEntrada($_POST["nacionalidad"]),
            "email"         => Herramientas::sanitizarEntrada($_POST["email"]),
            "idUsuario"     => Herramientas::sanitizarEntrada($_POST["idUsuario"])
        ];
        $resultado = $persona->registrarPersona($datos);
        echo json_encode($resultado);
    }
}
