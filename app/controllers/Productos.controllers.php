<?php
session_start();

require_once '../Models/Producto.php';

$producto = new Producto();

if (isset($_POST['operacion'])) {
  switch ($_POST['operacion']) {
    case 'registrarProducto':
      $datos = [
        "marca"             => $_POST['marca'],
        "tipo_producto"     => $_POST['tipo_producto'],
        "modelo"            => $_POST['modelo'],
        "precio_actual"     => $_POST['precio_actual'],
        "Codigo_Barras"     => $_POST['Codigo_Barras'],
        "iduser_create"         => $_POST["iduser_create"]
      ];
      $estado = $producto->registrarProducto($datos);
      echo json_encode(["Guardado" => $estado]);
      break;
  }
}

if (isset($_GET['operacion'])) {
  switch ($_GET['operacion']) {
    case "listarProductos":
      $estado = $producto->listarProductos();
      echo json_encode($estado);
      break;
    case "buscarProductoId":
      $resultado = $producto->buscarProductoId(["id_producto" => $_GET['id_producto']]);
      echo json_encode($resultado);
      break;
  }
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  $inputData = file_get_contents('php://input');
  $data = json_decode($inputData, true);
  $operacion = $data['operacion'];
  switch($operacion){
    case "actualizarProducto":
      $datos = [
        "idProducto"    => $data['idProducto'],
        "marca"          => $data['marca'],
        "tipoProducto"  => $data['tipoProducto'],
        "modelo"         => $data['modelo'],
        "precioActual"  => $data['precioActual'],
        "codigoBarra"   => $data['codigoBarra'],
        "idUsuario"    => $data['idUsuario']
      ];
      $estado = $producto->actualizarProducto($datos);
      echo json_encode(["Actualizado" => $estado]);
      break;
  }
}
