<?php

use App\Controllers\Herramientas;

session_start();

require_once '../models/Producto.php';
require_once './Herramientas.php';

$producto = new Producto();
$input = json_decode(file_get_contents('php://input'), true);

if (isset($_POST['operacion'])) {
	switch ($_POST['operacion']) {
		case 'registrarProducto':
			$datos = [
				"idmarca" => Herramientas::sanitizarEntrada($_POST['idmarca']),
				"idtipoProducto" => Herramientas::sanitizarEntrada($_POST['idtipoProducto']),
				"idUnidad" => Herramientas::sanitizarEntrada($_POST['idUnidad']),
				"modelo" => Herramientas::sanitizarEntrada($_POST['modelo']),
				"precioActual" => Herramientas::sanitizarEntrada($_POST['precioActual']),
				"codigoBarra" => Herramientas::sanitizarEntrada($_POST['codigoBarra']),
				"idUsuario" => Herramientas::sanitizarEntrada($_POST["idUsuario"]),
				"categoria" => Herramientas::sanitizarEntrada($_POST["categoria"])
			];
			$estado = $producto->registrarProducto($datos);
			echo json_encode(["Guardado" => $estado]);
			break;
	}
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	if (isset($input['operacion'])) {
		switch ($input['operacion']) {
			case 'registrarTipoProducto':
				$datos = [
					"tipoProducto" => Herramientas::sanitizarEntrada($input['tipoProducto']),
					"idUsuario" => Herramientas::sanitizarEntrada($input["idUsuario"])
				];
				$estado = $producto->registrarTipoProducto($datos);
				echo json_encode(["guardado" => $estado]);
				break;
		}
	}
}

if (isset($_GET['operacion'])) {
	switch ($_GET['operacion']) {
		case 'listarProductos':
			$producto = $producto->listarProductos();
			echo json_encode($producto);
			break;
		case "buscarProductoId":
			$resultado = $producto->buscarProductoId(["idProducto" => Herramientas::sanitizarEntrada($_GET['idProducto'])]);
			echo json_encode($resultado);
			break;
		case "listarTipoProductos":
			$resultado = $producto->listarTipoProductos();
			echo json_encode($resultado);
			break;
		case "buscarProductoBarra":
			$resultado = $producto->BuscarProductoBarra(["codigoBarra" => Herramientas::sanitizarEntrada($_GET['codigoBarra'])]);
			echo json_encode($resultado);
			break;
		case "buscarProductoBarraSintonizador":
			$resultado = $producto->BuscarProductoBarraSintonizador(["codigoBarra" => Herramientas::sanitizarEntrada($_GET['codigoBarra'])]);
			echo json_encode($resultado);
			break;
		case "buscarProductoBarraRepetidor":
			$resultado = $producto->BuscarProductoBarraRepetidor(["codigoBarra" => Herramientas::sanitizarEntrada($_GET['codigoBarra'])]);
			echo json_encode($resultado);
			break;
		case "buscarProductoBarraRouter":
			$resultado = $producto->BuscarProductoBarraRouter(["codigoBarra" => Herramientas::sanitizarEntrada($_GET['codigoBarra'])]);
			echo json_encode($resultado);
			break;
		case "buscarTipoProductobyId":
			$resultado = $producto->listarTipoProductoPorId(['idTipo' => $_GET['idTipo']]);
			echo json_encode($resultado);
			break;
		case "listarProductosPorTipo":
			$resultado = $producto->listarProductosPorTipo(
				[
					"codigoBarra" => Herramientas::sanitizarEntrada($_GET['codigoBarra']),
					"tipoProducto" => Herramientas::sanitizarEntrada($_GET['tipoProducto'])
				]
			);
			echo json_encode($resultado);
			break;
	}
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
	$inputData = file_get_contents('php://input');
	$data = json_decode($inputData, true);
	$operacion = $data['operacion'];
	switch ($operacion) {
		case "actualizarProducto":
			$datos = [
				"idProducto" => Herramientas::sanitizarEntrada($data['idProducto']),
				"idmarca" => Herramientas::sanitizarEntrada($data['idmarca']),
				"idtipoProducto" => Herramientas::sanitizarEntrada($data['idtipoProducto']),
				"idUnidad" => Herramientas::sanitizarEntrada($data['idUnidad']),
				"modelo" => Herramientas::sanitizarEntrada($data['modelo']),
				"precioActual" => Herramientas::sanitizarEntrada($data['precioActual']),
				"idUsuario" => Herramientas::sanitizarEntrada($data["idUsuario"]),
				"categoria" => Herramientas::sanitizarEntrada($data["categoria"])
			];
			$estado = $producto->actualizarProducto($datos);
			echo json_encode(["Actualizado" => $estado]);
			break;
		case "EliminarProducto":
			$datos = [
				"idProducto" => Herramientas::sanitizarEntrada($data['idProducto']),
				"idUsuario" => Herramientas::sanitizarEntrada($data["idUsuario"])
			];
			$estado = $producto->EliminarProducto($datos);
			echo json_encode(["Eliminado" => $estado]);
			break;
		case "actualizarTipoProducto":
			$datos = [
				"idTipo" => Herramientas::sanitizarEntrada($data['idTipo']),
				"tipoNombre" => Herramientas::sanitizarEntrada($data['tipoNombre']),
				"idUsuario" => Herramientas::sanitizarEntrada($data["idUsuario"])
			];
			$estado = $producto->actualizarTipoProducto($datos);
			echo json_encode(["Actualizado" => $estado]);
			break;
	}
}
