<?php

require_once '../models/Persona.php';

$persona = new Persona();

if(isset($_GET["Operacion"])){

}

if(isset($_POST["Operacion"])){
    if($_POST["Operacion"] == "Registrar"){
        $datos=[
            "tipoDoc"               => $_POST["tipoDoc"],
            "nroDoc"                => $_POST["nroDoc"],
            "apellidos"             => $_POST["apellidos"],
            "nombres"               => $_POST["nombres"],
            "telefono"              => $_POST["telefono"],
            "email"                 => $_POST["email"],
            "iduser_create"         => $_POST["iduser_create"]
        ];
        $resultado=$persona->registrar($datos);
        echo json_encode($resultado);
    }
}