<?php

use App\Controllers\Herramientas;

session_start();

require_once '../Models/Producto.php';
require_once './Herramientas.php';

$producto = new Producto();

if (isset($_POST['operacion'])) {
  switch ($_POST['operacion']) {
    case 'registrarProducto':
      $datos = [
        "marca"             => Herramientas::sanitizarEntrada($_POST['marca']),
        "tipo_producto"     => Herramientas::sanitizarEntrada($_POST['tipoProducto']),
        "modelo"            => Herramientas::sanitizarEntrada($_POST['modelo']),
        "precio_actual"     => Herramientas::sanitizarEntrada($_POST['precioActual']),
        "Codigo_Barras"     => Herramientas::sanitizarEntrada($_POST['codigoBarra']),
        "iduser_create"     => Herramientas::sanitizarEntrada($_POST["idUsuario"])
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
      $resultado = $producto->buscarProductoId(["idProducto" => Herramientas::sanitizarEntrada($_GET['id_producto'])]);
      echo json_encode($resultado);
      break;
  }
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  $inputData = file_get_contents('php://input');
  $data = json_decode($inputData, true);
  $operacion = Herramientas::sanitizarEntrada($data['operacion']);
  switch($operacion){
    case "actualizarProducto":
      $datos = [
        "idProducto"    => Herramientas::sanitizarEntrada($data['idProducto']),
        "marca"         => Herramientas::sanitizarEntrada($data['marca']),
        "tipoProducto"  => Herramientas::sanitizarEntrada($data['tipoProducto']),
        "modelo"        => Herramientas::sanitizarEntrada($data['modelo']),
        "precioActual"  => Herramientas::sanitizarEntrada($data['precioActual']),
        "codigoBarra"   => Herramientas::sanitizarEntrada($data['codigoBarra']),
        "idUsuario"     => Herramientas::sanitizarEntrada($data['idUsuario'])
      ];
      $estado = $producto->actualizarProducto($datos);
      echo json_encode(["Actualizado" => $estado]);
      break;
  }
}
?>
