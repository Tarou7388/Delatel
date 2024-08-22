<?php
session_start();

require_once '../Models/Producto.php';

$producto = new Producto();

if (isset($_POST['operacion'])) {
  switch ($_POST['operacion']) {
    case 'add':
      $datos = [
        "marca"             => $_POST['marca'],
        "tipo_producto"     => $_POST['tipo_producto'],
        "modelo"            => $_POST['modelo'],
        "precio_actual"     => $_POST['precio_actual'],
        "Codigo_Barras"     => $_POST['Codigo_Barras']
      ];
      $resultado = $producto->add($datos);
      echo json_encode($resultado);
      break;
  }
}

if (isset($_GET['operacion'])) {
  switch ($_GET['operacion']) {
    case "getAll":
      $resultado = $producto->getAll();
      echo json_encode($resultado);
      break;
  }
}
