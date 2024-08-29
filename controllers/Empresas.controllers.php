<?php

require_once '../models/Persona.php';

$persona = new Persona();

if(isset($_GET["Operacion"])){

}

if(isset($_POST["Operacion"])){
    if($_POST["Operacion"] == "Registrar"){
        $datos=[
            "ruc"                   => $_POST["ruc"],
            "representante_legal"   => $_POST["representante_legal"],
            "razon_social"          => $_POST["razon_social"],
            "nombre_comercial"      => $_POST["nombre_comercial"],
            "telefono"              => $_POST["telefono"],
            "email"                 => $_POST["email"]
        ];
        $resultado=$persona->registrar($datos);
        echo json_encode(["guardado" => $resultado]);
    }
}