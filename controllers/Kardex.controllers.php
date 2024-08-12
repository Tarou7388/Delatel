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
