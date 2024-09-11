<?php

session_start();

require_once "../models/Paquete.php";

$paquete = new Paquete();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST["operacion"])) {
  if ($_POST["operacion"] === "add") {
    $datos = [
      "id_servicio"      => $_POST["id_servicio"],
      "precio"           => $_POST["precio"],
      "fecha_inicio"     => $_POST["fecha_inicio"],
      "fecha_fin"        => $_POST["fecha_fin"],
      "iduser_create"    => $_POST["iduser_create"]
    ];

    $resultado = $paquete->add($datos);
    echo json_encode(["guardado" => $resultado]);
  }
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET["operacion"])) {
  if ($_GET["operacion"] === "getAll") {
    $resultado = $paquete->getAll();
    echo json_encode($resultado);
  }
}
