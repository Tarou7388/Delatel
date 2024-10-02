<?php

session_start();

require_once "../models/Servicio.php";

$servicio = new Servicio();

if($_POST["operacion"]==["add"])
{
  $datos=[
    "servicio"        =>$_POST["servicio"],
    "iduser_create"   =>$_POST["iduser_create"]
  ];

  $resultado = $empresa->registrar($datos);
  echo json_encode(["guardado" => $resultado]);
}