<?php

use App\Controllers\Herramientas;

session_start();

require_once "../models/Sector.php";
require_once "./Herramientas.php";


$sectores = new Sector();

if (isset($_POST["operacion"])) {
	$operacion = Herramientas::sanitizarEntrada($_POST["operacion"]);
	switch ($operacion) {
		case "registrarSector":
			$datos = [
				"idDistrito"   => Herramientas::sanitizarEntrada($_POST["idDistrito"]),
				"sector"       => Herramientas::sanitizarEntrada($_POST["sector"]),
				"descripcion"    => Herramientas::sanitizarEntrada($_POST["descripcion"]),
				"coordenadas"    => $_POST["coordenadas"],
				"idUsuario"    => Herramientas::sanitizarEntrada($_POST["idUsuario"]),
			];

			$resultado = $sectores->registrarSector($datos);
			echo json_encode($resultado);
			break;
	}
}

if (isset($_GET["operacion"])) {
	$operacion = Herramientas::sanitizarEntrada($_GET["operacion"]);
	switch ($operacion) {
		case "listarSectores":
			$resultado = $sectores->listarSectores();
			echo json_encode($resultado);
			break;
		case 'listarSectoresMapa':
			$resultado = $sectores->listarSectoresMapa();
			echo json_encode($resultado);
			break;
		case 'buscarSector':
			$resultado = $sectores->buscarSector(["idSector" => Herramientas::sanitizarEntrada($_GET['idSector'])]);
			echo json_encode($resultado);
			break;
		case 'sectoresBuscarMultiple':
			$idsSectores = isset($_GET['ids']) ? $_GET['ids'] : '';
			if (empty($idsSectores)) {
				echo json_encode([]);
				exit;
			}
			$validos = true;
			$arrayIds = explode(',', $idsSectores);
			foreach ($arrayIds as $id) {
				if (!is_numeric($id)) {
					$validos = false;
					break;
				}
			}
			if (!$validos || empty($arrayIds)) {
				echo json_encode([]);
				exit;
			}
			echo json_encode($sectores->sectoresBuscarMultiple($idsSectores));
			break;
	}
}

if ($_SERVER["REQUEST_METHOD"] === "PUT") {
	$json = file_get_contents("php://input");
	$datos = json_decode($json, true);
	switch ($datos["operacion"]) {
		case "desactivarSector":
			$datos = [
				"idSector" => Herramientas::sanitizarEntrada($datos["idSector"]),
				"idUsuario" => Herramientas::sanitizarEntrada($datos["idUsuario"]),
			];
			$resultado = $sectores->desactivarSector($datos);
			echo json_encode($resultado);
			break;
	}
}
