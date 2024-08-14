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
        "marca"                 => $_POST['marca'],
        "precio_actual"         => $_POST['precio_actual'],
      ];
      $resultado = $producto->add($datos);
      echo json_encode($resultado);
      break;
  }
}
