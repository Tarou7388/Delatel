<?php

session_start();

require_once "../models/Paquete.php";

$paquete = new Paquete();

if($_POST["operacion"]==["add"])
{
  $datos=[
   "id_servicio"      => $_POST["id_servicio"],
   "precio"           => $_POST["precio"],
   "fecha_inicio"     => $_POST["fecha_inicio"],
   "fecha_fin"        => $_POST["fecha_fin"],
   "iduser_create"    => $_POST["iduser_create"]

  ];

  $resultado = $empresa->registrar($datos);
  echo json_encode(["guardado" => $resultado]);
}