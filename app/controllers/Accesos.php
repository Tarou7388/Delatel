<?php
session_start();
//IO JSON
header("Content-type: application/json; charset=utf-8");

//require_once '../models/Conexion.php'; // Asegúrate de incluir tu archivo de conexión a la base de datos
require_once '../models/Rol.php'; // Asegúrate de incluir tu modelo de roles

// Función para cargar permisos
function cargarPermisos($idRol)
{
	// Crear una instancia del modelo de roles
	$rolModel = new Rol();

	// Obtener los permisos desde la base de datos
	$params = ['idRol' => $idRol];
	$resultado = $rolModel->listarPermisosIdRol($params);

	// Convertir el resultado en un array de permisos

	return $resultado;
}

// Función para obtener accesos filtrados
function obtenerAccesosFiltrados($permissions)
{
	// Definir accesos basados en permisos
	$accesosV2 = [
		["ruta" => "Administracion", "texto" => "Administracion", "icono" => "fa-solid fa-cogs", "Desplegable" => true, "rutasAnexas" => ["Mapa"], "IconoAnexo" => ["fa-solid fa-map"]],
		["ruta" => "Contratos", "texto" => "Contratos", "icono" => "fa-solid fa-file-contract", "rutasAnexas" => ["FichaTecnicaCable", "FichaTecnicaGpon", "FichaTecnicaWisp", "FichaTecnicaFibra"]],
		["ruta" => "Inventariado", "texto" => "Inventariado", "icono" => "fa-solid fa-warehouse", "Desplegable" => true, "rutasAnexas" => ["Kardex", "Productos"], "IconoAnexo" => ["fa-solid fa-warehouse", "fa-solid fa-boxes-stacked"]],
		["ruta" => "Personas", "texto" => "Personas", "icono" => "fa-solid fa-user"],
		["ruta" => "Ticket", "texto" => "Ticket", "icono" => "fa-solid fa-tasks", "rutasAnexas" => ["listarAverias"]],
		["ruta" => "Roles", "texto" => "Roles", "icono" => "fa-regular fa-address-card"],
		["ruta" => "Soporte", "texto" => "Soporte", "icono" => "fa-solid fa-wrench", "rutasAnexas" => ["registroSoporte", "SoporteEscritorio", "listarSoporte", "SoporteCABL", "SoporteFIBR", "SoporteWISP"]],
		["ruta" => 'Usuarios', "texto" => "Usuarios", "icono" => "fa-solid fa-users", "rutasAnexas" => ["registrar"]],
		["ruta" => 'Reportes', "texto" => "Reportes", "icono" => "fa-solid fa-wrench", "rutasAnexas" => ["tablaContrato", "listarReporte"]],
		["ruta" => 'Paquetes', "texto" => "Paquetes", "icono" => "fa-solid fa-box-open"],
		["ruta" => "Almacen", "texto" => "Almacen", "icono" => "fa-solid fa-warehouse"]
	];

	$accesosFiltrados = [
		["ruta" => "views", "texto" => "Actividades", "icono" => "fa-solid fa-chart-line"]
	];

	// Filtrar accesos basados en permisos
	foreach ($accesosV2 as $acceso) {
		$modulo = strtolower($acceso['texto']);
		if (isset($permissions[$modulo]) && isset($permissions[$modulo]['leer']) && $permissions[$modulo]['leer'] == "1") {
			$accesosFiltrados[] = $acceso;
		}
	}

	return $accesosFiltrados;
}
