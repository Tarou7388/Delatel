<?php
require_once "../models/Kardex.php";

$kardex = new Kardex();

if (isset($_POST['operacion'])) {
  switch ($_POST['operacion']) {
    case 'registrarKardex':
      $datos = [
        "idProducto"            => $_POST['idProducto'],
        "fecha"                  => $_POST['fecha'],
        "tipoOperacion"         => $_POST['tipoOperacion'],
        "motivo"                 => $_POST['motivo'],
        "cantidad"               => $_POST['cantidad'],
        "valorUnitarioHistorico" => $_POST['valorUnitarioHistorico'],
        "idUsuario"         => $_POST["idUsuario"]
      ];
      $estado = $kardex->registrarKardex($datos);
      echo json_encode(["Guardado" => $estado]);
      break;
  }
}

if (isset($_GET["operacion"])) {
  switch ($_GET['operacion']) {
    case "listarKardex":
      $resultado = $kardex->listarKardex();
      echo json_encode($resultado);
      break;

    case "buscarStockId":
      echo json_encode($kardex->buscarStockId(["idProducto" => $_GET['idProducto']]));
      break;

    case "obtenerProducto":
      echo json_encode($kardex->buscarProductoId(["id_producto" => $_GET['id_producto']]));
      break;
  }
}
