<?php

use App\Controllers\Herramientas;

session_start();

require_once '../models/Producto.php';
require_once './Herramientas.php';

$producto = new Producto();

if (isset($_POST['operacion'])) {
  switch ($_POST['operacion']) {
    case 'registrarProducto':
      $datos = [
        "idmarca"             => Herramientas::sanitizarEntrada($_POST['idmarca']),
        "idtipoProducto"     => Herramientas::sanitizarEntrada($_POST['idtipoProducto']),
        "idUnidad"     => Herramientas::sanitizarEntrada($_POST['idUnidad']),
        "modelo"            => Herramientas::sanitizarEntrada($_POST['modelo']),
        "precioActual"     => Herramientas::sanitizarEntrada($_POST['precioActual']),
        "codigoBarra"     => Herramientas::sanitizarEntrada($_POST['codigoBarra']),
        "idUsuario"     => Herramientas::sanitizarEntrada($_POST["idUsuario"])
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
      $resultado = $producto->buscarProductoId(["idProducto" => Herramientas::sanitizarEntrada($_GET['idProducto'])]);
      echo json_encode($resultado);
      break;
    case "listarTipoProductos":
      $resultado = $producto->listarTipoProductos();
      echo json_encode($resultado);
      break;
  }
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  $inputData = file_get_contents('php://input');
  $data = json_decode($inputData, true);
  $operacion = Herramientas::sanitizarEntrada($data['operacion']);
  switch ($operacion) {
    case "actualizarProducto":
      $datos = [
        "idProducto"             => Herramientas::sanitizarEntrada($data['idProducto']),
        "idmarca"             => Herramientas::sanitizarEntrada($data['idmarca']),
        "idtipoProducto"     => Herramientas::sanitizarEntrada($data['idtipoProducto']),
        "idUnidad"     => Herramientas::sanitizarEntrada($data['idUnidad']),
        "modelo"            => Herramientas::sanitizarEntrada($data['modelo']),
        "precioActual"     => Herramientas::sanitizarEntrada($data['precioActual']),
        "idUsuario"     => Herramientas::sanitizarEntrada($data["idUsuario"])
      ];
      $estado = $producto->actualizarProducto($datos);
      echo json_encode(["Actualizado" => $estado]);
      break;
  }
}
