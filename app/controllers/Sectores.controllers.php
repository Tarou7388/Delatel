<?php

session_start();

require_once "../models/Sector.php";

$sectores = new Sector();

if (isset($_POST["operacion"]) && $_POST["operacion"] == "add") {
    $datos = [
        "id_distrito"   => $_POST["id_distrito"],
        "sector"        => $_POST["sector"],
        "iduser_create" => $_POST["iduser_create"]
    ];

    $resultado = $sectores->add($datos);
    echo json_encode(["guardado" => $resultado]);
    exit;
}

if (isset($_GET["operacion"])) {
    if ($_GET["operacion"] == "getAll") {
        $resultado = $sectores->getAll();
        echo json_encode($resultado);
        exit;
    }
}
