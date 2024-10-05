<?php

session_start();

require_once "../models/Sector.php";

$sectores = new Sector();

if (isset($_POST["operacion"])) {
	switch ($_POST["operacion"]) {
		case "registrarSector":
			$datos = [
				"id_distrito"   => $_POST["id_distrito"],
				"sector"        => $_POST["sector"],
				"iduser_create" => $_POST["iduser_create"]
			];

			$resultado = $sectores->registrarSector($datos);
			echo json_encode(["guardado" => $resultado]);
			break;
	}
}

if (isset($_GET["operacion"])) {
	switch ($_GET["operacion"]) {
		case "listarSectores":
			$resultado = $sectores->listarSectores();
			echo json_encode($resultado);
			break;
	}
}
