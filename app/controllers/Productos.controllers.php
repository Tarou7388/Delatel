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
        "Codigo_Barras"     => $_POST['Codigo_Barras'],
        "iduser_create"         => $_POST["iduser_create"]
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

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  $inputData = file_get_contents('php://input');
  $data = json_decode($inputData, true);

  if (isset($data['id_producto'])) {
    $datos = [
      "marca"          => $data['marca'],
      "tipo_producto"  => $data['tipo_producto'],
      "modelo"         => $data['modelo'],
      "precio_actual"  => $data['precio_actual'],
      "codigo_barra"   => $data['codigo_barra'],
      "id_producto"    => $data['id_producto'],
      "iduser_update"    => $data['iduser_update']
    ];

    $estado = $producto->updateProducto($datos);
    echo json_encode(["Actualizado" => $estado]);
  } else {
    echo json_encode(["Actualizado" => false, "error" => "ID de producto no encontrado"]);
  }
}
