<?php

require_once '../models/Empresa.php';

$empresa = new Empresa();

if ($_POST["operacion"] == "Registrar") {
    $datos = [
        "ruc"                   => $_POST["ruc"],
        "representante_legal"   => $_POST["representante_legal"],
        "razon_social"          => $_POST["razon_social"],
        "nombre_comercial"      => $_POST["nombre_comercial"],
        "telefono"              => $_POST["telefono"],
        "email"                 => $_POST["email"],
        "iduser_create"         => $_POST["iduser_create"]
    ];
    
    $resultado = $empresa->registrar($datos);
    echo json_encode(["guardado" => $resultado]);
}