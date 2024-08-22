<?php
require_once "../models/Kardex.php";

$kardex = new Kardex();

if (isset($_POST['operacion'])) {
  switch ($_POST['operacion']) {

    case 'add':
      $datos = [
        "id_producto"            => $_POST['idproducto'],
        "fecha"                  => $_POST['fecha'],
        "tipo_operacion"         => $_POST['tipooperacion'],
        "motivo"                 => $_POST['motivo'],
        "cantidad"               => $_POST['cantidad'],
        "valor_unitario_historico" => $_POST['valorunitariohistorico'],
      ];
      $resultado = $kardex->add($datos);
      echo json_encode($resultado);
      break;
  }
}


if (isset($_GET["operacion"])) {
  switch ($_GET['operacion']) {
    case "getAll":
      $resultado = $kardex->getAll();
      echo json_encode($resultado);
      break;

    case "obtenerStock":
      echo json_encode($kardex->getStockById(["id_producto" => $_GET['id_producto']]));
      break;
  }
}
