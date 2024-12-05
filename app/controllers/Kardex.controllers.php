<?php

use App\Controllers\Herramientas;

require_once "../models/Kardex.php";
require_once "./Herramientas.php";

$kardex = new Kardex();

if (isset($_POST['operacion'])) {
  switch ($_POST['operacion']) {
    case 'registrarKardex':
      $datos = [
        "idAlmacen"            => Herramientas::sanitizarEntrada($_POST['idAlmacen']),
        "idProducto"            => Herramientas::sanitizarEntrada($_POST['idProducto']),
        "fecha"                 => Herramientas::sanitizarEntrada($_POST['fecha']),
        "idtipoOperacion"         => Herramientas::sanitizarEntrada($_POST['idtipoOperacion']),
        "cantidad"              => Herramientas::sanitizarEntrada($_POST['cantidad']),
        "valorUnitarioHistorico" => Herramientas::sanitizarEntrada($_POST['valorUnitarioHistorico']),
        "idUsuario"             => Herramientas::sanitizarEntrada($_POST["idUsuario"])
      ];
      $estado = $kardex->registrarKardex($datos);
      echo json_encode(["Guardado" => $estado]);
      break;
  }
}

if (isset($_GET["operacion"])) {
  switch ($_GET['operacion']) {
    case 'listarKardex':
      $kardex = $kardex->listarKardex();
      echo json_encode($kardex);
      break;

    case "buscarStockId":

      $idProducto = Herramientas::sanitizarEntrada($_GET['idProducto']);
      $idAlmacen =  Herramientas::sanitizarEntrada($_GET['idAlmacen']);

      echo json_encode($kardex->buscarStockId(["idProducto" => $idProducto, "idAlmacen" => $idAlmacen]));
      break;

    case "obtenerProducto":
      echo json_encode(["hola" => "mundo"]);
      //echo json_encode($kardex->buscarProductoId(["id_producto" => Herramientas::sanitizarEntrada($_GET['id_producto'])]));
      break;
  }
}
