<?php

session_start();

require_once "../models/Sector.php";

$sectores = new Sector();

if ($_POST["operacion"] == ["add"]) {
  $datos = [
    "id_distrito"       => $_POST["id_distrito"],
    "sector"            => $_POST["sector"],
    "iduser_create"     => $_POST["iduser_create"]

  ];

  $resultado = $empresa->registrar($datos);
  echo json_encode(["guardado" => $resultado]);
}
if (isset($_GET["operacion"])) {
  $resultado = $sectores->getAll();
  echo json_encode($resultado);
}
