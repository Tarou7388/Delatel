<?php

use App\Controllers\Herramientas;

require_once '../models/Empresa.php';
require_once './Herramientas.php';

$empresa = new Empresa();

if ($_POST["operacion"] == "registrarEmpresa") {
    $datos = [
        "ruc"                   => Herramientas::sanitizarEntrada($_POST["ruc"]),
        "representanteLegal"   => Herramientas::sanitizarEntrada($_POST["representanteLegal"]),
        "razonSocial"          => Herramientas::sanitizarEntrada($_POST["razonSocial"]),
        "nombreComercial"      => Herramientas::sanitizarEntrada($_POST["nombreComercial"]),
        "telefono"              => Herramientas::sanitizarEntrada($_POST["telefono"]),
        "email"                 => Herramientas::sanitizarEntrada($_POST["email"]),
        "idUsuario"         => Herramientas::sanitizarEntrada($_POST["idUsuario"])
    ];
    
    $resultado = $empresa->registrarEmpresa($datos);
    echo json_encode($resultado);
}