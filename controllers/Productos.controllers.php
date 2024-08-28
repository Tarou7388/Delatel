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
      $estado = $producto->add($datos);
      echo json_encode(["Guardado" => $estado]);
      break;
  }
}

if (isset($_GET['operacion'])) {
  switch ($_GET['operacion']) {
    case "getAll":
      $estado = $producto->getAll();
      echo json_encode($estado);
      break;
    case "getById":
      $resultado = $producto->getbyid(["id_producto" => $_GET['id_producto']]);
      echo json_encode($resultado);
      break;
      
  }
}
