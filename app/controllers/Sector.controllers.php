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
	}
}
