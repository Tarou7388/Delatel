<?php
session_start();

require_once '../Models/Producto.php';

$producto = new Producto();

if (isset($_POST['operacion'])) {
  switch ($_POST['operacion']) {
    case 'add':
      $datos = [
        "tipo_producto"         => $_POST['tipo_producto'],
        "nombreProducto"        => $_POST['nombreProducto'],
        "precio_actual"         => $_POST['precio_actual'],
        "marca"                 => $_POST['marca'],
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
