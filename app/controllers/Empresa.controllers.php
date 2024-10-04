<?php

require_once '../models/Empresa.php';

$empresa = new Empresa();

if ($_POST["operacion"] == "registrarEmpresa") {
    $datos = [
        "ruc"                   => $_POST["ruc"],
        "representante_legal"   => $_POST["representanteLegal"],
        "razon_social"          => $_POST["razonSocial"],
        "nombre_comercial"      => $_POST["nombreComercial"],
        "telefono"              => $_POST["telefono"],
        "email"                 => $_POST["email"],
        "iduser_create"         => $_POST["idUsuario"]
    ];
    
    $resultado = $empresa->registrarEmpresa($datos);
    echo json_encode($resultado);
}